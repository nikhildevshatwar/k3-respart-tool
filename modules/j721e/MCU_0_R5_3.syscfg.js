
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex R5 context 3 on MCU island",
  "Security": "Secure",
  "hostId": 6,
  "hostName": "MCU_0_R5_3",
  "privId": 97
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        