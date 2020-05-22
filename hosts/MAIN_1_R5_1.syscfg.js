
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 41,
  "hostName": "MAIN_1_R5_1",
  "Security": "Secure",
  "Description": "Cortex R5_1 context 1 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
