const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"), (r) => r.soc);
const socName = devData[deviceSelected].shortName;

var hosts = _.keyBy(system.getScript("/data/" + socName + "/Hosts.json"), (h) => h.hostName);

function getHostNameOptions() {
	var hostopt = [];
	_.each(hosts, (h) => {
		if (h.privId) {
			hostopt.push({
				name: h.hostName,
				displayName: h.hostName,
			});
		}
	});

	hostopt.unshift({
		name: "wildCard",
		displayName: "Wild Card",
	});

	hostopt.unshift({
		name: "custom",
		displayName: "Custom Priv Id",
	});

	return hostopt;
}

exports = {
	displayName: "Permissions",
	config: [
		{
			name: "hostName",
			displayName: "Host Name",
			default: "custom",
			options: getHostNameOptions(),
			onChange: (inst, ui) => {
				if (inst.hostName === "custom") {
					inst.privid = 0;
					ui.privid.readOnly = false;
				} else if (inst.hostName === "wildCard") {
					inst.privid = devData[deviceSelected].wildCardPrivId;
					ui.privid.readOnly = true;
				} else {
					inst.privid = hosts[inst.hostName].privId;
					ui.privid.readOnly = true;
				}
			},
		},
		{
			name: "privid",
			displayName: "Priv ID",
			default: 0,
		},
		{
			name: "ns_user_rd",
			displayName: "Non Secure User Read",
			default: true,
		},
		{
			name: "ns_user_wr",
			displayName: "Non Secure User Write",
			default: true,
		},
		{
			name: "ns_user_cache",
			displayName: "Non Secure User Cacheable",
			default: true,
		},
		{
			name: "ns_user_deb",
			displayName: "Non Secure User Debug",
			default: true,
		},
		{
			name: "ns_supervisor_rd",
			displayName: "Non Secure Supervisor Read",
			default: true,
		},
		{
			name: "ns_supervisor_wr",
			displayName: "Non Secure Supervisor Write",
			default: true,
		},
		{
			name: "ns_supervisor_cache",
			displayName: "Non Secure Supervisor Cacheable",
			default: true,
		},
		{
			name: "ns_supervisor_debug",
			displayName: "Non Secure Supervisor Debug",
			default: true,
		},
		{
			name: "s_user_rd",
			displayName: "Secure User Read",
			default: true,
		},
		{
			name: "s_user_wr",
			displayName: "Secure User Write",
			default: true,
		},
		{
			name: "s_user_cache",
			displayName: "Secure User Cacheable",
			default: true,
		},
		{
			name: "s_user_debug",
			displayName: "Secure User Debug",
			default: true,
		},
		{
			name: "s_supervisor_rd",
			displayName: "Secure Supervisor Read",
			default: true,
		},
		{
			name: "s_supervisor_wr",
			displayName: "Secure Supervisor Write",
			default: true,
		},
		{
			name: "s_supervisor_cache",
			displayName: "Secure Supervisor Cacheable",
			default: true,
		},
		{
			name: "s_supervisor_debug",
			displayName: "Secure Supervisor Debug",
			default: true,
		},
	],
	validate: (inst, report) => {
		var privHosts = "";
		_.each(hosts, (h) => {
			if (h.privId === inst.privid) {
				privHosts += h.hostName;
				privHosts += ", ";
			}
		});
		if (privHosts.length) {
			report.logInfo("INFO : " + "This Priv Id is used by " + privHosts, inst, "privid");
		}
	},
};
