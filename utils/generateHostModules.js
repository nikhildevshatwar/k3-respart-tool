
const fs = require("fs");

const hosts = [
    {
        hostId: 0,
        hostName: 'DMSC',
        Security: 'Secure',
        Description: 'Device Management and Security Control'
    },
    {
        hostId: 3,
        hostName: 'MCU_0_R5_0',
        Security: 'Non Secure',
        Description: 'Cortex R5 context 0 on MCU island'
    },
    {
        hostId: 4,
        hostName: 'MCU_0_R5_1',
        Security: 'Secure',
        Description: 'Cortex R5 context 1 on MCU island(Boot)'
    },
    {
        hostId: 5,
        hostName: 'MCU_0_R5_2',
        Security: 'Non Secure',
        Description: 'Cortex R5 context 2 on MCU island'
    },
    {
        hostId: 6,
        hostName: 'MCU_0_R5_3',
        Security: 'Secure',
        Description: 'Cortex R5 context 3 on MCU island'
    },
    {
        hostId: 10,
        hostName: 'A72_0',
        Security: 'Secure',
        Description: 'Cortex A72 context 0 on Main island'
    },
    {
        hostId: 11,
        hostName: 'A72_1',
        Security: 'Secure',
        Description: 'Cortex A72 context 1 on Main island'
    },
    {
        hostId: 12,
        hostName: 'A72_2',
        Security: 'Non Secure',
        Description: 'Cortex A72 context 2 on Main island'
    },
    {
        hostId: 13,
        hostName: 'A72_3',
        Security: 'Non Secure',
        Description: 'Cortex A72 context 3 on Main island'
    },
    {
        hostId: 14,
        hostName: 'A72_4',
        Security: 'Non Secure',
        Description: 'Cortex A72 context 4 on Main island'
    },
    {
        hostId: 20,
        hostName: 'C7X_0',
        Security: 'Secure',
        Description: 'C7x Context 0 on Main island'
    },
    {
        hostId: 21,
        hostName: 'C7X_1',
        Security: 'Non Secure',
        Description: 'C7x context 1 on Main island'
    },
    {
        hostId: 25,
        hostName: 'C6X_0_0',
        Security: 'Secure',
        Description: 'C6x_0 Context 0 on Main island'
    },
    {
        hostId: 26,
        hostName: 'C6X_0_1',
        Security: 'Non Secure',
        Description: 'C6x_0 context 1 on Main island'
    },
    {
        hostId: 27,
        hostName: 'C6X_1_0',
        Security: 'Secure',
        Description: 'C6x_1 Context 0 on Main island'
    },
    {
        hostId: 28,
        hostName: 'C6X_1_1',
        Security: 'Non Secure',
        Description: 'C6x_1 context 1 on Main island'
    },
    {
        hostId: 30,
        hostName: 'GPU_0',
        Security: 'Non Secure',
        Description: 'RGX context 0 on Main island'
    },
    {
        hostId: 35,
        hostName: 'MAIN_0_R5_0',
        Security: 'Non Secure',
        Description: 'Cortex R5_0 context 0 on Main island'
    },
    {
        hostId: 36,
        hostName: 'MAIN_0_R5_1',
        Security: 'Secure',
        Description: 'Cortex R5_0 context 1 on Main island'
    },
    {
        hostId: 37,
        hostName: 'MAIN_0_R5_2',
        Security: 'Non Secure',
        Description: 'Cortex R5_0 context 2 on Main island'
    },
    {
        hostId: 38,
        hostName: 'MAIN_0_R5_3',
        Security: 'Secure',
        Description: 'Cortex R5_0 context 3 on MCU island'
    },
    {
        hostId: 40,
        hostName: 'MAIN_1_R5_0',
        Security: 'Non Secure',
        Description: 'Cortex R5_1 context 0 on Main island'
    },
    {
        hostId: 41,
        hostName: 'MAIN_1_R5_1',
        Security: 'Secure',
        Description: 'Cortex R5_1 context 1 on Main island'
    },
    {
        hostId: 42,
        hostName: 'MAIN_1_R5_2',
        Security: 'Non Secure',
        Description: 'Cortex R5_1 context 2 on Main island'
    },
    {
        hostId: 43,
        hostName: 'MAIN_1_R5_3',
        Security: 'Secure',
        Description: 'Cortex R5_1 context 3 on MCU island'
    },
    {
        hostId: 50,
        hostName: 'ICSSG_0',
        Security: 'Non Secure',
        Description: 'ICSSG context 0 on Main island'
    }
];

for (const host of hosts) {
    const def =
        `
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = ${JSON.stringify(host, null, 2)};
const modDef = createHostModule(hostInfo);
exports = modDef;
`
    fs.writeFileSync(`${__dirname}/../hosts/${host.hostName}.syscfg.js`, def);
}

const moduleNames = []
for (const host of hosts) {
    moduleNames.push(`/hosts/${host.hostName}`);
}

const product = `
{
	"name": "K3-Respart-Tool",
	"displayName": "Keystone3 Resource Partitioning Tool",
	"version": "1.0.0",
	"includePaths": [
		".."
	],
	"devices": [
		".*J721E.*"
	],
	"topModules": [
       {
           "displayName": "Hosts",
           "modules": ${ JSON.stringify(moduleNames, null, 2)}
       }
    ],
    "views" :[
        {
            "name": "/templates/allocation.xdt",
            "displayName": "Resource Allocation",
            "viewType": "markdown"
        }
    ],
    "documentationPath": "docs/"
}
`

fs.writeFileSync(`${__dirname}/../.metadata/product.json`, product);