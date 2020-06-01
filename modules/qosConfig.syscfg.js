const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"),(r) => r.soc);
const socName = devData[deviceSelected].shortName;

const qos = _.keyBy(system.getScript("/data/" + socName + "/Qos.json"), (r) => r.name);

var opt = _.map(qos,(q) => {
	return {
		name : q.name,
		displayName : q.name
	}
})

function optionValues(val){
        var option = [];
        for(var i = 0 ; i < val; i++ ){
                option.push({
                        name : i,
                        displayName : i.toString(),
                });
        }
        return option;
}

exports = {
	displayName: "Quality of Service",
	config: [
		{
			name: "qosend",
			displayName: "QoS endpoint",
			options: opt,
			default: opt[0].name,
			onChange: (inst, ui) => {

				//var ch = qos[inst.qosend].channelCount;
				//inst.chan.options = optionValues(ch);

				
				ui.atype.hidden = !qos[inst.qosend].atype;
				ui.virtId.hidden = !qos[inst.qosend].virtId;
				ui.orderId.hidden = !qos[inst.qosend].orderId;
				ui.qos.hidden = !qos[inst.qosend].qos;
				ui.epriority.hidden = !qos[inst.qosend].epriority;
				ui.asel.hidden = !qos[inst.qosend].asel;
			}
		},
		{
			name: "chan",
			displayName: "Channel ID",
			default: 0,
			options: optionValues(4)
		},
		{
			name: "atype",
			displayName: "Address type",
			default: 0,
			hidden : !qos[opt[0].name].atype,
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
			hidden: !qos[opt[0].name].virtId,
			default: 0,
			options: optionValues(16)
		},
		{
			name: "orderId",
			displayName: "order_id",
			hidden: !qos[opt[0].name].orderId,
			default: 0,
			options: optionValues(16)
		},
		{
			name: "asel",
			displayName: "Address selector",
			hidden: !qos[opt[0].name].asel,
			default: 0,
			options: optionValues(4)
		},
		{
			name: "qos",
			displayName: "Quality of Service",
			hidden: !qos[opt[0].name].qos,
			default: 0,
			options: optionValues(8)
		},
		{
			name: "epriority",
			displayName: "Escalated priority",
			hidden: !qos[opt[0].name].epriority,
			default: 0,
			options: optionValues(8)
		},
	]
}
