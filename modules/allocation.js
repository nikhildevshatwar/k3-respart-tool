const resources = _.keyBy(system.getScript("/data/j721e/Resources.json"), (r) => r.utype);


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

exports = {
        resourceAllocate
};