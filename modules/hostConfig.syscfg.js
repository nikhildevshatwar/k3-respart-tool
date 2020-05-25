var hosts = system.getScript("/data/j721e/Hosts.json");

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
var supervisorhost = hostName ;
supervisorhost.push({
        name : "none",
        displayName : "None"
});

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
                // Supervisor Host
                {
                        name : "supervisorhost",
                        displayName : "Supervisor Host",
                        options : supervisorhost,
                        default : "none",
                }
              ],
              moduleInstances: (inst) => {
		return [{
                                name: "resourceconfig",
                                displayName: "Resource Config",
                                moduleName: "/modules/ResourceConfig",
                                collapsed: false,
		        }]
                },
                validate : (instance ,report) => {

                        if(instance.hostName === "dmsc"){
                                report.logError("Cannot select DMSC as Host",instance,"hostName");
                        }
                        if(instance.supervisorhost === "dmsc"){
                                report.logError("Cannot select DMSC as Supervisor Host",instance,"supervisorhost");
                        }

                        var moduleInstances = instance.$module.$instances;

                        for(var idx = 0 ;idx < moduleInstances.length - 1 ; idx++){

                                if(instance.hostName === moduleInstances[idx].hostName){
                                        report.logError("Cannot select same host twice",instance,"hostName");
                                }
                        }
                }
};


