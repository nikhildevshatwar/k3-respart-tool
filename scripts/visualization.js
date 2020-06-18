const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"), (r) => r.soc);
const socName = devData[deviceSelected].shortName;

var resources = system.getScript("/data/" + socName + "/Resources.json");
var { mapByResources } = system.getScript("/scripts/allocation.js");

var cssString = "<style>\ntd {\nborder: 1px solid black;\ntext-align: center;\nwidth: 100px;\n}\ntr {\n        background-color: #f5f5f5;\n}\ntable {\nborder-collapse: separate;\n    border-spacing: 0 25px;\n}\n</style>\n";

function getHtml() {
        var htmlString = "<table>\n";
        var resAlloc = mapByResources(true, false);

        _.each(resources, (resource) => {

                if (resAlloc) {

                        var row = "<tr>\n";
                        var utypeAlloc = resAlloc[resource.utype];
                        var perHost = _.groupBy(utypeAlloc, (r) => {
                                return r.hostName;
                        })

                        row += "<td>" + resource.utype + "</td>\n";
                        if (system.modules["/modules/sysfwResPart"]) {
                                for (let inst of system.modules["/modules/sysfwResPart"].$instances) {
                                        var resHostInfo = perHost[inst.hostName];

                                        //if(resHostInfo){
                                                row += "<td>";
                                                _.each(resHostInfo, (entry) => {
                                                        row += entry.count + ",";
                                                })

                                                row += "</td>\n";
                                        //}
                                }
                        }
                        if (perHost["ALL"]) {
                                row += "<td>" + perHost["ALL"][0].count + "</td>\n";
                        }
                        row += "</tr>\n";

                        htmlString += row;
                }
        })

        htmlString += "</table>";

        return cssString + htmlString;
}

exports ={
        getHtml
}
