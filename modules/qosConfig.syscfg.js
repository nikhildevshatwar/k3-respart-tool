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
			name: "baseAddr",
			displayName: "QoS endpoint base address",
			readOnly: true,
			default: "MMC RD 0x45xxxxxx\nMMC WR 0x45yyyyyyyy"
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
			name: "virtid",
			displayName: "virt_id",
			default: 0,
			options: optionValues(16)
		},
		{
			name: "orderid",
			displayName: "order_id",
			default: 0,
			options: optionValues(16)
		},
		{
			name: "asel",
			displayName: "Address selector",
			default: 0,
			options: optionValues(4)
		},
		{
			name: "qos",
			displayName: "Quality of Service",
			default: 0,
			options: optionValues(8)
		},
		{
			name: "epriority",
			displayName: "Escalated priority",
			default: 0,
			options: optionValues(8)
		},
	]
}
