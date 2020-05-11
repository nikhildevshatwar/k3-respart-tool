// This module shows how modules can dynamically request hardware resources for the tool's solver
// to resolve.  This is only a basic example - there are ways to request "any of the following pins"
// or to restrict out certain possible peripheral or muxing choices, or to indicate that the tool
// should try to share a resource with some other module
//
// The names of the resources are device specific, but typically modules requesting this stuff are
// already device specific

exports = {
	displayName: "Pinmux Requirements",
	config: [{
		name: "perfType",
		displayName: "Mode",
		options: [
			{
				name: "3pin",
				displayName: "3 Pin with GPIO"
			},
			{
				name: "4pin",
				displayName: "4 Pin"
			}
		],
		default: "4pin"
	}],
	pinmuxRequirements: (inst) => {

		// Create a request for a SPI with 3 pins

		const spi = {
			name: "spi",
			displayName: "SPI Peripheral",
			interfaceName: "SPI",
			resources: [{
				name: "sclkPin",
				displayName: "SCLK Pin",
				interfaceNames: ["CLK"]
			}, {
				name: "misoPin",
				displayName: "MISO Pin",
				interfaceNames: ["SOMI"]
			}, {
				name: "mosiPin",
				displayName: "MOSI Pin",
				interfaceNames: ["SIMO"]
			}]
		};

		if (inst.perfType === "4pin") {

			// Add the STE pin to the request as well

			spi.resources.push({
				name: "ssPin",
				displayName: "SS Pin",
				interfaceNames: ["STE"]
			});
			return [spi];
		} else {

			// Request the 3 pin SPI, but also request a GPIO pin

			return [
				spi,
				{
					name: "gpio",
					displayName: "GPIO Pin",
					interfaceName: "GPIO"
				}
			];
		}
	}
};
