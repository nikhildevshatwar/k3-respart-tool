const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"), (r) => r.soc);
const socName = devData[deviceSelected].shortName;

var resources = system.getScript("/data/" + socName + "/Resources.json");
var { mapByResources } = system.getScript("/scripts/allocation.js");

var cssString = `<style>
.column {
          border: 1px solid black;
          text-align: center;
          width: 80px;
}

.utypeColor {
        background-color: #00FFFF;   
}

.emptyCellColor {
        background-color: #9400D3;
}

.hostIDAllColor {
        background-color: #FF7F50;
}

.cellWithOneEntry {
        background-color: #FFEBCD;
}

.cellWithTwoEntry {
        background-color: #CD5C5C;
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  top: -5px;
  right: 105%;
 
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>`;

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

                        row += "<td class=\"column utypeColor\">" + resource.utype + "</td>\n";
                        if (system.modules["/modules/sysfwResPart"]) {
                                for (let inst of system.modules["/modules/sysfwResPart"].$instances) {
                                        var resHostInfo = perHost[inst.hostName];

                                        row += "<td class=\"column ";
                                        if (resHostInfo) {
                                                if (resHostInfo.length === 1) {
                                                        row += "cellWithOneEntry";
                                                }
                                                else {
                                                        row += "cellWithTwoEntry";
                                                }
                                        }
                                        else {
                                                row += "emptyCellColor";
                                        }

                                        row += "\">";
                                        _.each(resHostInfo, (entry, index) => {
                                                row += "<div class=\"tooltip\">";
                                                row += entry.count;
                                                if (index !== resHostInfo.length - 1) {
                                                        row += ",";
                                                }
                                                row += "\n";
                                                row += "<span class=\"tooltiptext\">";
                                                row += "HOST = " + inst.hostName + " ";
                                                if (inst.shareResource !== "none") {
                                                        row += "/" + inst.shareResource + " ";
                                                }
                                                row += "<br>";
                                                row += "Start = " + entry.start + "<br>";
                                                row += "Count = " + entry.count + " ";
                                                row += `</span>
                                                </div>`;
                                        })

                                        row += "</td>\n";
                                }
                        }
                        if (perHost["ALL"]) {
                                row += "<td class=\"column hostIDAllColor\">";
                                row += "<div class=\"tooltip\">";
                                row += perHost["ALL"][0].count + "  \n";
                                row += "<span class=\"tooltiptext\">";
                                row += "HOST = " + "HOST ID ALL" + " ";
                                row += "<br>";
                                row += "Start = " + perHost["ALL"][0].start + "<br>";
                                row += "Count = " + perHost["ALL"][0].count + " ";
                                row += `</span>
                                        </div>`;
                                row += "</td>\n";
                        }
                        else {
                                row += "<td class=\"column emptyCellColor\">";
                                row += "</td>\n";
                        }
                        row += "</tr>\n";

                        htmlString += row;
                }
        })

        htmlString += "</table>";

        return cssString + htmlString;
}

exports = {
        getHtml
}
