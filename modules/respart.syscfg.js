const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"), (r) => r.soc);
const socName = devData[deviceSelected].shortName;
var hosts = system.getScript("/data/" + socName + "/Hosts.json");

exports = {
	displayName: "Resource Partitioning",
	templates: [
		{
			name: "/templates/rm-cfg.syscfg.xdt",
			outputPath: "rm-cfg.c",
			alwaysRun: true,
		},
		{
			name: "/templates/sciclient_defaultBoardcfg_rm.syscfg.xdt",
			outputPath: "sciclient_defaultBoardcfg_rm.c",
			alwaysRun: true,
		},
		{
			name: "/templates/qos-config.syscfg.xdt",
			outputPath: socName + "-qos-config.c",
			alwaysRun: true,
		},
		{
			name: "/templates/firewall-config.syscfg.xdt",
			outputPath: socName + "-firewall-config.c",
			alwaysRun: true,
		},
		{
			name: "/templates/board-config.syscfg.xdt",
			outputPath: "board-config.c",
			alwaysRun: true,
		},
		{
			name: "/templates/sysfw_img_cfg.syscfg.xdt",
			outputPath: "sysfw_img_cfg.h",
			alwaysRun: true,
		},
	],
	topModules: [
		{
			displayName: "SYSFW Board config",
			modules: ["/modules/boardConfig"],
		},
		{
			displayName: "SYSFW Resource Partitioning",
			modules: get_host_modules(),
		},
		{
			displayName: "Peripheral Resource Partitioning",
			modules: ["/modules/qosConfig", "/modules/firewallConfig"],
		},
	],
	views: [
		{
			name: "/templates/resAllocMarkdown.xdt",
			displayName: "Resource Allocation Markwodn",
			viewType: "markdown",
			ignoreErrors: true,
		},
		{
			name: "/templates/resAllocTable.xdt",
			displayName: "Resource Allocation Table",
			viewType: "markdown",
			ignoreErrors: true,
		},
	],
};

function get_host_modules() {
	var modules = [];
	for (var idx = 0; idx < hosts.length; idx++) {
		modules.push("/modules/" + socName + "/" + hosts[idx].hostName);
	}
	return modules;
}
