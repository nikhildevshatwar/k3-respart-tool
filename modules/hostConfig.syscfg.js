// This module shows the basic configurable types that are supported.  There are some additional
// options that some modules support (numeric enums, fixed point formatting, bigint etc), but this
// serves to give a basic idea.
//
// Each configurable has at least:
// 	name: what it's called in the scripting context
// 	displayName: what it's called in the UI
//	default: what value it starts with


var hostArray = [ 
	{ hostId: 0,
    hostName: 'DMSC',
    Security: 'Secure',
    Description: 'Device Management and Security Control' },
  { hostId: 3,
    hostName: 'MCU_0_R5_0',
    Security: 'Non Secure',
    Description: 'Cortex R5 context 0 on MCU island' },
  { hostId: 4,
    hostName: 'MCU_0_R5_1',
    Security: 'Secure',
    Description: 'Cortex R5 context 1 on MCU island(Boot)' },
  { hostId: 5,
    hostName: 'MCU_0_R5_2',
    Security: 'Non Secure',
    Description: 'Cortex R5 context 2 on MCU island' },
  { hostId: 6,
    hostName: 'MCU_0_R5_3',
    Security: 'Secure',
    Description: 'Cortex R5 context 3 on MCU island' },
  { hostId: 10,
    hostName: 'A72_0',
    Security: 'Secure',
    Description: 'Cortex A72 context 0 on Main island' },
  { hostId: 11,
    hostName: 'A72_1',
    Security: 'Secure',
    Description: 'Cortex A72 context 1 on Main island' },
  { hostId: 12,
    hostName: 'A72_2',
    Security: 'Non Secure',
    Description: 'Cortex A72 context 2 on Main island' },
  { hostId: 13,
    hostName: 'A72_3',
    Security: 'Non Secure',
    Description: 'Cortex A72 context 3 on Main island' },
  { hostId: 14,
    hostName: 'A72_4',
    Security: 'Non Secure',
    Description: 'Cortex A72 context 4 on Main island' },
  { hostId: 20,
    hostName: 'C7X_0',
    Security: 'Secure',
    Description: 'C7x Context 0 on Main island' },
  { hostId: 21,
    hostName: 'C7X_1',
    Security: 'Non Secure',
    Description: 'C7x context 1 on Main island' },
  { hostId: 25,
    hostName: 'C6X_0_0',
    Security: 'Secure',
    Description: 'C6x_0 Context 0 on Main island' },
  { hostId: 26,
    hostName: 'C6X_0_1',
    Security: 'Non Secure',
    Description: 'C6x_0 context 1 on Main island' },
  { hostId: 27,
    hostName: 'C6X_1_0',
    Security: 'Secure',
    Description: 'C6x_1 Context 0 on Main island' },
  { hostId: 28,
    hostName: 'C6X_1_1',
    Security: 'Non Secure',
    Description: 'C6x_1 context 1 on Main island' },
  { hostId: 30,
    hostName: 'GPU_0',
    Security: 'Non Secure',
    Description: 'RGX context 0 on Main island' },
  { hostId: 35,
    hostName: 'MAIN_0_R5_0',
    Security: 'Non Secure',
    Description: 'Cortex R5_0 context 0 on Main island' },
  { hostId: 36,
    hostName: 'MAIN_0_R5_1',
    Security: 'Secure',
    Description: 'Cortex R5_0 context 1 on Main island' },
  { hostId: 37,
    hostName: 'MAIN_0_R5_2',
    Security: 'Non Secure',
    Description: 'Cortex R5_0 context 2 on Main island' },
  { hostId: 38,
    hostName: 'MAIN_0_R5_3',
    Security: 'Secure',
    Description: 'Cortex R5_0 context 3 on MCU island' },
  { hostId: 40,
    hostName: 'MAIN_1_R5_0',
    Security: 'Non Secure',
    Description: 'Cortex R5_1 context 0 on Main island' },
  { hostId: 41,
    hostName: 'MAIN_1_R5_1',
    Security: 'Secure',
    Description: 'Cortex R5_1 context 1 on Main island' },
  { hostId: 42,
    hostName: 'MAIN_1_R5_2',
    Security: 'Non Secure',
    Description: 'Cortex R5_1 context 2 on Main island' },
  { hostId: 43,
    hostName: 'MAIN_1_R5_3',
    Security: 'Secure',
    Description: 'Cortex R5_1 context 3 on MCU island' },
  { hostId: 50,
    hostName: 'ICSSG_0',
    Security: 'Non Secure',
    Description: 'ICSSG context 0 on Main island' } ];

/*function createHostArray(){

	var fs = require('fs');
	var textByLine = fs.readFileSync('/home/prince/Downloads/sysfw-public-docs-2020.04/docs/public/5_soc_doc/j721e/hosts.rst')
	.toString().split("\n");

	var first = true;

	for( var line = 0 ; line < textByLine.length ; line++ ){
		
		if(textByLine[line][0] != '|') continue;

		if(first){

			first = false;
			continue;
		}

		var newText =textByLine[line].split('|');  
		
		for( var data = 0 ; data < newText.length ; data++ ){
			newText[data] = newText[data].trim();
		}

		var newhost = {
			hostId : parseInt(newText[1]),
			hostName : newText[2],
			Security : newText[3],
			Description : newText[4],
		};
		
		hostArray.push(newhost);
	}
}

createHostArray();
*/

function addInst(val){
	if (system.modules["/modules/resourceAssignments"]) {
		for (let inst of system.modules["/modules/resourceAssignments"].$instances) {
			  inst.hostConfig.create(val);
		}
	}
}

function changehandler(inst){
	var arr={
		security : true,
		description : "unknown",
	};
	for( var idx = 0 ; idx < hostArray.length ; idx++ ){
		if(hostArray[idx].hostName.toLowerCase() === inst.hostName){
						
			arr.description = hostArray[idx].Description;
			if(hostArray[idx].Security === 'Secure')arr.security = true;
			else arr.security = false;
			break;
		}
	}
	return arr;
}


var temp = [
];

for( var data = 0 ; data < hostArray.length ; data++ ){
	
	var newTemp = {
		name : hostArray[data].hostName.toLowerCase(),
		displayName : hostArray[data].hostName
	}

	temp.push(newTemp);
}

exports = {
	displayName: "SYSFW Host Config",
	config: [
		// Host Name
		{
			name: "hostName",
			displayName: "Host Name used for SYSFW",
			options: temp,
			default: "dmsc",
			onChange: (inst, ui) => {
				var val = changehandler(inst);
				inst.security=val.security;
				inst.description=val.description;
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
			default: [ 0, 1, 2 ],
    },
  ],
};

var prev = 0;
var curr = 0;
if (system.modules["/modules/hostConfig"]) {
  for (let inst of system.modules["/modules/hostConfig"].$instances) {
      curr++;
  }
}
addInst(3)