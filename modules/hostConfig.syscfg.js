var hosts = system.getScript("/data/j721e/Hosts.json");
const resources = _.keyBy(system.getScript("/data/j721e/Resources.json"), (r) => r.utype);
const { checkOverlap , resourceAllocate } = system.getScript("/scripts/allocation.js");


_.each(resources,(resource) => {

        if(resource.copyFromUtype){
                resources[resource.copyFromUtype].copyToUtype = resource.utype;
        }
})

// Create configurables for each resource

var configurables = _.map(resources,(resource) => {
	var obj = {
		name : _.join(_.split(resource.utype," "),"_"),
		displayName : resource.utype,
                collapsed : false,
                description : (resource.copyFromUtype ? "Count of this resource is automatically matched with resource " + 
                                resource.copyFromUtype : ""), 
		config : [
			{
				name : _.join(_.split(resource.utype," "),"_") +"_start" ,
				displayName : "Start",
				default : 0,
				readOnly : (resource.autoAlloc === false ? false : true),
			},
			{
				name : _.join(_.split(resource.utype," "),"_") +"_count",
				displayName : "Count",
                                default : 0,
                                readOnly : (resource.copyFromUtype ? true : false),
                                onChange: (inst, ui) => {

                                        if(resource.copyToUtype){
                                                
                                                var name1 = _.join(_.split(resource.copyToUtype," "),"_");
                                                var name2 = _.join(_.split(resource.utype," "),"_");
                                                inst[name1 + "_count"] = inst[name2 + "_count"];
                                        }
                                }
			},
		]
        }
        if(resource.blockCopy){
                obj.config.push({
                        name : _.join(_.split(resource.utype," "),"_") +"_blockCount",
                        displayName : "Block Copy Count",
                        default : 0,
                        readOnly : (resource.copyFromUtype ? true : false),
                        onChange: (inst, ui) => {

                                if(resource.copyToUtype){
                                        
                                        var name1 = _.join(_.split(resource.copyToUtype," "),"_");
                                        var name2 = _.join(_.split(resource.utype," "),"_");
                                        inst[name1 + "_blockCount"] = inst[name2 + "_blockCount"];
                                }
                        }
                })
        }

        return obj;
});

// Set other attributes of the selected host like security, description

function changehandler(inst){
        var aboutHost = {
        };
        
	for( var idx = 0 ; idx < hosts.length ; idx++ ){
		if(hosts[idx].hostName.toLowerCase() === inst.hostName){
						
			aboutHost.description = hosts[idx].Description;
			aboutHost.security = hosts[idx].Security;
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

//Hide those resources which cannot be assigned to selected host

function hideResources(inst,ui){

        _.each(resources,(resource) => {
                var hostFound = 0 , restrictHostFound = 0;
                _.each(resource.resRange,(range) => {
                        if(range.restrictHosts){
                                restrictHostFound = 1;
                                _.each(range.restrictHosts,(res) => {
                                        if(res.toLowerCase() === inst.hostName){
                                                hostFound = 1;
                                        }
                                })
                        }
                })

                var name = _.join(_.split(resource.utype," "),"_");
                if(restrictHostFound && !hostFound){
                        inst[name + "_count"] = 0;
                        inst[name + "_start"] = 0;
                        ui[name + "_count"].hidden = true;
                        ui[name + "_start"].hidden = true;
                }
                else{
                        ui[name + "_count"].hidden = false;
                        ui[name + "_start"].hidden = false;
                }
        })
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

// Show error if host is dmsc

function validateDmsc(instance,report){
        if(instance.hostName === "dmsc"){
                report.logError("Cannot select DMSC as Host",instance,"hostName");
        }
        if(instance.supervisorhost === "dmsc"){
                report.logError("Cannot select DMSC as Supervisor Host",instance,"supervisorhost");
        }
}

// Check for duplicate hosts

function duplicateHost(instance,report){
        var moduleInstances = instance.$module.$instances;

        for(var idx = 0 ;idx < moduleInstances.length ; idx++){

                if(instance.hostName === moduleInstances[idx].hostName && instance != moduleInstances[idx]){
                        report.logError("Cannot select same host twice",instance,"hostName");
                }
        }
}

// Check for overlap and overflow

function overlapAndOverflow(instance,report){

        _.each(resources,(resource) => {

                var name  = _.join(_.split(resource.utype," "),"_") 

                if(instance[name + "_count"] > 0 || instance[name + "_blockCount"]){

                        if(resource.autoAlloc === false ){
                                var overlapInstance = checkOverlap(resource.utype,instance);
                                if(overlapInstance.length){

                                        
                                        var message = "Overlap with ";
                                        _.each(overlapInstance , (ov) => {
                                                message += ov.hostName + ", "
                                        })
                                        
                                        report.logWarning(message,instance,name + "_count") ;
                                }
                        }
                        var over = resourceAllocate(resource.utype).overflowCount;

                        var index = -1 , id =0;
                        _.each(resource.resRange,(range) => {
                                if(range.restrictHosts){
                                        _.each(range.restrictHosts,(res) => {
                                                if(res.toLowerCase() === instance.hostName){
                                                        index = id;
                                                }
                                        })
                                }
                                else{
                                        index = id;
                                }
                                id++;
                        })

                        if(index !== -1 && over[index] > 0){
                                report.logWarning("Assigned resource count exceeds by " + 
                                over[index],instance,name + "_count");
                        }
                }
        })
}

exports = {
        displayName: "SYSFW Host Config",
        defaultInstanceName : "Unknown",
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
                                hideResources(inst,ui);
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
                        displayName: "Security Level",
                        readOnly: true,
                        default: "Secure",
                },
                // Host Capabilities
                {
                        name : "HostCapabilities",
                        displayName : "Host Capabilities",
                        config : [
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
                                        options : [
                                                ...hostName,
                                                {
                                                        name : "none",
                                                        displayName : "None"
                                                }
                                        ],
                                        default : "none",
                                }
                        ]            
                },
                ...configurables
              ],
                validate : (instance ,report) => {

                        validateDmsc(instance,report);

                        duplicateHost(instance,report);

                        overlapAndOverflow(instance,report);
                }
};


