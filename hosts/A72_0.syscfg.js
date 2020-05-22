
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 10,
  "hostName": "A72_0",
  "Security": "Secure",
  "Description": "Cortex A72 context 0 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
