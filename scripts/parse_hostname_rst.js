const args = require('yargs')
        .options({
                "doc" : {
                        alias : "document",
                        describe : "Path to hostName.rst file",
                        demandOption : true,
                        type : "string"
                },
                "soc" : {
                        describe : "Soc name",
                        demandOption : true,
                        type : "string"
                }
        })
        .help()
        .alias('help', 'h')
        .argv;


function createHostArray(path){

	var hostArray = [];
	var fs = require("fs");
	var textByLine = fs.readFileSync(path)
	.toString().split("\n");

	var first = true;

	for( var line = 0 ; line < textByLine.length ; line++ ){
		
		if(textByLine[line][0] != '|') continue;

		if(first){

			first = false;
			continue;
		}

		var newText = textByLine[line].split('|');  
		
		for( var data = 0 ; data < newText.length ; data++ ){
			newText[data] = newText[data].trim();
		}

		var newhost = {
			hostId : parseInt(newText[1]),
			hostName : newText[2],
			Security : newText[3],
			Description : newText[4],
		};
		
		hostArray.push(newhost);
	}
	return hostArray;
}

function createOutputFile(hosts,soc){

        var fs = require('fs');

        // Make json string from object
        var jsonString = JSON.stringify(hosts);

        // write the data to file

        var path = "../data/" + soc + "/Hosts.json" ;

        fs.writeFile(path, jsonString, (err) => { 
                if (err) throw err; 
        })
}

var hostArray = createHostArray(args.doc);

createOutputFile(hostArray,args.soc);