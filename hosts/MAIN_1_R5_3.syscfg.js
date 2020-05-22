
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 43,
  "hostName": "MAIN_1_R5_3",
  "Security": "Secure",
  "Description": "Cortex R5_1 context 3 on MCU island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
