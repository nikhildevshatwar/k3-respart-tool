const args = require('yargs')
        .options({
                "doc" : {
                        alias : "document",
                        describe : "Path to csl_soc_qos.h file",
                        demandOption : true,
                        type : "string"
                },
                "soc" : {
                        describe : "Soc name",
                        demandOption : true,
                        type : "string"
                }
        })
        .help()
        .alias('help', 'h')
        .argv;




function extractname(str) {
        var pieces = str.split("_");
        pieces.shift();
        pieces.shift();
        pieces.pop();
        pieces.pop();

        str = pieces.join("_");

        return str;
}

function extractvalue(str) {

        var sz = str.length;
        return str.slice(1, sz - 1);
}

function to32Bit(str){
        var t = "";
        for(var idx = str.length - 1 ; idx >=0 ; idx--){
                t += str[idx];
                if(t.length === 8)
                        break;
        }

        t = t.split("").reverse().join("");

        return "0x" + t;
}

function createQosArray(path) {
        var fs = require("fs");
        var qosArray = fs.readFileSync(path).toString();

        qosArray = JSON.parse(qosArray);
        qosArray = qosArray.qos.cbass_qos_mmr;

        var finalData = [];

        qosArray.forEach( q => {

                finalData.push({
                        asel: q.asel_capable,
                        atype: q.atype_capable,
                        baseAddress: to32Bit(q.mmr_base_addr),
                        channelCount: q.channel_count,
                        deviceName: q.master_inst.toUpperCase(),
                        epriority: q.epriority_capable,
                        name: q.master_intf.toUpperCase(),
                        orderId: q.orderid_capable,
                        qos: q.qos_capable,
                        virtId: q.virtid_capable  
                })
        })

        return finalData;
}


function createOutputFile(arr,soc){

        var fs = require('fs');

        // Make json string from object
        var jsonString = JSON.stringify(arr);

        // write the data to file
        var dir = process.argv[1].substring(0, process.argv[1].lastIndexOf('/'));

        var path = dir + "/../data/" + soc + "/Qos.json" ;
        
        fs.writeFile(path, jsonString, (err) => { 
                if (err) throw err; 
        })
}

var qosInfo = createQosArray(args.doc);

createOutputFile(qosInfo,args.soc);




