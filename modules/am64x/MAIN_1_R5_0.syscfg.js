
const {createHostModule} = system.getScript("/modules/sysfwResPart.js");
const hostInfo = {
  "Description": "Cortex R5_1 context 0 on Main island",
  "Security": "Secure",
  "displayName": "Main R5F1 core0 NonSecure host",
  "hostId": 40,
  "hostName": "MAIN_1_R5_0"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
