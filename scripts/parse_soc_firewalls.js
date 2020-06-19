const args = require('yargs')
        .options({
                "doc": {
                        alias: "document",
                        describe : "Path to SOC JSON file",
                        demandOption: true,
                        type: "string"
                },
                "soc": {
                        describe: "Soc name",
                        demandOption: true,
                        type: "string"
                },
                "dname": {
                        describe: "Path to DeviceName.json file",
                        demandOption: true,
                        type: "string"
                },
                "firewall": {
                        describe: "Path to firewall.rst file",
                        demandOption: true,
                        type: "string"
                }
        })
        .help()
        .alias('help', 'h')
        .argv;

function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
}

function getInHexa(val) {
        var hex = val.toString(16).toUpperCase();

        var prefix = "0x";
        for (var idx = 0; idx < (12 - hex.length); idx++) {
                prefix += "0";
        }

        return prefix + hex;
}

function parseAndMergeFirewallData() {

        var fs = require('fs');

        var firewall = fs.readFileSync(args.doc).toString();

        var names = fs.readFileSync(args.dname).toString();

        names = JSON.parse(names);
        firewall = JSON.parse(firewall);

        firewall = firewall.security.std_slave_firewalls;

        var deviceNames = [];

        names.forEach(n => {
                deviceNames.push(n.name);

                if (!n.memory) {
                        n.memory = false;
                }
        })

        var deviceNames = deviceNames.filter(onlyUnique)

        var namesMap = new Map();

        for (var idx = 0; idx < names.length; idx++) {

                var inst = names[idx].protected_inst;

                inst.forEach(i => {
                        namesMap[i] = {
                                name: names[idx].name,
                                memory: names[idx].memory
                        }
                })
        }
        var finalData = [];

        var notFoundCount = 0;

        firewall.forEach(item => {

                if (item.protected_regions.length > 0) {
                        var start = parseInt(item.protected_regions[0].start_address, 16);
                        var end = parseInt(item.protected_regions[0].end_address, 16);

                        item.protected_regions.forEach(r => {
                                start = Math.min(start, parseInt(r.start_address, 16));
                                end = Math.max(end, parseInt(r.end_address, 16));
                        })

                        var devName = "", memory = false;

                        if (namesMap[item.protected_inst]) {
                                devName = namesMap[item.protected_inst].name;
                                memory = namesMap[item.protected_inst].memory;
                        }
                        else {
                                devName = "AAAAAA_" + notFoundCount;
                                notFoundCount++;
                        }

                        finalData.push({
                                id: item.id,
                                num_regions: item.num_regions,
                                protected_inst: item.protected_inst,
                                name: devName,
                                start_address: start,
                                end_address: end,
                                memory: memory
                        })
                }
        })


        var temp = [];

        deviceNames.forEach(n => {
                var interface = [];
                finalData.forEach(f => {
                        if (n === f.name) {
                                interface.push(f);
                                f.found = 1;
                        }
                })

                if (interface.length) {
                        var start = interface[0].start_address;
                        var end = interface[0].end_address;
                        var ids = [];
                        var region = interface[0].num_regions;
                        var protected_inst = [];

                        interface.forEach(i => {
                                start = Math.min(start, i.start_address);
                                end = Math.max(end, i.end_address);
                                ids.push(i.id);
                                region = Math.min(region, i.num_regions);
                                protected_inst.push(i.protected_inst);
                        })
                        temp.push({
                                ids: ids,
                                num_regions: region,
                                //protected_inst: item.protected_inst,
                                name: n,
                                start_address: getInHexa(start),
                                end_address: getInHexa(end),
                                memory: interface[0].memory,
                                protected_inst: protected_inst
                        })
                }
        })

        finalData.forEach(f => {
                if (!f.found) {
                        temp.push({
                                ids: [f.id],
                                num_regions: f.num_regions,
                                name: f.name,
                                start_address: getInHexa(f.start_address),
                                end_address: getInHexa(f.end_address),
                                memory: f.memory,
                                protected_inst: [f.protected_inst]
                        })
                }
        })

        finalData = temp;

        return finalData;
}




function createOutputFile(data, soc) {

        var fs = require('fs');

        // Make json string from object
        var jsonString = JSON.stringify(data);

        // write the data to file
        var dir = process.argv[1].substring(0, process.argv[1].lastIndexOf('/'));

        var path = dir + "/../data/" + soc + "/Firewall.json";

        fs.writeFile(path, jsonString, (err) => {
                if (err) throw err;
        })
}

function getUsedFirewalls(){

        var fs = require("fs");
	var textByLine = fs.readFileSync(args.firewall)
        .toString().split("\n");
        
        var startIndex = 0,endIndex = 0;

        for(var idx = 0 ; idx < textByLine.length ; idx++){
                if(textByLine[idx].trim() === "List of Region Based Firewalls"){
                        startIndex = idx;
                }
                if(textByLine[idx].trim() === "List of Channelized Firewalls"){
                        endIndex = idx;
                }
        }

        var temp = [];

        for(var idx = startIndex ; idx < endIndex ; idx++){
                if(textByLine[idx][0] === "|"){
                        temp.push(textByLine[idx]);
                }
        }

        textByLine = temp;

        var firewallId = [];

        textByLine.forEach( t => {
                var arr = t.split("|");
                var fId = parseInt(arr[1].trim());

                if(fId){
                        if(arr[2].trim() !== "none"){
                                firewallId.push(fId);
                        }
                }
        })

        return firewallId;

}

function removeUsedFirewalls(firewallData,usedFirewalls){

        var afterRemoving  = [];
        
        firewallData.forEach( f => {
                var ids = f.ids;
                var inst = f.protected_inst;

                var nonUsedIds = [];
                var nonUsedInst = [];

                for(var idx = 0 ; idx < ids.length ; idx++){
                        var found = 0, i = ids[idx];

                        usedFirewalls.forEach( u => {
                                if(u === i){
                                        found = 1;
                                }
                        })

                        if(!found){
                                nonUsedIds.push(i);
                                nonUsedInst.push(inst[idx]);
                        }
                }

                if(nonUsedIds.length){
                        f.ids = nonUsedIds;
                        f.protected_inst = nonUsedInst;
                        afterRemoving.push(f);
                }
        })

        return afterRemoving;
}

function mergeInterfaces(firewallData){
        var devicesWithoutName = [];
        var dataAfterMerging = [];

        firewallData.forEach( f => {
                var t = f.name.split("_");

                if(t[0] === "AAAAAA"){
                        devicesWithoutName.push(f);
                }
                else{
                        dataAfterMerging.push(f);
                }
        })

        var uniqueInterfaceName = [];
        devicesWithoutName.forEach( d => {
                var n = d.protected_inst[0];
                n = n.split("_");
                n.pop();
                d.tempName = n.join("_");
                uniqueInterfaceName.push(d.tempName);
        })

        uniqueInterfaceName = uniqueInterfaceName.filter(onlyUnique);

        var index = 0;
        uniqueInterfaceName.forEach( i => {
                var sameDevice = [];
                devicesWithoutName.forEach( d => {
                        if(i === d.tempName){
                                sameDevice.push(d);
                        }
                })

                if(sameDevice.length){
                        var start = parseInt(sameDevice[0].start_address);
                        var end = parseInt(sameDevice[0].end_address);
                        var r = sameDevice[0].num_regions;

                        var ids = [];
                        var inst = [];
                        sameDevice.forEach( s => {
                                start = Math.min(start,parseInt(s.start_address));
                                end = Math.max(end,parseInt(s.end_address));
                                ids.push(s.ids[0]);
                                inst.push(s.protected_inst[0]);
                                r = Math.min(r,s.num_regions);
                        })
                        dataAfterMerging.push({
                                name: "ZZZZ_" + index,
                                ids: ids,
                                protected_inst: inst,
                                num_regions: r,
                                start_address: getInHexa(start),
                                end_address: getInHexa(end),
                                memory: sameDevice[0].memory
                        })
                        index++;
                }
        })

        return dataAfterMerging;
}

var firewallData = parseAndMergeFirewallData();

var usedFirewalls = getUsedFirewalls();

firewallData = removeUsedFirewalls(firewallData,usedFirewalls);

firewallData = mergeInterfaces(firewallData);


createOutputFile(firewallData, args.soc);
