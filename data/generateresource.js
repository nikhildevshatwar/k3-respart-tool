var resArray = [];
var commArr = [];

function createResArray(){
	
    var fs = require("fs");
    var path = './resasg_types.rst';
    if(process.argv[2])path = process.argv[2];
    var textByLine = fs.readFileSync(path).toString().split("\n");
    var str = fs.readFileSync("./comment.json").toString();
    commArr = JSON.parse(str);

	for( var line = 0 ; line < textByLine.length ; line++ ){
		
		if(textByLine[line][0] != '|') continue;

		var newText = textByLine[line].split('|');  
		
		for( var data = 0 ; data < newText.length ; data++ ){
			newText[data] = newText[data].trim();
		}
        var sz = resArray.length ;
		var newres = {
			deviceName : ( newText[1] === '' ? resArray[sz-1].deviceName : newText[1] ),
			deviceId : ( newText[2] === '' ? resArray[sz-1].deviceId : parseInt(Number(newText[2]), 10) ),
			subtypeName : ( newText[3] === '' ? resArray[sz-1].subtypeName : newText[3] ),
            subtypeId : ( newText[4] === '' ? resArray[sz-1].deviceId : parseInt(Number(newText[4]), 10) ),
            uniqueId : ( newText[5] === '' ? resArray[sz-1].deviceId : parseInt(Number(newText[5]), 10) ),
            resStart : parseInt(newText[6]),
            resCount : parseInt(newText[7]),
        };
        resArray.push(newres);
	}
}

createResArray();

while(!resArray[0].deviceId)
    resArray.shift();

const fs = require('fs') 

var data ="/**\n* These arguments were used when this file was generated. They will be automatically applied on subsequent loads\n* via the GUI or CLI. Run CLI with '--help' for additional information on how to override these arguments.\n* @cliArgs --device 'J721E_DRA829_TDA4VM_AM752x' --package 'ALF' --part 'Default' --product 'K3-Respart-Tool@version_1'\n* @versions {'data':'20181113','timestamp':'2020021217','tool':'1.4.0+1234','templates':'20190604'}\n*/ "

data +=  "\n\n\n\n\n\n";

data += "const resourceAssignments  = scripting.addModule('/modules/resourceAssignments', {}, false);\n";

for( var idx = 1 ;idx <= resArray.length ; idx++ ){
    data +=  "const resourceAssignments" + idx + " = resourceAssignments.addInstance();\n";
}

data +=  "\n\n\n\n\n\n";

for(var idx = 1 ;idx <= 10 ; idx++ ){
    data += "resourceAssignments" + idx + ".$name  =  \"" + commArr[idx-1].utype.split(" ").join("_").toLowerCase() + "\" ;\n" ;
    data += "resourceAssignments" + idx + ".utype  = " + "'" + commArr[idx-1].utype + "' ;\n" ;
    data += "resourceAssignments" + idx + ".devname  = " + "'" + resArray[idx-1].deviceName +  "' ;\n" ;
    data += "resourceAssignments" + idx + ".devId   = " +  resArray[idx-1].deviceId +  ";\n"  ;
    data += "resourceAssignments" + idx + ".subtype   = " + "'" + resArray[idx-1].subtypeName +  "' ;\n"  ;
    data += "resourceAssignments" + idx + ".subtypeid  =  " +  resArray[idx-1].subtypeId +  ";\n"  ;
    data += "resourceAssignments" + idx + ".resourcerangestart =  "  +  resArray[idx-1].resStart +  ";\n"  ;
    data += "resourceAssignments" + idx + ".resourcecount = " +  resArray[idx-1].resCount +  ";\n"  ;
    data +=  "\n\n\n\n\n\n";
}


fs.writeFile('./initial.syscfg', data, (err) => { 
    if (err) throw err; 
}) 