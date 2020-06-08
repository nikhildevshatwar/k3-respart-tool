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


var fs = require('fs');

var firewall = fs.readFileSync(args.doc).toString();

var names = fs.readFileSync(args.dname).toString();

names = JSON.parse(names); 
firewall = JSON.parse(firewall);

var namesMap = new Map();

for(var idx = 0 ; idx < names.length ; idx++){
        namesMap[names[idx].protected_inst] = names[idx].name;
}
var finalData = [];

firewall.forEach(item => {
        var start = parseInt(item.protected_regions[0].start_address,16);
        var end = parseInt(item.protected_regions[0].end_address,16);

        item.protected_regions.forEach(r => {
                start = Math.min(start,r.start_address);
                end = Math.max(end,r.end_address);
        })

        finalData.push({
                id: item.id,
                num_regions: item.num_regions,
                protected_inst: item.protected_inst,
                name: namesMap[item.protected_inst],
                start_address: start.toString(16),
                end_address: end.toString(16)
        })
})

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
