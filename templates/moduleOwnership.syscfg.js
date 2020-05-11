// This module shows how other modules can be pulled in and owned by this module.  The ownership
// can be either exclusive or shared with other modules.
// Owned modules can be pulled in dynamically through an instance adder.

exports = {
	displayName: "Module Ownership",
	config: [{
		name: "shared",
		displayName: "Shared Ownership",
		default: false
	}],
	moduleInstances: (inst) => {
		if (inst.shared) {
			return [];
		}
		return [{
			name: "ownedModule",
			displayName: "Owned Module",
			moduleName: "/modules/basicConfig",
			collapsed: false
		}, {
			name: "instanceAdder",
			displayName: "Instance Adder",
			moduleName: "/modules/basicConfig",
			minInstanceCount: 1,
			maxInstanceCount: 4,
			useArray: true,
			collapsed: false
		}]
	},
	sharedModuleInstances: (inst) => {
		if (!inst.shared) {
			return [];
		}
		return [{
			name: "sharedModule",
			displayName: "Shared Module",
			moduleName: "/modules/basicConfig",
			collapsed: false
		}]
	},
};
