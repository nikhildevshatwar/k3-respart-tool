
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex R5_1 context 1 on Main island",
  "Security": "Secure",
  "hostId": 41,
  "hostName": "MAIN_1_R5_1",
  "privId": 214
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        