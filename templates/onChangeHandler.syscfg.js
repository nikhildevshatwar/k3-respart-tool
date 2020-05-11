// This module shows how to handle a callback for when one configurable is changed in order to 
// modify other configurables

exports = {
	displayName: "Change Handler",
	config: [
		{
			name: "changeOther",
			displayName: "Change Other",
			options: [{
				name: "default"
			},
			{
				name: "change"
			},
			{
				name: "hidden"
			},
			{
				name: "readonly"
			}],
			default: "default",
			onChange: (inst, ui) => {
				// Set the value of "other" to true/false
				inst.other = inst.changeOther === "change";

				// Make "other" readonly if "readonly" is selected
				ui.other.readOnly = inst.changeOther === "readonly";

				// Make "other" hidden if "hidden" is selected
				ui.other.hidden = inst.changeOther === "hidden";
			}
		},
		{
			name: "other",
			displayName: "Other Configurable",
			default: false
		}
	]
};
