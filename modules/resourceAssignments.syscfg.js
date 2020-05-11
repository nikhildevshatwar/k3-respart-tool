exports = {
	displayName: "SYSFW Resource Partitioning",
	config: [
		// Unique Resource Type
		{
			name : "utype",
			displayName : "Unique Resource Type",
			default : "unknown",
			onChange: (inst, ui) => {
				ui.utype.readOnly = true;
			},
		},
		// Device Name
		{
			name : "devname",
			displayName : "Device Name",
			default : "unknown",
			onChange: (inst, ui) => {
				ui.devname.readOnly = true;
			},
		},
		// Device ID
		{
			name: "devId",
			displayName: "Device ID",
			default: -1,
			onChange: (inst, ui) => {
				ui.devId.readOnly = true;
			},
		},
		// Subtype
		{
			name: "subtype",
			displayName: "Subtype",
			default: "unknown",
			onChange: (inst, ui) => {
				ui.subtype.readOnly = true;
			},
		},
		// SubType Id
		{
			name : "subtypeid",
			displayName : "Sub Type Id",
			default : -1,
			onChange: (inst, ui) => {
				ui.subtypeid.readOnly = true;
			},
		},
		// Resouce Range Start
		{
			name : "resourcerangestart",
			displayName : "Resource Range Start",
			default : -1,
			onChange: (inst, ui) => {
				ui.resourcerangestart.readOnly = true;
			},
		},
		// Resource Count
		{
			name : "resourcecount",
			displayName : "Resouce Count",
			default : -1,
			onChange: (inst, ui) => {
				ui.resourcecount.readOnly = true;
			},
		},
	],
	moduleInstances: (inst) => {
		return [{
			name: "resourceassignment",
			displayName: "Resource assignment",
			moduleName: "/modules/resourceEntry",
			args : {
				devName : inst.devname,
				subtype : inst.subtype,
				resStart : inst.resourcerangestart,
				resType : inst.utype,
			},
			minInstanceCount: 0,
			maxInstanceCount: 20,
			useArray: true,
			collapsed: false,
		}]
	},
};