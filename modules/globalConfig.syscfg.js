// This module shows how other modules can be pulled in and owned by this module.  The ownership
// can be either exclusive or shared with other modules.
// Owned modules can be pulled in dynamically through an instance adder.

exports = {
	displayName: "Global Configuration",
	moduleInstances: (inst) => {
		return [{
			name: "hostConfig",
			displayName: "Host Configuration",
			moduleName: "/modules/hostConfig",
			collapsed: false,
		}]
	},
};
