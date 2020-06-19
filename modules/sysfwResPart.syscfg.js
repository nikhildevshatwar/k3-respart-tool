const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"),(r) => r.soc);
const socName = devData[deviceSelected].shortName;

var hosts = system.getScript("/data/" + socName + "/Hosts.json");
const resources = _.keyBy(system.getScript("/data/" + socName + "/Resources.json"), (r) => r.utype);
const { checkOverlap , resourceAllocate } = system.getScript("/scripts/allocation.js");


_.each(resources,(resource) => {

        if(resource.copyFromUtype){
                resources[resource.copyFromUtype].copyToUtype = resource.utype;
        }
        if(resource.blockCopyFrom){
                resources[resource.blockCopyFrom].blockCopyTo = resource.utype;
        }
})

function getDisplayPrefix(toBeRemoved , removeFrom){
        
        var finalPrefix = "" , idx = 0;

        var split1 = _.split(toBeRemoved," ");
        var split2 = _.split(removeFrom," ");

        for(var i = 0 ; i < split2.length ; i++){
                if(split1[i] !== split2[i]){
                        idx = i;
                        break;
                }
        }

        for(var i = idx ; i < split2.length ; i++){
                finalPrefix += split2[i];
                finalPrefix += " ";
        }

        return finalPrefix;
}

// Create configurables for each resource

var groupNames = [];

_.each(resources,(resource) => {
        groupNames.push(resource.groupName);
})

groupNames = _.uniq(groupNames);

var byGroup = _.groupBy(resources,(r) => {
        return r.groupName;
})

var configurables = [];

_.each(groupNames,(gName) => {
        var groupResources = byGroup[gName];

        var obj = {
                name :  _.join(_.split(gName," "),"_"),
                displayName : gName,
                config : [],
		collapsed: false
        }

        _.each(groupResources,(r) => {

                var displayPrefix = getDisplayPrefix(gName,r.utype);
                obj.config.push({
                        name : _.join(_.split(r.utype," "),"_") +"_start" ,
                        displayName : displayPrefix + " Start",
			default : 0,
                        hidden : (r.autoAlloc === false && !r.copyFromUtype ? false : true),
                        onChange: (inst,ui) => {
                                
                                if(r.copyToUtype && r.autoAlloc === false){
                                        var dest = _.join(_.split(r.copyToUtype," "),"_");
                                        var src = _.join(_.split(r.utype," "),"_");
                                        inst[dest + "_start"] = inst[src + "_start"];
                                }
                        }
                });

                obj.config.push({
                        name : _.join(_.split(r.utype," "),"_") +"_count",
			displayName : displayPrefix + " Count",
                        default : 0,
                        readOnly : (r.copyFromUtype ? true : false),
                        hidden : (r.copyFromUtype ? true : false),
                        description : (r.copyFromUtype ? "Count of this resource is automatically matched with resource " +
                                r.copyFromUtype : ""), 
                        onChange: (inst, ui) => {

                                if(r.copyToUtype){
                                                
                                        var dest = _.join(_.split(r.copyToUtype," "),"_");
                                        var src = _.join(_.split(r.utype," "),"_");
                                        inst[dest + "_count"] = inst[src + "_count"];
                                }
                        }
                });

                if(r.blockCopy){
                        obj.config.push({
                                name : _.join(_.split(r.utype," "),"_") +"_blockCount",
                                displayName : "========> Block-copy count",
                                default : 0,
                                readOnly : (r.copyFromUtype ? true : false),
                                hidden : (r.blockCopyFrom || r.copyFromUtype ? true : false),
                                description : (r.copyFromUtype ? "Block Count of this resource is automatically matched with resource " + 
                                                r.copyFromUtype : ""),
                                onChange: (inst, ui) => {
        
                                        if(r.copyToUtype){
                                                
                                                var dest = _.join(_.split(r.copyToUtype," "),"_");
                                                var src = _.join(_.split(r.utype," "),"_");
                                                inst[dest + "_blockCount"] = inst[src + "_blockCount"];
                                        }

                                        if(r.blockCopyTo){

                                                var dest = _.join(_.split(r.blockCopyTo," "),"_");
                                                var src = _.join(_.split(r.utype," "),"_");
                                                inst[dest + "_blockCount"] = inst[src + "_blockCount"];

                                                if(resources[r.blockCopyTo].copyToUtype){
                                                        var to = _.join(_.split(resources[r.blockCopyTo].copyToUtype," "),"_");
                                                        var from = _.join(_.split(r.blockCopyTo," "),"_");

                                                        inst[to + "_blockCount"] = inst[from + "_blockCount"];
                                                }
                                        }

                                        // TODO :- Block Copy Channels are not working correctly 
                                }
                        })
                }
        })

        configurables.push(obj);
})


// Set other attributes of the selected host like security, description

function changehandler(inst){
        var aboutHost = {
        };
        
	for( var idx = 0 ; idx < hosts.length ; idx++ ){
		if(hosts[idx].hostName === inst.hostName){
						
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
		name : hosts[data].hostName,
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
                                        if(res === inst.hostName){
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
                        //ui[name + "_start"].hidden = true;
                }
                else{   
                        if(!resource.copyFromUtype){
                                ui[name + "_count"].hidden = false;
                        }
                        //ui[name + "_start"].hidden = false;
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
        if(instance.hostName === "DMSC"){
                report.logError("Cannot select DMSC as Host",instance,"hostName");
        }
        if(instance.supervisorhost === "DMSC"){
                report.logError("Cannot select DMSC as Supervisor Host",instance,"supervisorhost");
        }
}

// Check if same host is selected to share resource with different hosts

function duplicateShareResourceWithHost(instance,report){
        var moduleInstances = instance.$module.$instances;

        for(var idx = 0 ;idx < moduleInstances.length ; idx++){

                if(instance.shareResource !== "none" && instance.shareResource === moduleInstances[idx].shareResource && instance != moduleInstances[idx]){
                        report.logError("Cannot Share resources with same host twice",instance,"shareResource");
                }
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

// Check if same host is selected as Host as well as Share resource with

function duplicateHostAndShareHost(instance,report){
        var moduleInstances = instance.$module.$instances;

        for(var idx = 0 ;idx < moduleInstances.length ; idx++){

                if(instance.shareResource === moduleInstances[idx].hostName){
                        report.logError("Resources are already assigned to host",instance,"shareResource");
                }
        }
}

// Check if the Supervisor tree is cyclic or not

function checkCyclicDependencyForSupervisor(instance,report){

        if(instance.supervisorhost === "none")
                return;

        var moduleInstances = instance.$module.$instances;
        var supervisor = [];

        _.each(moduleInstances, i => {
                if(i.supervisorhost !== "none"){
                        supervisor.push({
                                node: i.hostName,
                                parent: i.supervisorhost
                        })
                }
        })

        var supervisorOf = _.keyBy(supervisor , (s) => s.node);

        var visited = new Map();

        visited[instance.hostName] = true;

        var curr = instance.hostName;

        var cycleDetected = false;

        while(supervisorOf[curr]){
                var par = supervisorOf[curr].parent;

                if(visited[par]){
                        cycleDetected = true;
                        break;
                }
                
                visited[par] = true;
                curr = par;
        }

        if(cycleDetected){
                report.logError("Cycle Detected in Supervisor Tree", instance,"supervisorhost");
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
                                        const conflicting = _.join(_.map(overlapInstance, (inst) => system.getReference(inst)), ", ");
                                        
                                        /*
                                        var message = "WARNING : Overlap with ";
                                        _.each(overlapInstance , (ov) => {
                                                message += ov.hostName + ", "
                                        })
                                        */
                                        
                                        report.logWarning(`WARNING : Overlap with ${conflicting}`,instance,name + "_count") ;
                                }
                        }
                        var over = resourceAllocate(resource.utype).overflowCount;

                        var index = -1 , id =0;
                        _.each(resource.resRange,(range) => {
                                if(range.restrictHosts){
                                        _.each(range.restrictHosts,(res) => {
                                                if(res === instance.hostName){
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
                                report.logError("ERROR : Assigned resource count exceeds by " + 
                                over[index],instance,name + "_count");
                        }
                }
        })
}

var documentation = `
**SYSFW Resource Partitioning**

---

This module allows to partition resources managed by System firmware
across different software entities. Typically, resources related to
DMA channels, rings, proxies, and interrupts are managed by SYSFW.

Following steps allow you to achieve this:

*	Click on ADD button to add a new host in the tool
*	Select the host_id to be used by the software to communicate with SYSFW
*	Note the CPU core and security level assosiated with selected host
*	Optionally, you can configure some capabilities of the host
*	For each host, a list of resources is presented in various groups.
	You can specify the count of certain resource.

**Resource allocation**

Most of the resources are homogeneous. It should not matter as to which specific
range of resource has been allocated to the software. Therefore, the tool only
asks for the count of the resources required for each host, and then does
allocation of the exact range taking into consideration some constraints.

However, there are some resources (e.g. virtid) where user can choose the
start index and count specifically. I 

Note that after allocating resources for all the hosts, remaining count is
assigned to *HOST_ID_ALL*.

**Host capabilities**

Most of the parameters here are needed for some specialized use cases.
You should modify these only if you knwo what you are doing.

*	**Allowed values of atype** - SYSFW will ensure that a host can program
	a certain value of atype (address type) only if it is enabled in this
	list. There are few APIs (e.g. UDMA config) which accept atype
	as part of the TISCI API. This is useful for hosts running inside
	virtual machine where all the DMA accesses should must through an IOMMU.
*	**Allowed values of QoS, orderid, priority, schedpriority** - SYSFW will
	ensure that the host can program a certain value of Quality of Service
	parameters only if it is enabled in this list. This is useful to ensure
	that a host cannot program higher QoS values for UDMA potentially
	causing performance degradation to other masters.
*	**Supervisor host** - This parameter allows to declare another host
	as the supervisor of the current host. Supervisor can claim all the
	resources that his subordinate owns. This is useful for FFI recovery
	scenario where a safety software would try to restart nonsafe software.

**Output files**

---

*	\`rm-cfg.c, board-config.c\` - This is the format used for k3-image-gen
	RM board config files
*	\`sciclient_defaultBoardcfg_rm.c\` - This is the format used for Secondary
	Boot Loader (SBL) RM board config files.

**Allocation visualization**

---

The tool shows the current allocation of each resource for each host in a table.
Click on the three dots in the top right corner to open the *Resource Allocation*
pane to view this table. This table gets updated automatically whenever some
allocation is changed. This is especially useful when trying to solve errors
due to overflow in allocation.

`

exports = {
        displayName: "SYSFW Resource Partitioning",
	longDescription: documentation,
        defaultInstanceName : "Unknown",
        config: [
                // Host Name
                {
                        name: "hostName",
                        displayName: "Host Name used for SYSFW",
                        options: hostName,
                        default: "DMSC",
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
                {
                        name: "hideDependentResources",
                        displayName: "Hide Dependent Resources",
                        default: true,
                        onChange: (inst,ui) => {
                                _.each(resources , r => {

                                        var name = _.join(_.split(r.utype," "),"_");
                                        if(r.copyFromUtype){
                                                ui[name + "_count"].hidden = inst.hideDependentResources;

                                                if(r.blockCopy){
                                                        ui[name + "_blockCount"].hidden = inst.hideDependentResources;
                                                }
                                        }
                                })
                        }
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
                                },
                                // Share Resource With Host
                                {
                                        name : "shareResource",
                                        displayName : "Share Resources with",
                                        options :[
                                                {
                                                        name : "none",
                                                        displayName : "None"
                                                },
                                                ...hostName
                                        ],
                                        default : "none"
                                }
                        ]            
                },
                ...configurables
              ],
                validate : (instance ,report) => {

                        validateDmsc(instance,report);

                        duplicateHost(instance,report);

                        duplicateShareResourceWithHost(instance,report);

                        duplicateHostAndShareHost(instance,report);

                        overlapAndOverflow(instance,report);

                        checkCyclicDependencyForSupervisor(instance,report);
                }
};


