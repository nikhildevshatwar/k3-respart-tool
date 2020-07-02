
const {createHostModule} = system.getScript("/modules/sysfwResPart.js");
const hostInfo = {
  "Description": "Cortex R5_0 context 2 on Main island",
  "Security": "Secure",
  "displayName": "Main R5F0 core1 NonSecure host",
  "hostId": 37,
  "hostName": "MAIN_0_R5_2"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
