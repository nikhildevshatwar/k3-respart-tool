const args = require("yargs")
	.options({
		doc: {
			alias: "document",
			describe: "Path to SOC JSON file",
			demandOption: true,
			type: "string",
		},
		soc: {
			describe: "Soc name",
			demandOption: true,
			type: "string",
		},
	})
	.help()
	.alias("help", "h").argv;

function to32Bit(str) {
	var t = "";
	for (var idx = str.length - 1; idx >= 0; idx--) {
		t += str[idx];
		if (t.length === 8) break;
	}

	t = t.split("").reverse().join("");

	return "0x" + t;
}

function getAddress(base, offset) {
	base = parseInt(base);

	var val = (base + offset) & ~0xff;

	val += 256;

	return "0x" + val.toString(16).toUpperCase();
}

function createQosArray(path) {
	var fs = require("fs");
	var qosArray = fs.readFileSync(path).toString();

	qosArray = JSON.parse(qosArray);
	var allData = qosArray;
	qosArray = qosArray.qos.cbass_qos_mmr;

	var finalData = [];

	qosArray.forEach((q) => {
		finalData.push({
			asel: q.asel_capable,
			atype: q.atype_capable,
			baseAddress: to32Bit(q.mmr_base_addr),
			channelCount: q.channel_count,
			deviceName: q.master_inst.toUpperCase(),
			epriority: q.epriority_capable,
			name: q.master_intf.toUpperCase(),
			orderId: q.orderid_capable,
			qos: q.qos_capable,
			virtId: q.virtid_capable,
			groupCount: 0,
			endpointName: q.master_inst.toUpperCase() + "_" + q.master_intf.toUpperCase(),
		});
	});

	// set group Count

	var qosRegs = [];

	allData.ip_instances.forEach((i) => {
		if (i.regions) {
			i.regions.forEach((r) => {
				if (r.design_name === "qos_regs") qosRegs.push(r);
			});
		}
	});

	qosRegs.forEach((q) => {
		var base = to32Bit(q.base);
		q.registers.forEach((r) => {
			var name = r.name.split("_");
			if (name.length >= 2) {
				if (name[name.length - 1] === "map1" && name[name.length - 2] === "grp") {
					var address = getAddress(base, r.offset);
					finalData.forEach((f) => {
						if (address === f.baseAddress) {
							f.groupCount++;
						}
					});
				}
			}
		});
	});

	return finalData;
}

function createOutputFile(arr, soc) {
	var fs = require("fs");

	// Make json string from object
	var jsonString = JSON.stringify(arr);

	// write the data to file
	var dir = process.argv[1].substring(0, process.argv[1].lastIndexOf("/"));

	var path = dir + "/../data/" + soc + "/Qos.json";

	fs.writeFile(path, jsonString, (err) => {
		if (err) throw err;
	});
}

var qosInfo = createQosArray(args.doc);

createOutputFile(qosInfo, args.soc);
