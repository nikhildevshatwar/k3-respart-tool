// This module shows the basic configurable types that are supported.  There are some additional
// options that some modules support (numeric enums, fixed point formatting, bigint etc), but this
// serves to give a basic idea.
//
// Each configurable has at least:
// 	name: what it's called in the scripting context
// 	displayName: what it's called in the UI
//	default: what value it starts with

exports = {
	displayName: "Basic Config",
	config: [
		// Boolean
		{
			name: "cfgBool",
			displayName: "Boolean",
			default: true
		},
		// Text
		{
			name: "cfgText",
			displayName: "Text",
			default: "Hello!"
		},
		// Number
		{
			name: "cfgNumber",
			displayName: "Number",
			default: 0
		},
		// Enum<string>
		{
			name: "cfgEnum",
			displayName: "Enum",
			options: [{
				name: "opt1",
				displayName: "Option1",
			},
			{
				name: "opt2",
				displayName: "Option2",
			},
			{
				name: "opt3",
				displayName: "Option3",
			}],
			default: "opt1"
		},
		// MultiEnum<string>
		{
			name: "cfgMultiEnum",
			displayName: "Multi Enum",
			options: [
				{
					name: "opt1",
					displayName: "Option1"
				},
				{
					name: "opt2",
					displayName: "Option2"
				},
				{
					name: "opt3",
					displayName: "Option3"
				}
			],
			default: ["opt1", "opt2"]
		},
		// File
		{
			name: "cfgFileBrowse",
			displayName: "File Browse",
			default: "",
			fileFilter: ".*",
		},
		// Hex number
		{
			name: "cfgHexNumber",
			displayName: "Number (hex)",
			displayFormat: "hex",
			default: 0xABCDEF,
		},
		// Ipv4
		{
			name: "cfgIpv4",
			displayName: "IPv4",
			default: "255.255.255.1",
			placeholder: "000.000.000.000",
			textType: "ipv4_address",
		},
		// Mac 48
		{
			name: "cfgMac48",
			displayName: "MAC",
			default: "11:22:33:44:55:66",
			placeholder: "00:00:00:00:00:00",
			textType: "mac_address_48",
		},
	],
};
