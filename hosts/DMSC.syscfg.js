
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 0,
  "hostName": "DMSC",
  "Security": "Secure",
  "Description": "Device Management and Security Control"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
