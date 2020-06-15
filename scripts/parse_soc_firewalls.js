const args = require('yargs')
        .options({
                "doc" : {
                        alias : "document",
                        describe : "Path to std_slave_firewall file",
                        demandOption : true,
                        type : "string"
                },
                "soc" : {
                        describe : "Soc name",
                        demandOption : true,
                        type : "string"
                },
                "dname" : {
                        describe : "Path to DeviceName.json file",
                        demandOption : true,
                        type : "string"
                }
        })
        .help()
        .alias('help', 'h')
        .argv;

function getInHexa(val){
        var hex = val.toString(16).toUpperCase();

        var prefix = "0x";
        for(var idx = 0 ; idx < (12 - hex.length); idx++){
                prefix += "0";
        }

        return prefix + hex;
}

var fs = require('fs');

var firewall = fs.readFileSync(args.doc).toString();

var names = fs.readFileSync(args.dname).toString();

names = JSON.parse(names); 
firewall = JSON.parse(firewall);

firewall = firewall.security.std_slave_firewalls;

var deviceNames = [];

names.forEach( n => {
        deviceNames.push(n.name);

        if(!n.memory){
                n.memory = false;
        }
})

function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
}

var deviceNames = deviceNames.filter(onlyUnique)

var namesMap = new Map();

for(var idx = 0 ; idx < names.length ; idx++){
        namesMap[names[idx].protected_inst] = {
                name : names[idx].name,
                memory : names[idx].memory
        }
}
var finalData = [];

var notFoundCount = 0;

firewall.forEach(item => {
        
        if(item.protected_regions.length > 0){
                var start = parseInt(item.protected_regions[0].start_address,16);
                var end = parseInt(item.protected_regions[0].end_address,16);

                item.protected_regions.forEach(r => {
                        start = Math.min(start,parseInt(r.start_address,16));
                        end = Math.max(end,parseInt(r.end_address,16));
                })

                var devName = "" , memory = false;

                if(namesMap[item.protected_inst].name){
                        devName = namesMap[item.protected_inst].name;
                        memory = namesMap[item.protected_inst].memory;
                }
                else{
                        devName = "AAAAAA" + notFoundCount;
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

deviceNames.forEach( n => {
        var interface = [];
        finalData.forEach( f => {
                if(n === f.name){
                        interface.push(f);
                        f.found = 1;
                }
        })

        if(interface.length){
                var start = interface[0].start_address;
                var end = interface[0].end_address;
                var ids = [];
                var region = interface[0].num_regions;

                interface.forEach( i => {
                        start = Math.min(start,i.start_address);
                        end = Math.max(end,i.end_address);
                        ids.push(i.id);
                        region = Math.min(region,i.num_regions);
                })
                temp.push({
                        ids: ids,
                        num_regions: region,
                        //protected_inst: item.protected_inst,
                        name: n,
                        start_address: getInHexa(start),
                        end_address: getInHexa(end),
                        memory: interface[0].memory 
                })
        }
})

finalData.forEach( f => {
        if(!f.found){
                temp.push({
                        ids: [f.id],
                        num_regions: f.num_regions,
                        name: f.name,
                        start_address: f.start_address,
                        end_address: f.end_address,
                        memory: f.memory
                })
        }
})

finalData = temp;



function createOutputFile(data,soc){

        var fs = require('fs');

        // Make json string from object
        var jsonString = JSON.stringify(data);

        // write the data to file
        var dir = process.argv[1].substring(0, process.argv[1].lastIndexOf('/'));

        var path = dir + "/../data/" + soc + "/Firewall.json" ;
        
        fs.writeFile(path, jsonString, (err) => { 
                if (err) throw err; 
        })
}

createOutputFile(finalData,args.soc);
