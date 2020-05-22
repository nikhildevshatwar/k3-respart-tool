
// map resources from an array to a map key'ed by the deviceName for easy look up.
const resourcesInfo = _.keyBy(system.getScript("/data/Resources.json"), (r) => r.deviceName);

// create valid type options
const options = _.map(resourcesInfo, (info) => {
    return { name: info.deviceName }
});

const resourceConfig = {
    name: "type",
    displayName: "Type",
    options: [
        ...options,
        {
            name: "NONE"
        },
    ],
    default: "NONE",
}

const countConfig = {
    name: "count",
    displayName: "How Many?",
    default: 0,
}

const nameConfig = {
    name: "$name",
    hidden: false,

}

function validate(inst, vo) {
    if (inst.type === "NONE") {
        vo.logError("Please specify a resource type", inst, "type");
    }
}

// cross validate instances of resources with the same type.
function validateResourceType(insts, vo) {

    // all insts must have the same type, so just pull the type from the first 1.
    const type = insts[0].type;
    if (type === "NONE") {
        return;
    }

    const resourceInfo = resourcesInfo[type];
    const totalRequested = _.sumBy(insts, (inst) => inst.count);
    if (totalRequested > resourceInfo.resCount) {
        const conflicting = _.join(_.map(insts, (inst) => system.getReference(inst)), ",");
        _.each(insts, (inst) => {
            vo.logError(`Requested resource count exeeds available (${resourceInfo.resCount}). Requested by ${conflicting}`, inst, "count");
        })

    }
}

exports = {
    displayName: "Resource",
    config: [
        nameConfig,
        resourceConfig,
        countConfig,
    ],
    validate,
    moduleStatic: {
        validate: (_staticInst, vo) => {
            // get all resource instances
            const insts = system.modules["/resources/Resource"].$instances;
            const groupedByType = _.groupBy(insts, (i) => i.type);
            _.each(groupedByType, (insts) => {
                validateResourceType(insts, vo);
            });
        },
    }
}