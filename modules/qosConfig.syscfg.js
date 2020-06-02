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

function uniqueEndAndChannel(inst,report){

	var moduleInstance = inst.$module.$instances;

	_.each(moduleInstance,(i) => {
		if(i !== inst){
			if(i.qosdev === inst.qosdev && i.chan === inst.chan){
				report.logError("Cannot have two instances with same endpoint and channel",inst);
			}
		}
	})
}

exports = {
	displayName: "Quality of Service",
	config: [
		{
			name: "qosdev",
			displayName: "QoS endpoint",
			options: qos_devlist,
			default: "unknown",
			onChange: (inst, ui) => {

				if (inst.qosdev == "unknown")
					return;

				inst.numChan = qos[inst.qosdev].channelCount;
				ui.chan.hidden = false;
				
                                inst.$name = inst.qosdev.toLowerCase() + "_CH" + inst.chan;

				ui.atype.hidden = !qos[inst.qosdev].atype;
				ui.virtId.hidden = !qos[inst.qosdev].virtId;
				ui.orderId.hidden = !qos[inst.qosdev].orderId;
				ui.qos.hidden = !qos[inst.qosdev].qos;
				ui.epriority.hidden = !qos[inst.qosdev].epriority;
				ui.asel.hidden = !qos[inst.qosdev].asel;
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
			onChange: (inst, ui) => {
                                inst.$name = inst.qosdev.toLowerCase() + "_CH" + inst.chan;
			},
			options: (inst) => {
				return optionValues(parseInt(inst.numChan), true);
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
		if (inst.qosdev == "unknown") {
			report.logError("Select a QoS from the list", inst, "qosdev");
		}

		uniqueEndAndChannel(inst,report);
	}

}
