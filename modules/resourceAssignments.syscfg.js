// This module shows the basic configurable types that are supported.  There are some additional
// options that some modules support (numeric enums, fixed point formatting, bigint etc), but this
// serves to give a basic idea.
//
// Each configurable has at least:
// 	name: what it's called in the scripting context
// 	displayName: what it's called in the UI
//	default: what value it starts with


exports = {
	displayName: "SYSFW Resource Partitioning",
	config: [
		// Device Name
		{
			name : "devname",
			displayName : "Device Name",
			default : "unknown",
			//readOnly: true,
		},
		// Device ID
		{
			name: "devId",
			displayName: "Device ID",
			default: 0,
			//readOnly: true,
		},
		// Subtype
		{
			name: "subtype",
			displayName: "Subtype",
			default: "unknown",
			//readOnly: true,
		},
		// SubType Id
		{
			name : "subtypeid",
			displayName : "Sub Type Id",
			default : 0,
			//readOnly: true,
		},
		// Resouce Range Start
		{
			name : "resourcerangestart",
			displayName : "Resource Range Start",
			default : 0,
			//readOnly: true,
		},
		// Resource Count
		{
			name : "resourcecount",
			displayName : "Resouce Count",
			default : 20,
			//readOnly: true,
		},
	],
	moduleInstances: (inst) => {
		return [{
			name: "hostConfig",
			displayName: "Resource assignment",
			moduleName: "/modules/resourceEntry",
			minInstanceCount: 0,
			maxInstanceCount: 20,
			useArray: true,
			collapsed: false,
		}]
	},
};