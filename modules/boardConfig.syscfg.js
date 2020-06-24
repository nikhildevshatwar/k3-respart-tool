const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"), (r) => r.soc);

function createRAMSizeOptions() {
	var opt = [];

	var gran = devData[deviceSelected].sRamGranularity;
	var curr = 0;
	var size = devData[deviceSelected].sRAMSize;

	while (curr <= size) {
		opt.push({
			name: curr,
			displayName: curr.toString() + " " + "MB",
		});

		curr += gran;
	}

	return opt;
}

exports = {
	displayName: devData[deviceSelected].shortName.toUpperCase() + " SYSFW Board Config",
	config: [
		{
			name: "ramSize",
			displayName: "SRAM Size",
			options: createRAMSizeOptions(),
			default: 0,
		},
		{
			name: "debugEnable",
			displayName: "SYSFW Debug Enable",
			default: false,
		},
	],
	maxInstances: 1,
};