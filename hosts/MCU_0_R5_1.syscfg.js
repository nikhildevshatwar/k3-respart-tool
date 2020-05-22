
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 4,
  "hostName": "MCU_0_R5_1",
  "Security": "Secure",
  "Description": "Cortex R5 context 1 on MCU island(Boot)"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
