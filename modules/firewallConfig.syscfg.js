const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"),(r) => r.soc);
const socName = devData[deviceSelected].shortName;

var devices = _.keyBy(system.getScript("/data/" + socName + "/Firewall.json"),(d) => d.name);

var uniqDevices = _.map(devices,(d) => {
	return d.name; 
})


var devOpt = _.map(uniqDevices,(d) => {
	return {
		name : d,
		displayName : d
	}
})


var start = "0" , end = "0"; 

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
				...devOpt
			],
			default: "unknown",
			onChange: (inst,ui) => {
				start = devices[inst.device].start_address, end = devices[inst.device].end_address;
			}
		}
	],
	moduleInstances: (inst) => {
		return [{
			name: "regions",
			displayName: "Firewall Regions",
			moduleName: "/modules/firewallRegion",
			minInstanceCount: 1,
			maxInstanceCount: 1,
			useArray: true,
			collapsed: false,
			args: {
				regionAlloc: false,
				defaultStart : start,
				defaultEnd : end
			}
		}]
	},
	validate: (inst,report) => {
		if(inst.device === "unknown"){
			report.logError("Select a Device",inst,"device");
		}
	}
}
