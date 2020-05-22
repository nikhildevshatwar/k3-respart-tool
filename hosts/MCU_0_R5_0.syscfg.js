
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 3,
  "hostName": "MCU_0_R5_0",
  "Security": "Non Secure",
  "Description": "Cortex R5 context 0 on MCU island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
