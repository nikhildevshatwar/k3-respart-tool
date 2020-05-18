var resources = [];

function createResources(){
        
        // Read the file about resource information and split line by line
        var fs = require("fs");
        var path = './resasg_types.rst';
        var textByLine = fs.readFileSync(path).toString().split("\n");

        // Extract resource data 
	for( var line = 0 ; line < textByLine.length ; line++ ){
		
		if(textByLine[line][0] != '|') continue;

		var newText = textByLine[line].split('|');  
                
                // Remove extra spaces
		for( var data = 0 ; data < newText.length ; data++ ){
			newText[data] = newText[data].trim();
                }
                
                // Handle cases where entry is empty by 
                // replacing with previous row values
                var sz = resources.length ;
		var newResource = {
                        deviceName : ( newText[1] === '' ? resources[sz-1].deviceName : newText[1] ),
                        
                        deviceId : ( newText[2] === '' ? resources[sz-1].deviceId : parseInt(Number(newText[2]), 10) ),
                        
                        subtypeName : ( newText[3] === '' ? resources[sz-1].subtypeName : newText[3] ),
                        
                        subtypeId : ( newText[4] === '' ? resources[sz-1].deviceId : parseInt(Number(newText[4]), 10) ),

                        uniqueId : ( newText[5] === '' ? resources[sz-1].deviceId : parseInt(Number(newText[5]), 10) ),

                        resStart : parseInt(newText[6]),

                        resCount : parseInt(newText[7]),

                        utype : "",
                };
                resources.push(newResource);
	}
}

createResources();

// Remove unuseful entries
while(!resources[0].deviceId)
        resources.shift();



var process = require('process');
var fs = require('fs');


// If a argument is given then use it as a path and read file to assign utype values if possible
if(process.argv[2]){
        var path = process.argv[2];
        var str = fs.readFileSync(path).toString();

        var comments = JSON.parse(str);

        for( var comment = 0 ; comment < comments.length ; comment++ ){
                for( var resource = 0 ; resource < resources.length ; resource++ ){

                        if( resources[resource].deviceName === comments[comment].deviceName && 
                                resources[resource].subtypeName === comments[comment].subtypeName && 
                                resources[resource].resStart === comments[comment].resStart && 
                                resources[resource].resCount === comments[comment].resCount ){

                                        resources[resource].utype = comments[comment].utype;
                                }
                }
                
        }
}


// Make json string from object
var jsonString = JSON.stringify(resources);

// write the data to file
fs.writeFile('./Resources.json', jsonString, (err) => { 
        if (err) throw err; 
    })

