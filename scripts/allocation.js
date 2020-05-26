const resources = _.keyBy(system.getScript("/data/j721e/Resources.json"), (r) => r.utype);
const hosts = _.keyBy(system.getScript("/data/j721e/Hosts.json"), (r) => r.hostName);


function checkOverlap(utype,inst1){
        var overlap = 0;
        var name = _.join(_.split(utype," "),"_") ;
        var start1 = inst1[name + "_start"], last1 = start1 + inst1[name + "_count"];

        if (system.modules["/modules/hostConfig"]) {
                for (let inst2 of system.modules["/modules/hostConfig"].$instances) {

                        if(inst1 === inst2) continue;

                        var start2 = inst2[name + "_start"],last2 = start2 + inst2[name + "_count"];
                        overlap =  Math.max(start1,start2) < Math.min(last1,last2);
                }
        }

        return overlap;
}


function resourceAllocate(utype){
        var eachResource = [];
        var name = _.join(_.split(utype," "),"_") ;
        var total = 0;

        if(resources[utype].autoAlloc === false){

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
        }
        else{
                if(resources[utype].resRange.length > 1){
                        if (system.modules["/modules/hostConfig"]) {
                                for (let inst of system.modules["/modules/hostConfig"].$instances) {
                                        eachResource.push({
                                                utype : utype,
                                                hostName : inst.hostName,
                                                start :0,
                                                count : 0
                                        });
                                }
                        }
                }
                else{
                        var startValue = resources[utype].resRange[0].resStart;
                        if (system.modules["/modules/hostConfig"]) {
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
                }
        }
        return {
                allocation : eachResource,
                overflowCount : Math.max(0,total - resources[utype].resRange[0].resCount)
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
                                var h1 = a.hostName , h2 = b.hostName;
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