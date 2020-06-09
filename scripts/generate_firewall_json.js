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

var deviceNames = [];

names.forEach( n => {
        deviceNames.push(n.name);
})

var namesMap = new Map();

for(var idx = 0 ; idx < names.length ; idx++){
        namesMap[names[idx].protected_inst] = names[idx].name;
}
var finalData = [];

firewall.forEach(item => {
        var start = parseInt(item.protected_regions[0].start_address,16);
        var end = parseInt(item.protected_regions[0].end_address,16);

        item.protected_regions.forEach(r => {
                start = Math.min(start,parseInt(r.start_address,16));
                end = Math.max(end,parseInt(r.end_address,16));
        })

        finalData.push({
                id: item.id,
                num_regions: item.num_regions,
                protected_inst: item.protected_inst,
                name: namesMap[item.protected_inst],
                start_address: start,
                end_address: end
        })
})


var temp = [];

deviceNames.forEach( n => {
        var interface = [];
        finalData.forEach( f => {
                if(n === f.name){
                        interface.push(f);
                }
        })
        var start = interface[0].start_address;
        var end = interface[0].end_address;
        var ids = [];

        interface.forEach( i => {
                start = Math.min(start,i.start_address);
                end = Math.max(end,i.end_address);
                ids.push(i.id);
        })
        temp.push({
                ids: ids,
                //num_regions: item.num_regions,
                //protected_inst: item.protected_inst,
                name: n,
                start_address: getInHexa(start),
                end_address: getInHexa(end)
        })
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
