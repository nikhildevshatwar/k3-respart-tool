// This module shows the basic configurable types that are supported.  There are some additional
// options that some modules support (numeric enums, fixed point formatting, bigint etc), but this
// serves to give a basic idea.
//
// Each configurable has at least:
// 	name: what it's called in the scripting context
// 	displayName: what it's called in the UI
//	default: what value it starts with


function updateSelected(){
	var selected_host_option = [{displayName : "HOST_ID_ALL",
		name : "host_id_all"}];
	if (system.modules["/modules/hostConfig"]) {
		for (let inst of system.modules["/modules/hostConfig"].$instances){
			
			selected_host_option.push({
				displayName : inst.hostName.toUpperCase(),
				name : inst.hostName
			});
		}
	}
	return selected_host_option;
}



exports = {
	displayName: "SYSFW Resource Entry",
	config: [
		// Resource type
		{
			name: "resType",
			displayName: "Unique Resource type",
			default: "Main Nav UDMA TX Rings",
		},
		// Device ID
		{
			name: "devName",
			displayName: "Device Name",
			default: "J721E_DEV_NAVSS0_UDMAP_0",
		},
		// Subtype
		{
			name: "subtype",
			displayName: "Subtype",
			default: "RESASG_SUBTYPE_UDMAP_TX_CHAN",
		},
		// Resource start range
		{
			name: "resStart",
			displayName: "Resource Range Start",
			default: 0,
		},
		// Resource count
		{
			name: "resCount",
			displayName: "Resource Count",
			default: 0,
		},
		// Host Id
		{
			name : "hostId",
			displayName : "SYSFW Host Id",
			options : updateSelected(),
			default : "host_id_all",
		}
	],
};
