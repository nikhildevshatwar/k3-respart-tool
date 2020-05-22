var resource = system.getScript("/data/j721e/ResourceInfo.js");
var dependencies = system.getScript("/data/j721e/ResourceDependencies.js");

var configurables = [];
var ResourceHostStart = [] ;

function checkDependency(inst){
	for(var dep = 0 ; dep < dependencies.length ; dep++){
		
		var from = dependencies[dep][0], to = dependencies[dep][1];
		inst[to] = inst[from];
	}
}

configurables.push({
	name : "final",
	displayName : "Finalize",
	default : false,
	onChange: (inst,ui) => {

		if(inst.final === true){
			var moduleInstance = inst.$module.$instances;
			var index = -1;

			for(var idx = 0 ; idx < moduleInstance.length ; idx++){
				if(inst === moduleInstance[idx]){
					index = idx;
					break;
				}
			}

			for(var idx = 0 ; idx < resource.length ; idx++){
				if(resource[idx].resRange.length > 1){
					continue;
				}
				var name = resource[idx].utype;
				inst[name + "_start"] = ResourceHostStart[idx][index];
			}
		}
	} 
});


for(var idx = 0 ; idx < resource.length ; idx++){

	configurables.push({
		name : resource[idx].utype + "_start",
		displayName : resource[idx].utype + "_start",
		//hidden : true,
		default : 0
	});

	var found = 0 

	for(var dep = 0 ; dep < dependencies.length ; dep++){

		if(dependencies[dep][1] === resource[idx].utype){
			found = 1;
		}
	}

	if(found === 0){
		configurables.push({
			name : resource[idx].utype,
			displayName : resource[idx].utype,
			default : 0,
			onChange: (inst,ui) => {
				inst.final = false;
				checkDependency(inst);
			}
		});
	}
	else{
		configurables.push({
			name : resource[idx].utype,
			displayName : resource[idx].utype,
			default : 0,
			readOnly : true,
			onChange: (inst,ui) => {
				inst.final = false;
				checkDependency(inst);

			},
		});
	}
}

exports = {
	displayName : "Resource Config",
	config : configurables,
	validate : (instance ,report) => {

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

				var moduleInstance = instance.$module.$instances;
				var name = resource[idx].utype;
				var startValue = resource[idx].resRange[0].resStart;
				var startArray = [];
				for(var inst = 0 ; inst < moduleInstance.length ; inst++ ){
					startArray[inst] = startValue; 
					startValue += moduleInstance[inst][name];
				}
				ResourceHostStart[idx] = startArray;
			}
		}
	}
}
