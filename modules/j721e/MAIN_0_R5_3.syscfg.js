
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex R5_0 context 3 on MCU island",
  "Security": "Secure",
  "hostId": 38,
  "hostName": "MAIN_0_R5_3",
  "privId": 213
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        