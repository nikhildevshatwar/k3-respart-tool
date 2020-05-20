var hosts = [ 
        { 
                hostId: 0,
                hostName: 'DMSC',
                Security: 'Secure',
                Description: 'Device Management and Security Control' },
        { 
                hostId: 3,
                hostName: 'MCU_0_R5_0',
                Security: 'Non Secure',
                Description: 'Cortex R5 context 0 on MCU island' },
        { 
                hostId: 4,
                hostName: 'MCU_0_R5_1',
                Security: 'Secure',
                Description: 'Cortex R5 context 1 on MCU island(Boot)' },
        { 
                hostId: 5,
                hostName: 'MCU_0_R5_2',
                Security: 'Non Secure',
                Description: 'Cortex R5 context 2 on MCU island' },
        { 
                hostId: 6,
                hostName: 'MCU_0_R5_3',
                Security: 'Secure',
                Description: 'Cortex R5 context 3 on MCU island' },
        { 
                hostId: 10,
                hostName: 'A72_0',
                Security: 'Secure',
                Description: 'Cortex A72 context 0 on Main island' },
        { 
                hostId: 11,
                hostName: 'A72_1',
                Security: 'Secure',
                Description: 'Cortex A72 context 1 on Main island' },
        { 
                hostId: 12,
                hostName: 'A72_2',
                Security: 'Non Secure',
                Description: 'Cortex A72 context 2 on Main island' },
        { 
                hostId: 13,
                hostName: 'A72_3',
                Security: 'Non Secure',
                Description: 'Cortex A72 context 3 on Main island' },
        { 
                hostId: 14,
                hostName: 'A72_4',
                Security: 'Non Secure',
                Description: 'Cortex A72 context 4 on Main island' },
        { 
                hostId: 20,
                hostName: 'C7X_0',
                Security: 'Secure',
                Description: 'C7x Context 0 on Main island' },
        { 
                hostId: 21,
                hostName: 'C7X_1',
                Security: 'Non Secure',
                Description: 'C7x context 1 on Main island' },
        { 
                hostId: 25,
                hostName: 'C6X_0_0',
                Security: 'Secure',
                Description: 'C6x_0 Context 0 on Main island' },
        { 
                hostId: 26,
                hostName: 'C6X_0_1',
                Security: 'Non Secure',
                Description: 'C6x_0 context 1 on Main island' },
        { 
                hostId: 27,
                hostName: 'C6X_1_0',
                Security: 'Secure',
                Description: 'C6x_1 Context 0 on Main island' },
        { 
                hostId: 28,
                hostName: 'C6X_1_1',
                Security: 'Non Secure',
                Description: 'C6x_1 context 1 on Main island' },
        { 
                hostId: 30,
                hostName: 'GPU_0',
                Security: 'Non Secure',
                Description: 'RGX context 0 on Main island' },
        { 
                hostId: 35,
                hostName: 'MAIN_0_R5_0',
                Security: 'Non Secure',
                Description: 'Cortex R5_0 context 0 on Main island' },
        { 
                hostId: 36,
                hostName: 'MAIN_0_R5_1',
                Security: 'Secure',
                Description: 'Cortex R5_0 context 1 on Main island' },
        { 
                hostId: 37,
                hostName: 'MAIN_0_R5_2',
                Security: 'Non Secure',
                Description: 'Cortex R5_0 context 2 on Main island' },
        { 
                hostId: 38,
                hostName: 'MAIN_0_R5_3',
                Security: 'Secure',
                Description: 'Cortex R5_0 context 3 on MCU island' },
        { 
                hostId: 40,
                hostName: 'MAIN_1_R5_0',
                Security: 'Non Secure',
                Description: 'Cortex R5_1 context 0 on Main island' },
        { 
                hostId: 41,
                hostName: 'MAIN_1_R5_1',
                Security: 'Secure',
                Description: 'Cortex R5_1 context 1 on Main island' },
        { 
                hostId: 42,
                hostName: 'MAIN_1_R5_2',
                Security: 'Non Secure',
                Description: 'Cortex R5_1 context 2 on Main island' },
        { 
                hostId: 43,
                hostName: 'MAIN_1_R5_3',
                Security: 'Secure',
                Description: 'Cortex R5_1 context 3 on MCU island' },
        { 
                hostId: 50,
                hostName: 'ICSSG_0',
                Security: 'Non Secure',
                Description: 'ICSSG context 0 on Main island' } 
        ];

// Set other attributes of the selected host like security, description

function changehandler(inst){
        var aboutHost = {
		security : true,
		description : "unknown",
        };
        
	for( var idx = 0 ; idx < hosts.length ; idx++ ){
		if(hosts[idx].hostName.toLowerCase() === inst.hostName){
						
			aboutHost.description = hosts[idx].Description;
			if(hosts[idx].Security === 'Secure'){
                                aboutHost.security = true;
                        }
			else {
                                aboutHost.security = false;
                        }
                        break; 
		}
  }
	return aboutHost;
}

// Extract hostname of all hosts 

var hostName = [];

for( var data = 0 ; data < hosts.length ; data++ ){
	
	var newHostName = {
		name : hosts[data].hostName.toLowerCase(),
		displayName : hosts[data].hostName
	}

	hostName.push(newHostName);
}

// Returns values from 0 to 2^val in form of options 

function optionValues(val){
        var option = [];
        for(var i = 0 ; i < (1 << val) ; i++ ){
                option.push({
                        name : i,
                        displayName : i.toString(),
                });
        }
        return option;
}

exports = {
        displayName: "SYSFW Host Config",
        config: [
                // Host Name
                {
                        name: "hostName",
                        displayName: "Host Name used for SYSFW",
                        options: hostName,
                        default: "dmsc",
                        onChange: (inst, ui) => {
                                var val = changehandler(inst);
                                inst.security=val.security;
                                inst.description=val.description;
                                inst.$name = inst.hostName.toLowerCase();
                        },	
                },
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
                        default: false,
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
                        default: [0,1,2],
                },
                // Allowed values of qos
                {
                        name : "allowedqos",
                        displayName : "Allowed values of qos",
                        default : "unknown",
                        options : optionValues(3),
                        default : [0,1,2,3,4,5,6,7],
                },
                // Allowed values of orderid
                {
                        name : "allowedorderid",
                        displayName : "Allowed values of orderid",
                        default : "unknown",
                        options : optionValues(4),
                        default : [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
                },
                // Allowed values of priority
                {
                        name : "allowedpriority",
                        displayName : "Allowed values of priority",
                        default : "unknown",
                        options : optionValues(3),
                        default : [0,1,2,3,4,5,6,7],
                },
                // Allowed values of schedpriority
                {
                        name : "allowedschedpriority",
                        displayName : "Allowed values of schedpriority",
                        default : "unknown",
                        options : optionValues(2),
                        default : [0,1,2,3],
                },
              ],
              moduleInstances: (inst) => {
		return [{
			name: "resourceconfig",
			displayName: "Resource Config",
			moduleName: "/modules/ResourceConfig",
			collapsed: false,
		}]
	},
};


