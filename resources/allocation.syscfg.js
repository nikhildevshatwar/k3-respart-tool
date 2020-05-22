// utility functions to allocate resources

// map resources from an array to a map key'ed by the deviceName for easy look up.
const resourcesInfo = _.keyBy(system.getScript("/data/Resources.json"), (r) => r.deviceName);

function getAssignments() {

    const mod = system.modules["/resources/Resource"];
    if (!mod) { // user has not allocated any resources
        return [];
    }

    // get all resource instances
    const insts = mod.$instances;
    const groupedByType = _.groupBy(insts, (i) => i.type);

    const allAssigns = [];

    _.each(groupedByType, (insts, type) => {

        const resourceInfo = resourcesInfo[type];
        let next = Number(resourceInfo.resStart);


        _.each(insts, (inst) => {

            const assignment = {
                type: inst.type,
                start: next,
                end: next + inst.count,
                owner: getStaticOwnerDisplayName(inst),
            };

            next = assignment.end;

            allAssigns.push(assignment);
        });


    });

    return allAssigns;

}

function getStaticOwnerDisplayName(inst) {
    // bit of a hack, static instances don't have link back to 
    // there real parent module, but we can get to it via the name
    return system.getScript(inst.$ownedBy.$name).displayName;
}

exports = {
    getAssignments
};