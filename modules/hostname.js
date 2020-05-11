function createHostArray(){
	
	var fs = require("fs");
	var textByLine = fs.readFileSync('/home/prince/Downloads/sysfw-public-docs-2020.04/docs/public/5_soc_doc/j721e/hosts.rst')
	.toString().split("\n");

    var first = true;
    var hostArray = [];

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

var hostArray = createHostArray();

export default hostArray;