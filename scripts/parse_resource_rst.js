const args = require('yargs')
        .options({
                "doc" : {
                        alias : "document",
                        describe : "Path to resasg_types.rst file",
                        demandOption : true,
                        type : "string"
                },
                "soc" : {
                        describe : "Soc name",
                        demandOption : true,
                        type : "string"
                },
                "dep" : {
                        alias : "dependency",
                        describe : "Path to dependency file",
                        type : "string"
                }
        })
        .help()
        .alias('help', 'h')
        .argv;


function createResources(path){
        var resources = [];
        
        // Read the file about resource information and split line by line
        var fs = require("fs");
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
                        
                        subtypeId : ( newText[4] === '' ? resources[sz-1].subtypeId : parseInt(Number(newText[4]), 10) ),

                        uniqueId : ( newText[5] === '' ? resources[sz-1].uniqueId : parseInt(Number(newText[5]), 10) ),

                        resStart : parseInt(newText[6]),

                        resCount : parseInt(newText[7]),

                        utype : "",
                };
                resources.push(newResource);
        }
        
        // Remove unuseful entries
        while(!resources[0].deviceId)
        resources.shift();

        return resources;
}

function createResourceRange(resources){

        var newResources = [];

        // For resources where deviceName and subtypename are same create a single entry 
        // where array resRange shows range of each resource

        for( var idx = 0 ; idx < resources.length ;  ){
                var deviceName = resources[idx].deviceName;
                var subtypeName = resources[idx].subtypeName;
                var deviceId = resources[idx].deviceId;
                var subtypeId = resources[idx].subtypeId;
                var uniqueId = resources[idx].uniqueId;

                var resArray = [];

                while( idx < resources.length && ( 
                        resources[idx].deviceName === deviceName &&
                        resources[idx].subtypeName === subtypeName
                ) ){
                        resArray.push({
                                resStart : resources[idx].resStart,
                                resCount : resources[idx].resCount
                        });

                        idx++;
                }
                newResources.push({
                        deviceName : deviceName,
                        deviceId : deviceId,
                        subtypeName : subtypeName,
                        subtypeId : subtypeId,
                        uniqueId : uniqueId,
                        resRange : resArray ,
                        utype : ""
                });
        }

        return newResources;
}

function addDependencies(resources){

        var process = require('process');
        var fs = require('fs');

        // If a argument is given then use it as a path and read file to assign utype values if possible
        if(args.dep){
                var path = args.dep;
                var str = fs.readFileSync(path).toString();

                var comments = JSON.parse(str);

                for( var comment = 0 ; comment < comments.length ; comment++ ){
                        for( var resource = 0 ; resource < resources.length ; resource++ ){

                                if( resources[resource].deviceName === comments[comment].deviceName && 
                                        resources[resource].subtypeName === comments[comment].subtypeName ){

                                                resources[resource].utype = comments[comment].utype;
                                                if(comments[comment].copyFromUtype){
                                                        resources[resource].copyFromUtype = comments[comment].copyFromUtype;
                                                }
                                                if(comments[comment].restrictHosts){

                                                        for(var idx = 0 ; idx < resources[resource].resRange.length ; idx++){
                                                                resources[resource].resRange[idx].restrictHosts = comments[comment].restrictHosts;
                                                        }
                                                }
                                                if(comments[comment].resRange){
                                                        resources[resource].resRange = comments[comment].resRange;
                                                }
                                                if(comments[comment].autoAlloc === false){
                                                        resources[resource].autoAlloc = comments[comment].autoAlloc;
                                                }
                                        }
                        }
                        
                }
        }
        else {
                for( var idx = 0 ; idx < resources.length ; idx++ ){
                        resources[idx].utype = "u_type_"+idx;
                }
        }

        return resources;
}

function createOutputFile(resources,soc){

        var fs = require('fs');

        // Make json string from object
        var jsonString = JSON.stringify(resources);

        // write the data to file

        var path = "../data/" + soc + "/Resources.json" ;

        fs.writeFile(path, jsonString, (err) => { 
                if (err) throw err; 
        })
}

// Call each function defined above

var resources  = createResources(args.doc);

resources = createResourceRange(resources);

resources = addDependencies(resources);

createOutputFile(resources,args.soc);



