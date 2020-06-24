
        const {createHostModule} = system.getScript("/modules/sysfwResPart.js");
        const hostInfo = {
  "Description": "Cortex R5_1 context 3 on MCU island",
  "Security": "Secure",
  "hostId": 43,
  "hostName": "MAIN_1_R5_3",
  "privId": 215
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        