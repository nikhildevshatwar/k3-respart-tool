var utils = system.getScript("/scripts/utils.js");

const resources = utils.resources;
const socName = utils.socName;
const hosts = utils.hosts;

function checkOverlap(utype, inst1) {
	var hostsInstances = utils.getSelectedHostInstances();
	var overlap = [];
	var name = _.join(_.split(utype, " "), "_");
	var start1 = inst1[name + "_start"];
	var last1 = start1 + inst1[name + "_count"];

	_.each(hostsInstances, (host) => {
		var inst2 = host;
		if (inst1 !== inst2) {
			var start2 = inst2[name + "_start"],
				last2 = start2 + inst2[name + "_count"];
			if (Math.max(start1, start2) < Math.min(last1, last2)) {
				overlap.push(inst2);
			}
		}
	});

	return overlap;
}

function hostCount(utype, hostName) {
	var count = [],
		idx = 0;
	_.each(resources[utype].resRange, (r) => {
		_.each(r.restrictHosts, (h) => {
			if (h === hostName) {
				count.push(idx);
			}
		});
		idx++;
	});

	return count;
}

function resourceAllocate(utype, addShareResourceEntries) {
	var hostsInstances = utils.getSelectedHostInstances();
	var eachResource = [];
	var name = _.join(_.split(utype, " "), "_");
	var over = [];

	if (resources[utype].autoAlloc === false) {
		var total = 0;
		_.each(hostsInstances, (host) => {
			var inst = host;
			eachResource.push({
				utype: utype,
				hostName: host.hostName,
				start: inst[name + "_start"],
				count: inst[name + "_count"],
			});

			if (addShareResourceEntries) {
				if (inst.shareResource !== "none") {
					eachResource.push({
						utype: utype,
						hostName: inst.shareResource,
						start: inst[name + "_start"],
						count: inst[name + "_count"],
					});
				}
			}
			total += inst[name + "_count"];
		});
		over.push(Math.max(0, total - resources[utype].resRange[0].resCount));
	} else {
		if (resources[utype].resRange.length > 1) {
			var rStart = [],
				rCount = [];
			_.each(resources[utype].resRange, (r) => {
				rStart.push(r.resStart);
				rCount.push(r.resCount);
			});

			_.each(hostsInstances, (host) => {
				var inst = host;
				var hCount = hostCount(utype, host.hostName);

				if (hCount.length === 1) {
					var index = hCount[0];
					eachResource.push({
						utype: utype,
						hostName: host.hostName,
						start: rStart[index],
						count: inst[name + "_count"],
					});

					if (addShareResourceEntries) {
						if (inst.shareResource !== "none") {
							eachResource.push({
								utype: utype,
								hostName: inst.shareResource,
								start: rStart[index],
								count: inst[name + "_count"],
							});
						}
					}

					rStart[index] += inst[name + "_count"];
					rCount[index] -= inst[name + "_count"];
				}
			});

			_.each(rCount, (r) => {
				var val = Math.min(0, r);
				over.push(-val);
			});
		} else {
			var total = 0;
			var startValue = resources[utype].resRange[0].resStart;
			_.each(hostsInstances, (host) => {
				if (resources[utype].blockCopy) {
					var inst = host;
					eachResource.push({
						utype: utype,
						hostName: host.hostName,
						start: startValue,
						count: inst[name + "_blockCount"],
					});

					if (addShareResourceEntries) {
						if (inst.shareResource !== "none") {
							eachResource.push({
								utype: utype,
								hostName: inst.shareResource,
								start: startValue,
								count: inst[name + "_blockCount"],
							});
						}
					}

					startValue += inst[name + "_blockCount"];
					total += inst[name + "_blockCount"];
				}
			});

			_.each(hostsInstances, (host) => {
				var inst = host;
				eachResource.push({
					utype: utype,
					hostName: host.hostName,
					start: startValue,
					count: inst[name + "_count"],
				});

				if (addShareResourceEntries) {
					if (inst.shareResource !== "none") {
						eachResource.push({
							utype: utype,
							hostName: inst.shareResource,
							start: startValue,
							count: inst[name + "_count"],
						});
					}
				}

				startValue += inst[name + "_count"];
				total += inst[name + "_count"];
			});

			eachResource.push({
				utype: utype,
				hostName: "ALL",
				start: startValue,
				count: resources[utype].resRange[0].resCount - total,
			});
			over.push(Math.max(0, total - resources[utype].resRange[0].resCount));
		}
	}
	return {
		allocation: eachResource,
		overflowCount: over,
	};
}

function allocateAndSort(skipZeroEntries, addShareResourceEntries) {
	var allocation = [];

	_.each(resources, (resource) => {
		var temp = resourceAllocate(resource.utype, addShareResourceEntries).allocation;
		var res = [];

		if (skipZeroEntries) {
			_.each(temp, (t) => {
				if (t.count) {
					res.push(t);
				}
			});
		} else {
			res = temp;
		}
		res.sort(function (a, b) {
			if (a.start < b.start) {
				return -1;
			} else if (a.start > b.start) {
				return 1;
			} else {
				var h1 = a.hostName,
					h2 = b.hostName;
				if (h1 === "ALL") return 1;
				if (h2 === "ALL") return -1;
				return hosts[h1].hostId - hosts[h2].hostId;
			}
		});
		if (res.length) allocation.push(res);
	});
	allocation.sort(function (a, b) {
		var u1 = a[0].utype,
			u2 = b[0].utype;
		return resources[u1].uniqueId - resources[u2].uniqueId;
	});

	return allocation;
}

function mapByResources(skipZeroEntries, addShareResourceEntries) {
	var allocation = allocateAndSort(skipZeroEntries, addShareResourceEntries);
	var resourcesMap;
	if (allocation.length) {
		resourcesMap = _.keyBy(allocation, (all) => all[0].utype);
	}
	return resourcesMap;
}

exports = {
	allocateAndSort,
	checkOverlap,
	resourceAllocate,
	mapByResources,
};
