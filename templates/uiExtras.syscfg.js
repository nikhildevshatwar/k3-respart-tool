// This module shows all the UI extras that are available in the tool.  Typically everything can have
// a tooltip, and some things can also have detailed documentation too

exports = {
	displayName: "UI Extras",
	description: "Module level tooltip",
	longDescription: "Modules can have detailed descriptions complete with [links](https://www.ti.com)",
	config: [{
		name: "cfgEnum",
		displayName: "Enum",
		description: "Configurable level tooltip",
		longDescription: "Configurables can have detailed descriptions complete with [links](https://www.ti.com)",
		options: [{
			name: "opt1",
			displayName: "Option1",
			description: "Option level tooltip1"
		},
		{
			name: "opt2",
			displayName: "Option2",
			description: "Option level tooltip2"
		},
		{
			name: "opt3",
			displayName: "Option3",
			description: "Option level tooltip3"
		}],
		getDisabledOptions: () => {
			return [{
				name: "opt2",
				reason: "Reason why the option is disabled"
			}]
		},
		default: "opt1"
	}]
};
