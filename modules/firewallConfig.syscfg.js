const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"),(r) => r.soc);
const socName = devData[deviceSelected].shortName;

var devices = system.getScript("/data/" + socName + "/Firewall.json");

var uniqDevices = _.map(devices,(d) => {
	return d.name; 
})

var uniqDevices = _.uniq(uniqDevices);

var devOpt = _.map(uniqDevices,(d) => {
	return {
		name : d,
		displayName : d
	}
})

var deviceGroup = _.groupBy(devices,(d) => {
	return d.name;
});

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
				inst.firewalls = "";
				start = "0", end = "0";
			}
		},
		{
			name: "firewalls",
			displayName: "Firewalls for the device",
			options: (inst) => {

				var firewallopt = [];

				if(inst.device !== "unknown"){
					var group = deviceGroup[inst.device]; 
					_.each(group ,(g) => {
						firewallopt.push({
							name : g.id.toString(),
							displayName : g.id.toString()
						})
					})
				}

				return firewallopt;
			},
			default: "none",
			onChange: (inst,ui) => {
				if(inst.firewalls !== "none"){
					var group = deviceGroup[inst.device]; 
					_.each(group ,(g) => {
						if(inst.firewalls === g.id.toString()){
							start = g.start_address
							end = g.end_address
						}
					})
				}
			}
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
			collapsed: false,
			args: {
				addrStart : start,
				addrEnd : end
			}
		}]
	}
}
