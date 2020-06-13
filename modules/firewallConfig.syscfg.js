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

var documentation = `
**Firewall configuration**

---

This module allows to program the firewalls for peripheral partitioning across
different CPU cores. A firewall checks if the given transaction is allowed or
not based on few parameters like priv_id, transaction type (read/write, etc),
security and privilege levels. It is possible to program firewalls such that
only certain CPUs can access the device and accesses from any other CPUs are
ignored. Thus ensuring peripheral partitioning.

Following steps allow to do this:

*	Click on ADD button and add an instance for firewall configuration.
*	Select a device to be firewalled or protected.
*	For slave firewalls, the tool automatically fills up a firewall
	region with start and end addresses to cover all the slave interfaces
	of the device.
*	For every region, upto 3 permission slots can be added. A permission
	slot defines access permissions for a host_id. For simplicity, you
	can select a host_id for automatically filling the priv_id or provide
	a custom priv_id in the permission slot.
*	By default, for any slot, all permissions are enabled. Modify this as
	required.


**Output files**

---

*	\`firewall-config.c\` -	This file describes the firewall configuration
	for a bootloader. It contains an array of the struct
	*TISCI_MSG_FWL_SET_REGION* which can be directly passed in TISCI calls.
	Bootloader should simply iterate over this to program all the firewalls.

`

exports = {
	displayName: "Firewall Configuration",
	longDescription: documentation,
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
