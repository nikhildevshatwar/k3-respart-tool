
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 6,
  "hostName": "MCU_0_R5_3",
  "Security": "Secure",
  "Description": "Cortex R5 context 3 on MCU island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
