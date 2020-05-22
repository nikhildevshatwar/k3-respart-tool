
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 50,
  "hostName": "ICSSG_0",
  "Security": "Non Secure",
  "Description": "ICSSG context 0 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
