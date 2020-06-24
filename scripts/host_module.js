const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"), (r) => r.soc);
const socName = devData[deviceSelected].shortName;

const resources = _.keyBy(system.getScript("/data/" + socName + "/Resources.json"), (r) => r.utype);
const { checkOverlap, resourceAllocate } = system.getScript("/scripts/allocation.js");
var hosts = system.getScript("/data/" + socName + "/Hosts.json");

_.each(resources, (resource) => {
	if (resource.copyFromUtype) {
		resources[resource.copyFromUtype].copyToUtype = resource.utype;
	}
	if (resource.blockCopyFrom) {
		resources[resource.blockCopyFrom].blockCopyTo = resource.utype;
	}
});

function getDisplayPrefix(toBeRemoved, removeFrom) {
	var finalPrefix = "",
		idx = 0;

	var split1 = _.split(toBeRemoved, " ");
	var split2 = _.split(removeFrom, " ");

	for (var i = 0; i < split2.length; i++) {
		if (split1[i] !== split2[i]) {
			idx = i;
			break;
		}
	}

	for (var i = idx; i < split2.length; i++) {
		finalPrefix += split2[i];
		finalPrefix += " ";
	}

	return finalPrefix;
}

// Find all unique group names

var groupNames = [];

_.each(resources, (resource) => {
	groupNames.push(resource.groupName);
});
groupNames = _.uniq(groupNames);

// Create map of groupName to resources

var byGroup = _.groupBy(resources, (r) => {
	return r.groupName;
});

function getHostConfigurables(hostName) {
	// Create configurable for each resource

	var configurables = [];

	_.each(groupNames, (gName) => {
		var groupResources = byGroup[gName];

		var def = {
			name: _.join(_.split(gName, " "), "_"),
			displayName: gName,
			config: [],
			collapsed: false,
		};

		_.each(groupResources, (r) => {
			var canBeRouted = checkRestrictHost(hostName, r);
			var displayPrefix = getDisplayPrefix(gName, r.utype);
			def.config.push({
				name: _.join(_.split(r.utype, " "), "_") + "_start",
				displayName: displayPrefix + " Start",
				default: 0,
				hidden: r.autoAlloc === false && !r.copyFromUtype ? false : true,
				onChange: (inst, ui) => {
					if (r.copyToUtype && r.autoAlloc === false) {
						var dest = _.join(_.split(r.copyToUtype, " "), "_");
						var src = _.join(_.split(r.utype, " "), "_");
						inst[dest + "_start"] = inst[src + "_start"];
					}
				},
			});

			def.config.push({
				name: _.join(_.split(r.utype, " "), "_") + "_count",
				displayName: displayPrefix + " Count",
				default: 0,
				readOnly: r.copyFromUtype ? true : false,
				hidden: !canBeRouted || r.copyFromUtype ? true : false,
				description: r.copyFromUtype
					? "Count of this resource is automatically matched with resource " + r.copyFromUtype
					: "",
				onChange: (inst, ui) => {
					if (r.copyToUtype) {
						var dest = _.join(_.split(r.copyToUtype, " "), "_");
						var src = _.join(_.split(r.utype, " "), "_");
						inst[dest + "_count"] = inst[src + "_count"];
					}
				},
			});

			if (r.blockCopy) {
				def.config.push({
					name: _.join(_.split(r.utype, " "), "_") + "_blockCount",
					displayName: "========> Block-copy count",
					default: 0,
					readOnly: r.copyFromUtype ? true : false,
					hidden: r.blockCopyFrom || r.copyFromUtype ? true : false,
					description: r.copyFromUtype
						? "Block Count of this resource is automatically matched with resource " + r.copyFromUtype
						: "",
					onChange: (inst, ui) => {
						if (r.copyToUtype) {
							var dest = _.join(_.split(r.copyToUtype, " "), "_");
							var src = _.join(_.split(r.utype, " "), "_");
							inst[dest + "_blockCount"] = inst[src + "_blockCount"];
						}

						if (r.blockCopyTo) {
							var dest = _.join(_.split(r.blockCopyTo, " "), "_");
							var src = _.join(_.split(r.utype, " "), "_");
							inst[dest + "_blockCount"] = inst[src + "_blockCount"];

							if (resources[r.blockCopyTo].copyToUtype) {
								var to = _.join(_.split(resources[r.blockCopyTo].copyToUtype, " "), "_");
								var from = _.join(_.split(r.blockCopyTo, " "), "_");

								inst[to + "_blockCount"] = inst[from + "_blockCount"];
							}
						}
					},
				});
			}
		});

		configurables.push(def);
	});

	return configurables;
}

// Extract hostname of all hosts

var hostName = [];

for (var data = 0; data < hosts.length; data++) {
	var newHostName = {
		name: hosts[data].hostName,
		displayName: hosts[data].hostName,
	};

	hostName.push(newHostName);
}

function optionValues(val) {
	var option = [];
	for (var i = 0; i < 1 << val; i++) {
		option.push({
			name: i,
			displayName: i.toString(),
		});
	}
	return option;
}

// Check if host is present in restrictHost of resource

function checkRestrictHost(hostName, resource) {
	var restrictHostFound = 0,
		hostFound = 0;
	_.each(resource.resRange, (range) => {
		if (range.restrictHosts) {
			restrictHostFound = 1;
			_.each(range.restrictHosts, (res) => {
				if (res === hostName) {
					hostFound = 1;
				}
			});
		}
	});

	return !(restrictHostFound && !hostFound);
}

function createHostModule(hostInfo) {
	var configurables = getHostConfigurables(hostInfo.hostName);
	var def = {
		displayName: hostInfo.hostName,
		longDescription: `
                Host Description: ${hostInfo.Description}
                        
                ==============================================

                Security: ${hostInfo.Security}
                `,
		moduleStatic: {
			config: [
				{
					name: "HostCapabilities",
					displayName: "Host Capabilities",
					config: [
						// Allowed atypes
						{
							name: "allowedAtype",
							displayName: "Allowed values of atype",
							options: [
								{
									name: 0,
									displayName: "Physical address",
								},
								{
									name: 1,
									displayName: "Intermediate Physical address",
								},
								{
									name: 2,
									displayName: "Virtual address",
								},
							],
							default: [0, 1, 2],
						},
						// Allowed values of qos
						{
							name: "allowedqos",
							displayName: "Allowed values of qos",
							default: "unknown",
							options: optionValues(3),
							default: [0, 1, 2, 3, 4, 5, 6, 7],
						},
						// Allowed values of orderid
						{
							name: "allowedorderid",
							displayName: "Allowed values of orderid",
							default: "unknown",
							options: optionValues(4),
							default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
						},
						// Allowed values of priority
						{
							name: "allowedpriority",
							displayName: "Allowed values of priority",
							default: "unknown",
							options: optionValues(3),
							default: [0, 1, 2, 3, 4, 5, 6, 7],
						},
						// Allowed values of schedpriority
						{
							name: "allowedschedpriority",
							displayName: "Allowed values of schedpriority",
							default: "unknown",
							options: optionValues(2),
							default: [0, 1, 2, 3],
						},
						// Supervisor Host
						{
							name: "supervisorhost",
							displayName: "Supervisor Host",
							options: [
								{
									name: "none",
									displayName: "None",
								},
								...hostName,
							],
							default: "none",
						},
						// Share Resource With Host
						{
							name: "shareResource",
							displayName: "Share Resources with",
							options: [
								{
									name: "none",
									displayName: "None",
								},
								...hostName,
							],
							default: "none",
						},
					],
				},
				...configurables,
			],
		},
	};

	return def;
}

exports = {
	createHostModule,
};
