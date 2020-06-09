exports = {
	displayName: "Firewall Region",
	config: [
		{
			name: "regionAlloc",
			displayName: "Define custom region",
			default: false,
			onChange: (inst, ui) => {
				if (inst.regionAlloc) {
					ui.addrStart.readOnly = false;
					ui.addrEnd.readOnly = false;
				} else {
					inst.addrStart = inst.defaultStart;
					inst.addrEnd = inst.defaultEnd;
					ui.addrStart.readOnly = true;
					ui.addrEnd.readOnly = true;
				}
			}
		},
		{
			name: "addrStart",
			displayName: "Region start address",
			default: "0",
			readOnly: true
		},
		{
			name: "addrEnd",
			displayName: "Region end address",
			default: "0",
			readOnly: true
		},
		{
			name: "defaultStart",
			default: "0",
			hidden: true,
			onChange: (inst,ui) => {
				inst.addrStart = inst.defaultStart;
				ui.addrStart.readOnly = true;
			}
		},
		{
			name: "defaultEnd",
			default: "0",
			hidden: true,
			onChange: (inst,ui) => {
				inst.addrEnd = inst.defaultEnd;
				ui.addrEnd.readOnly = true;
			}
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
