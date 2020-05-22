var resource = system.getScript("/data/j721e/ResourceInfo.js")

var configurables = [];

for( var idx = 0 ; idx < resource.length ; idx++ ){
	configurables.push({
		name : resource[idx].utype + "start",
		displayName : resource[idx].utype + "start",
		hidden : true,
		default : 0
	});
	configurables.push({
		name : resource[idx].utype,
		displayName : resource[idx].utype,
		default : 0
	});
}

exports = {
	displayName : "Resource Config",
	config : configurables,
	validate : ( instance ,report ) => {

		for( var idx = 0 ; idx < resource.length ; idx++){
			if(resource[idx].resRange.length > 1){
				continue;
			}
			else{
				var total = 0; 
				if (system.modules["/modules/ResourceConfig"]) {
					for (let inst of system.modules["/modules/ResourceConfig"].$instances){
						total += inst[resource[idx].utype];
					}
				}
				if( total > resource[idx].resRange[0].resCount){
					report.logError("Count of " + resource[idx].utype + " exceeds total no of resources",instance);
				}
			}
		}
	}
}
