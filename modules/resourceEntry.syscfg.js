// Returns the Selected Hosts

function updateSelected(){

	var selectedHostOption = [{
		displayName : "HOST_ID_ALL",
                name : "host_id_all"
        }];
	if (system.modules["/modules/hostConfig"]) {
		for (let inst of system.modules["/modules/hostConfig"].$instances){
			
			selectedHostOption.push({
				displayName : inst.hostName.toUpperCase(),
				name : inst.hostName
			});
		}
	}
	return selectedHostOption;
}



exports = {
	displayName: "SYSFW Resource Entry",
	config: [
		// Resource type
		{
			name: "resType",
			displayName: "Unique Resource type",
			default: "Main Nav UDMA TX Rings",
			hidden : true,
		},
		// Device ID
		{
			name: "devName",
			displayName: "Device Name",
			default: "J721E_DEV_NAVSS0_UDMAP_0",
			hidden : true,
		},
		// Subtype
		{
			name: "subtype",
			displayName: "Subtype",
			default: "RESASG_SUBTYPE_UDMAP_TX_CHAN",
			hidden : true,
		},
		// Resource start range
		{
			name: "resStart",
			displayName: "Resource Range Start",
			default: 0,
			hidden : true,
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
