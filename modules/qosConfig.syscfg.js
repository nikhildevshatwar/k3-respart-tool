const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"),(r) => r.soc);
const socName = devData[deviceSelected].shortName;

const qos = _.keyBy(system.getScript("/data/" + socName + "/Qos.json"), (r) => r.name);

var qos_devlist = _.map(qos,(q) => {
	return {
		name : q.name,
		displayName : q.name
	}
})

qos_devlist.unshift({
	name : "unknown",
	displayName : "Select"
});

var deviceNames = [];

_.each(qos,(d) => {
	deviceNames.push(d.deviceName);
})

deviceNames = _.uniq(deviceNames);

var deviceOpt = _.map(deviceNames,(d) => {
	return {
		name : d,
		displayName : d
	}
})

deviceOpt.unshift({
	name: "unknown",
	displayName: "Select"
});

var deviceEndPoints = _.groupBy(qos,(d) => {
	return d.deviceName ;
})

function optionValues(max, stringifyName=false){
        var option = [];
	var val;
        for(var i = 0 ; i < max; i++ ){
		if (stringifyName)
		val = i.toString();
		else
			val = i;
                option.push({
                        name : val,
                        displayName : i.toString(),
                });
        }
        return option;
}

function showValidConfigurables(inst,ui){
	var maxEndPoints = 1000;
	var obj = {
		min : maxEndPoints,
		atype : 0,
		virtId : 0,
		orderId : 0,
		qos : 0,
		epriority : 0,
		asel : 0,
	}

	_.each(inst.qosdev,(e) => {
		if(e !== "none"){
			obj.min = Math.min(obj.min,qos[e].channelCount);
			obj.atype |= qos[e].atype,
			obj.virtId |= qos[e].virtId,
			obj.orderId |= qos[e].orderId,
			obj.qos |= qos[e].qos,
			obj.epriority |= qos[e].epriority,
			obj.asel |= qos[e].asel
		}
	})
	inst.numChan = (obj.min === maxEndPoints ? 0 : obj.min);
	ui.chan.hidden = false;

	ui.atype.hidden = !obj.atype;
	ui.virtId.hidden = !obj.virtId;
	ui.orderId.hidden = !obj.orderId;
	ui.qos.hidden = !obj.qos;
	ui.epriority.hidden = !obj.epriority;
	ui.asel.hidden = !obj.asel;
}

function uniqueEndAndChannel(inst,report){

	var moduleInstance = inst.$module.$instances;

	_.each(moduleInstance,(i) => {
		if(i !== inst){
			if(i.deviceName === inst.deviceName && i.chan === inst.chan){

				var intersection = _.intersection(i.qosdev,inst.qosdev);
				if(intersection.length && intersection[0] !== "none"){
					report.logError("This endPoint is used more than once for same channel",inst,"qosdev");
				}
			}
		}
	})
}

function showParameterInfo(inst,report){
	if(inst.deviceName === "unknown")
		return;
	var properties = ["atype","virtId","orderId","qos","epriority","asel"];

	_.each(properties,(p) => {
		if(!inst[p].hidden){
			var names = "";
			_.each(inst.qosdev,(e) => {
				if(!qos[e][p]){
					names += e;
					names += ", ";
				}
			})
			if(names.length){
				report.logInfo("This parameter is not available for " + names,inst,p);
			}
		}
	})
}


function setInstanceName(inst,ui) {
	var moduleInstance = inst.$module.$instances;

	var count = -1;
	_.each(moduleInstance,(i) => {
		if(i!== inst){
			if(i.deviceName === inst.deviceName && i.chan === inst.chan){
				var value = _.split(i.$name,"_");
				value = value[value.length - 1];
				count = Math.max(count,parseInt(value,10));
			}
		}
	})
	inst.$name = inst.deviceName + "_CH_" + inst.chan + "_" + (++count);
}

exports = {
	displayName: "Quality of Service",
	config: [
		{
			name: "deviceName",
			displayName: "Device Name",
			options: deviceOpt,
			default: "unknown",
			onChange: (inst, ui) => {

				if(inst.deviceName === "unknown")
					return;
				ui.qosdev.hidden = false;
				inst.qosdev = _.map(deviceEndPoints[inst.deviceName],(d) => {
					return d.name;
				})
				ui.atype.hidden = true;
				ui.virtId.hidden = true;
				ui.orderId.hidden = true;
				ui.qos.hidden = true;
				ui.epriority.hidden = true;
				ui.asel.hidden = true;

				inst.atype = 0;
				inst.virtId = 0;
				inst.orderId = 0;
				inst.qos = 0;
				inst.epriority = 0;
				inst.asel = 0;
				inst.chan = "0";

				showValidConfigurables(inst,ui);

				//setInstanceName(inst,ui);
			} 
		},
		{
			name: "qosdev",
			displayName: "QoS endpoint",
			options: qos_devlist,
			hidden: true,
			default: ["none"],
			options: (inst) => {

				var endP = _.map(deviceEndPoints[inst.deviceName],(d) => {
					return {
						name : d.name,
						displayName : d.name
					}
				})

				return endP;
			},
			onChange: (inst, ui) => {
				showValidConfigurables(inst,ui);
			}
		},
		{
			name: "numChan",
			displayName: "Available number of channels",
			readOnly: true,
			default: 0,
		},
		{
			name: "chan",
			displayName: "Channel ID",
			default: "0",
			hidden: true,
			options: (inst) => {
				return optionValues(parseInt(inst.numChan), true);
			},
			onChange: (inst,ui) => {
				//setInstanceName(inst,ui);
			}
		},
		{
			name: "atype",
			displayName: "Address type",
			default: 0,
			hidden : true,
			options: [
				{
					name: 0,
					displayName: "Physical address",
					description: "All transactions are routed directly to the target"
				},
				{
					name: 1,
					displayName: "Intermediate physical address",
					description: "All transactions are routed via PVU"
				},
				{
					name: 2,
					displayName: "Virtual address",
					description: "All transactions are routed via sMMU"
				}
			]
		},
		{
			name: "virtId",
			displayName: "virt_id",
			hidden: true,
			default: 0,
			options: optionValues(16)
		},
		{
			name: "orderId",
			displayName: "order_id",
			hidden: true,
			default: 0,
			options: optionValues(16)
		},
		{
			name: "asel",
			displayName: "Address selector",
			hidden: true,
			default: 0,
			options: optionValues(4)
		},
		{
			name: "qos",
			displayName: "Quality of Service",
			hidden: true,
			default: 0,
			options: optionValues(8)
		},
		{
			name: "epriority",
			displayName: "Escalated priority",
			hidden: true,
			default: 0,
			options: optionValues(8)
		},
	],
	validate : (inst ,report) => {
		if (inst.deviceName == "unknown") {
			report.logError("Select a device from the list", inst, "deviceName");
		}

		uniqueEndAndChannel(inst,report);
		showParameterInfo(inst,report);
	}

}
