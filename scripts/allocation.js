const resources = _.keyBy(system.getScript("/data/j721e/Resources.json"), (r) => r.utype);
const hosts = _.keyBy(system.getScript("/data/j721e/Hosts.json"), (r) => r.hostName);


function checkOverlap(utype,inst1){
        var overlap = [];
        var name = _.join(_.split(utype," "),"_") ;
        var start1 = inst1[name + "_start"], last1 = start1 + inst1[name + "_count"];

        if (system.modules["/modules/hostConfig"]) {
                for (let inst2 of system.modules["/modules/hostConfig"].$instances) {

                        if(inst1 === inst2) continue;

                        var start2 = inst2[name + "_start"],last2 = start2 + inst2[name + "_count"];
                        if(Math.max(start1,start2) < Math.min(last1,last2)){
                                overlap.push(inst2);
                        }
                }
        }

        return overlap;
}

function hostCount(utype,hostName){

        var count = [] , idx = 0;
        _.each(resources[utype].resRange , (r) =>{
                _.each(r.restrictHosts,(h) => {
                        if(h === hostName){
                                count.push(idx);
                        }
                })
                idx++;
        })
        
        return count;
}


function resourceAllocate(utype){
        var eachResource = [];
        var name = _.join(_.split(utype," "),"_") ;
        var over = [];

        if(resources[utype].autoAlloc === false){

                var total = 0;
                if (system.modules["/modules/hostConfig"]) {
                        for (let inst of system.modules["/modules/hostConfig"].$instances) {
                                eachResource.push({
                                        utype : utype,
                                        hostName : inst.hostName,
                                        start : inst[name + "_start"],
                                        count : inst[name + "_count"]
                                });
                                total += inst[name + "_count"];
                        }
                }
                over.push(Math.max(0,total - resources[utype].resRange[0].resCount));
        }
        else{
                if(resources[utype].resRange.length > 1){

                        var rStart = [], rCount = [];
                        _.each(resources[utype].resRange , (r) =>{
                                rStart.push(r.resStart);
                                rCount.push(r.resCount);
                        })

                        if (system.modules["/modules/hostConfig"]) {
                                for (let inst of system.modules["/modules/hostConfig"].$instances) {

                                        var hCount = hostCount(utype,inst.hostName.toUpperCase());
                                        
                                        if(hCount.length === 1){
                                                
                                                var index = hCount[0];
                                                eachResource.push({
                                                        utype : utype,
                                                        hostName : inst.hostName,
                                                        start :rStart[index],
                                                        count : inst[name + "_count"]
                                                });
                                                rStart[index] += inst[name + "_count"];
                                                rCount[index] -= inst[name + "_count"];

                                        }
                                }
                        }
                        
                        _.each(rCount,(r) => {
                                var val =Math.min(0,r);
                                over.push(-val);
                        })
                }
                else{   
                        var total = 0;
                        var startValue = resources[utype].resRange[0].resStart;
                        if (system.modules["/modules/hostConfig"]) {
                                if(resources[utype].blockCopy){
                                        for (let inst of system.modules["/modules/hostConfig"].$instances) {
                                                eachResource.push({
                                                        utype :utype,
                                                        hostName : inst.hostName,
                                                        start :startValue,
                                                        count : inst[name + "_blockCount"]
                                                });
                                                startValue += inst[name + "_blockCount"];
                                                total += inst[name + "_blockCount"];
                                        }
                                }
                                for (let inst of system.modules["/modules/hostConfig"].$instances) {
                                        eachResource.push({
                                                utype :utype,
                                                hostName : inst.hostName,
                                                start :startValue,
                                                count : inst[name + "_count"]
                                        });
                                        startValue += inst[name + "_count"];
                                        total += inst[name + "_count"];
                                }
                        }
                        over.push(Math.max(0,total - resources[utype].resRange[0].resCount));
                }
        }
        return {
                allocation : eachResource,
                overflowCount : over
        };
}

function allocateAndSort(skipZeroEntries){
        var allocation = [];

        _.each(resources,(resource) =>{
                var temp = resourceAllocate(resource.utype).allocation;
                var res = [];
                if(skipZeroEntries){
                        _.each(temp ,(t) =>{
                                if(t.count){
                                        res.push(t);
                                }
                        })
                }
                else{
                        res = temp;
                }
                res.sort(function(a,b){
                        if(a.start < b.start){
                                return -1;
                        }
                        else if(a.start > b.start){
                                return 1;
                        }
                        else{
                                var h1 = a.hostName.toUpperCase() , h2 = b.hostName.toUpperCase();
                                return hosts[h1].hostId - hosts[h2].hostId;
                        }
                })
                if(res.length)
                        allocation.push(res);
        })
        allocation.sort(function(a,b){
                var u1 = a[0].utype , u2 = b[0].utype ;
                return resources[u1].uniqueId - resources[u2].uniqueId; 
        })

        return allocation;
}

function mapByResources(){
        var allocation = allocateAndSort(true);
        var resourcesMap ;
        if(allocation.length){
                resourcesMap = _.keyBy(allocation, (all) => all[0].utype);
        }
        return resourcesMap;
}

exports = {
        allocateAndSort,
        checkOverlap,
        resourceAllocate
};