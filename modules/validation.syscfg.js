// This shows how modules can put validation messages anywhere in the system

exports = {
	displayName: "Validation",
	config: [{
		name: "generateErrors",
		displayName: "Generate Errors",
		default: false
	}],
	validate: (inst, validation) => {

		// If any basicConfig module is loaded
		if (inst.generateErrors && system.modules["/modules/basicConfig"]) {

			// Take the first instance and put and error/warning on one configurable
			const basicInst = system.modules["/modules/basicConfig"].$instances[0];
			const ref = validation.getReference(inst);
			const message = "message from " + ref;
			validation.logError(message, basicInst, "cfgBool");
			validation.logWarning(message, basicInst, "cfgText");
		}
	}
};
