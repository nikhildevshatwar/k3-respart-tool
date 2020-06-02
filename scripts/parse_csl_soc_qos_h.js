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

function createQosArray(path) {
        var fs = require("fs");
        var textByLine = fs.readFileSync(path)
                .toString().split("\n");

        var start, end;
        for (var line = 0; line < textByLine.length; line++) {
                textByLine[line] = textByLine[line].trim();
                if (textByLine[line] === "{") {
                        start = line;
                }
                if (textByLine[line] === "}") {
                        end = line;
                }
        }

        var temp = [];
        for (var line = start; line <= end; line++) {

                var sz = textByLine[line].length;
                if (textByLine[line][0] === "#" && textByLine[line][sz - 1] === ")") {
                        temp.push(textByLine[line]);
                }
        }

        textByLine = temp;

        var toPrint = [];

        for (var line = 0; line < textByLine.length; line++) {

                var info = textByLine[line].split(" ");
                temp = [];

                for (var idx = 0; idx < info.length; idx++) {
                        if (info[idx] !== "") {
                                temp.push(info[idx]);
                        }
                }
                temp.shift();
                info = temp;
                var name = extractname(info[0]);
                var sz = toPrint.length;
                if (sz && toPrint[sz - 1].name === name) {

                        toPrint[sz - 1].info.push(info[1]);
                }
                else {
                        toPrint.push({
                                name: name,
                                cslBase: info[0],
                                info: [info[1]]
                        })
                }
        }

        for (var idx = 0; idx < toPrint.length; idx++) {
                toPrint[idx].baseAddress = extractvalue(toPrint[idx].info[0]);
                toPrint[idx].channelCount = parseInt(extractvalue(toPrint[idx].info[1]), 10);
                toPrint[idx].qos = parseInt(extractvalue(toPrint[idx].info[2]), 10);
                toPrint[idx].virtId = parseInt(extractvalue(toPrint[idx].info[3]), 10);
                toPrint[idx].orderId = parseInt(extractvalue(toPrint[idx].info[4]), 10);
                toPrint[idx].epriority = parseInt(extractvalue(toPrint[idx].info[5]), 10);
                toPrint[idx].atype = parseInt(extractvalue(toPrint[idx].info[6]), 10);
                toPrint[idx].asel = parseInt(extractvalue(toPrint[idx].info[7]), 10);

                delete toPrint[idx].info;
        }

        return toPrint;
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




