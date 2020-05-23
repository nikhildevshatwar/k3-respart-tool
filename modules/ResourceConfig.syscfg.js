var resources = system.getScript("/data/j721e/Resources.json");
//var dependencies = system.getScript("/data/j721e/ResourceDependencies.js");

var configurables = _.map(resources,(resource) => {
	return {
		name : _.join(_.split(resource.utype," "),"_"),
		displayName : resource.utype,
		config : [
			{
				name : _.join(_.split(resource.utype," "),"_")+" start" ,
				displayName : "Start",
				default : 0
			},
			{
				name : _.join(_.split(resource.utype," "),"_")+" Count",
				displayName : "Count",
				default : 0
			}
		]
	}
});
/*
function checkDependency(inst){
	for(var dep = 0 ; dep < dependencies.length ; dep++){
		
		var from = dependencies[dep][0], to = dependencies[dep][1];
		inst[to] = inst[from];
	}
}
*/


exports = {
	displayName : "Resource Config",
	config : configurables,
	validate : (instance ,report) => {
		/*

		for(var idx = 0 ; idx < resource.length ; idx++){
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
				if(total > resource[idx].resRange[0].resCount){
					report.logError("Count of " + resource[idx].utype + " exceeds total no of resources",instance);
				}
			}
		}
		*/
	}
}
