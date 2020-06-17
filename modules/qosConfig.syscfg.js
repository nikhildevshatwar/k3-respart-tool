const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"),(r) => r.soc);
const socName = devData[deviceSelected].shortName;

const qos = _.keyBy(system.getScript("/data/" + socName + "/Qos.json"), (r) => r.endpointName);

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
	var maxChannelCount = 1000;
	var obj = {
		min : maxChannelCount,
		atype : 0,
		virtId : 0,
		orderId : 0,
		qos : 0,
		epriority : 0,
		asel : 0,
	}

	_.each(inst.qosdev,(e) => {
		if(e !== "none"){
			var n = inst.deviceName + "_" + e;
			obj.min = Math.min(obj.min,qos[n].channelCount);
			obj.atype |= qos[n].atype,
			obj.virtId |= qos[n].virtId,
			obj.orderId |= qos[n].orderId,
			obj.qos |= qos[n].qos,
			obj.epriority |= qos[n].epriority,
			obj.asel |= qos[n].asel
		}
	})
	inst.numChan = (obj.min === maxChannelCount ? 0 : obj.min);
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
				var n = inst.deviceName + "_" + e;
				if(!qos[n][p]){
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

var documentation = `
**QoS configuration**

---

This module allows you to set various Qoality of Service (QoS) parameters
for different devices in the SoC. QoS for most of the devices is programmed
at the interconnect QoS endpoints. QoS parameters for devices using UDMA
are programmed dynamically. Here you will only find devices which has CBASS
interconnect QoS endpoints.

Following steps allow you to achieve this:

*	Click on ADD button to program a device QoS endpoint
*	Select the device from the drop down list
*	Select a list of endpoints to be programmed. By default, all the
	endpoints are selected. You can add more instances with same device
	and select different set of endpoints to program the QoS differently.
*	Select the channel number for programming the exact QoS register.
*	For the selected channel, tool will present a set of parameters which
	are applicable for it. Select the appropriate value that you wish
	to program.

**Endpoint and Channel ID selection**

Every device may have multiple DMA ports to the interconnect. There is a
dedicated QoS endpoint per DMA port. Also, many devices differentiate the
type of DMA traffic by driving the channel_id value. e.g. DSS traffic for
VID1 pipeline and VIDL1 pipeline wil carry a different channel ID and the
QoS settings corresponding to this channel ID will be used. Note that, how
the channel_id is driven for a device is different for different device.

**Output files**

---

*	\`qos-config.c\` - This file should be copied to the bootloader for
	configuring the QoS registers. This file has a simple address, value
	pairs in an array. The bootloader is supposed to iterate over the
	array and program the QoS registers one-time as part of the bootup.

`

exports = {
	displayName: "Quality of Service",
	longDescription: documentation,
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
				},
				{
					name: 3,
					displayName: "Non coherent address",
					description: "Memory coherency is disabled for these transactions"
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
