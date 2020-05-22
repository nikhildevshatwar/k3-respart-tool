
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 40,
  "hostName": "MAIN_1_R5_0",
  "Security": "Non Secure",
  "Description": "Cortex R5_1 context 0 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
