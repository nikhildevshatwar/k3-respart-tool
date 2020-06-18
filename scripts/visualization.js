const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"), (r) => r.soc);
const socName = devData[deviceSelected].shortName;

var resources = system.getScript("/data/" + socName + "/Resources.json");
var { mapByResources } = system.getScript("/scripts/allocation.js");

var cssString = `<style>
.cell {
        border: solid 1px #000000;
        text-align: center;
}

.header {
        background-color: #DDDDDD;
        border: solid 1px black;   
}

.activeCell {
        background-color: #008C99;
        color: #FFFFFF;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  top: 120%;
  left: 120%;
 
  position: absolute;
  z-index: 1;
}

.cell:hover .tooltiptext {
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

                        row += "<td class=\"cell header\">" + resource.utype + "</td>\n";
                        if (system.modules["/modules/sysfwResPart"]) {
                                for (let inst of system.modules["/modules/sysfwResPart"].$instances) {
                                        var resHostInfo = perHost[inst.hostName];

					if (resHostInfo && resHostInfo.length) {
                                        	row += "<td class=\"cell activeCell\">";
					} else {
                                        	row += "<td class=\"cell\">";
					}
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
                                                row += "Start = " + entry.start;
                                                row += "Count = " + entry.count + " ";
                                                row += `</span>
                                                </div>`;
                                        })

                                        row += "</td>\n";
                                }
                        }
                        if (perHost["ALL"]) {
                                row += "<td class=\"cell header\">";
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
                                row += "<td class=\"cell header\">";
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
