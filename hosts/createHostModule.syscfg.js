
// Returns values from 0 to 2^val in form of options 
function optionValues(val) {
    var option = [];
    for (var i = 0; i < (1 << val); i++) {
        option.push({
            name: i,
            displayName: i.toString(),
        });
    }
    return option;
}


function createHostModule(hostInfo) {

    const def = {
        displayName: hostInfo.hostName,
        description: hostInfo.Description,
        moduleStatic: {
            config: [
                // Description
                {
                    name: "description",
                    displayName: "Description",
                    readOnly: true,
                    default: "Unknown",
                },
                // Security
                {
                    name: "security",
                    displayName: "Secure",
                    readOnly: true,
                    default: hostInfo.Security === "Secure",
                },
                // Allowed atypes
                {
                    name: "allowedAtype",
                    displayName: "Allowed values of atype",
                    options: [{
                        name: 0,
                        displayName: "Physical address"
                    },
                    {
                        name: 1,
                        displayName: "Intermediate Physical address"
                    },
                    {
                        name: 2,
                        displayName: "Virtual address"
                    },
                    ],
                    default: [0, 1, 2],
                },
                // Allowed values of qos
                {
                    name: "allowedqos",
                    displayName: "Allowed values of qos",
                    default: "unknown",
                    options: optionValues(3),
                    default: [0, 1, 2, 3, 4, 5, 6, 7],
                },
                // Allowed values of orderid
                {
                    name: "allowedorderid",
                    displayName: "Allowed values of orderid",
                    default: "unknown",
                    options: optionValues(4),
                    default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                },
                // Allowed values of priority
                {
                    name: "allowedpriority",
                    displayName: "Allowed values of priority",
                    default: "unknown",
                    options: optionValues(3),
                    default: [0, 1, 2, 3, 4, 5, 6, 7],
                },
                // Allowed values of schedpriority
                {
                    name: "allowedschedpriority",
                    displayName: "Allowed values of schedpriority",
                    default: "unknown",
                    options: optionValues(2),
                    default: [0, 1, 2, 3],
                },
            ],
            moduleInstances: (_inst) => {
                return [{
                    name: "resources",
                    displayName: "Resources",
                    moduleName: "/resources/Resource",
                    useArray: true,
                    collapsed: false,
                }]
            },
        }
    };

    return def;
}

exports = {
    createHostModule,
}
