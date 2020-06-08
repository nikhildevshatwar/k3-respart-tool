const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"),(r) => r.soc);
const socName = devData[deviceSelected].shortName;

var hosts = _.keyBy(system.getScript("/data/" + socName + "/Hosts.json"),(h) => h.hostName);

var hostopt = [];
_.each(hosts,(h) => {
	if(h.privId){
		hostopt.push({
			name: h.hostName,
			displayName: h.hostName
		})
	}
});

hostopt.unshift({
	name: "custom",
	displayName: "Custom Priv Id"
})

exports = {
	displayName: "Permissions",
	config: [
		{
			name: "hostName",
			displayName: "Host Name",
			default: "custom",
			options: hostopt,
			onChange : (inst,ui) => {
				if(inst.hostName === "custom"){
					inst.privid = 0;
					ui.privid.readOnly = false;
				}
				else{
					inst.privid = hosts[inst.hostName].privId;
					ui.privid.readOnly = true;
				}
			}
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
			name: "ns_user_ex",
			displayName: "Non Secure User Execute",
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
			name: "ns_supervisor_ex",
			displayName: "Non Secure Supervisor Execute",
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
			name: "s_user_ex",
			displayName: "Secure User Execute",
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
			name: "s_supervisor_ex",
			displayName: "Secure Supervisor Execute",
			default: true,
		}
	]
}
