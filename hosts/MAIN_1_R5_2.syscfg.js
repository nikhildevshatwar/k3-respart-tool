
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 42,
  "hostName": "MAIN_1_R5_2",
  "Security": "Non Secure",
  "Description": "Cortex R5_1 context 2 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
