
exports = {
	displayName: "Firewall Configuration",
	config: [
		{
			name: "device",
			displayName: "Device to be protected",
			options: [
				{
					name: "unknown",
					displayName: "Select"
				},
				{
					name: "mmc1",
					displayName: "MMC1"
				},
				{
					name: "usb3",
					displayName: "USB3"
				}
			],
			default: "unknown"
		},
		{
			name: "firewalls",
			displayName: "Firewalls for the device",
			options: (inst) => {

				return [
					{
						name: "0",
						displayName: "Unknown",
					},
					{
						name: "128",
						displayName: "compute_cluster_j7es_mmc",
					},
					{
						name: "193",
						displayName: "main_usbss0_slv",
					}
				]
			},
			default: [ "0" ]
		},
	],
	moduleInstances: (inst) => {
		return [{
			name: "regions",
			displayName: "Firewall Regions",
			moduleName: "/modules/firewallRegion",
			minInstanceCount: 1,
			maxInstanceCount: 5,
			useArray: true,
			collapsed: false
		}]
	}
}
