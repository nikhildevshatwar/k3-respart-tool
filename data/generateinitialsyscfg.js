// Read the Resources.json file and parse it to create resources array  

const fs = require('fs');
var str = fs.readFileSync("./Resources.json").toString(); 
var resources = JSON.parse(str);

var data ="/**\n* These arguments were used when this file was generated. They will be automatically applied on subsequent loads\n* via the GUI or CLI. Run CLI with '--help' for additional information on how to override these arguments.\n* @cliArgs --device 'J721E_DRA829_TDA4VM_AM752x' --package 'ALF' --part 'Default' --product 'K3-Respart-Tool@version_1'\n* @versions {'data':'20181113','timestamp':'2020021217','tool':'1.4.0+1234','templates':'20190604'}\n*/ "

data +=  "\n\n\n\n\n\n";

data += "const resourceAssignments  = scripting.addModule('/modules/resourceAssignments', {}, false);\n";

for( var idx = 1 ;idx <= resources.length ; idx++ ){
         data +=  "const resourceAssignments" + idx + " = resourceAssignments.addInstance();\n";
}

data +=  "\n\n\n\n\n\n";

// Add information about each resource

for(var idx = 1 ;idx <= resources.length ; idx++ ){
        //data += "resourceAssignments" + idx + ".$name  =  \"" + resources[idx-1].utype.split(" ").join("_").toLowerCase() + "\" ;\n" ;
        //data += "resourceAssignments" + idx + ".utype  = " + "'" + resources[idx-1].utype + "' ;\n" ;
        data += "resourceAssignments" + idx + ".devname  = " + "'" + resources[idx-1].deviceName +  "' ;\n" ;
        data += "resourceAssignments" + idx + ".devId   = " +  resources[idx-1].deviceId +  ";\n"  ;
        data += "resourceAssignments" + idx + ".subtype   = " + "'" + resources[idx-1].subtypeName +  "' ;\n"  ;
        data += "resourceAssignments" + idx + ".subtypeid  =  " +  resources[idx-1].subtypeId +  ";\n"  ;
        data += "resourceAssignments" + idx + ".resourcerangestart =  "  +  resources[idx-1].resStart +  ";\n"  ;
        data += "resourceAssignments" + idx + ".resourcecount = " +  resources[idx-1].resCount +  ";\n"  ;
        data +=  "\n\n\n\n\n\n";
}

// write data to file
fs.writeFile('./initial.syscfg', data, (err) => { 
    if (err) throw err; 
}) 