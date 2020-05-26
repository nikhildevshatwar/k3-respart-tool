const resources = _.keyBy(system.getScript("/data/j721e/Resources.json"), (r) => r.utype);
const hosts = _.keyBy(system.getScript("/data/j721e/Hosts.json"), (r) => r.hostName);


function resourceAllocate(utype){
        var eachResource = [];
        var name = _.join(_.split(utype," "),"_")+"_count" ;
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
                                        count : inst.resourceconfig[name]
                                });
                                startValue += inst.resourceconfig[name];
                        }
                }
        }
        return eachResource;
}

function allocateAndSort(skipZeroEntries){
        var allocation = [];

        _.each(resources,(resource) =>{
                var temp = resourceAllocate(resource.utype);
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
        allocateAndSort
};