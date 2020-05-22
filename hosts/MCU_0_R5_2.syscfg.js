
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 5,
  "hostName": "MCU_0_R5_2",
  "Security": "Non Secure",
  "Description": "Cortex R5 context 2 on MCU island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
