
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 11,
  "hostName": "A72_1",
  "Security": "Secure",
  "Description": "Cortex A72 context 1 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
