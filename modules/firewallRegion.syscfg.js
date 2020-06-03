exports = {
	displayName: "Firewall Region",
	config: [
		{
			name: "regionAlloc",
			displayName: "Define custom region",
			default: false,
			onChange: (inst, ui) => {
				if (inst.regionAlloc) {
					ui.addrStart.hidden = false;
					ui.addrEnd.hidden = false;
				} else {
					ui.addrStart.hidden = true;
					ui.addrEnd.hidden = true;
					inst.addrStart = 0;
					inst.addrEnd = 0;
				}
			}
		},
		{
			name: "addrStart",
			displayName: "Region start address",
			hidden: true,
			default: 0
		},
		{
			name: "addrEnd",
			displayName: "Region end address",
			hidden: true,
			default: 0
		}
	],
	moduleInstances: (inst) => {
		return [{
			name: "perms",
			displayName: "Permission Slot",
			moduleName: "/modules/firewallPermissions",
			minInstanceCount: 1,
			maxInstanceCount: 3,
			useArray: true,
			collapsed: false
		}]
	}
}
