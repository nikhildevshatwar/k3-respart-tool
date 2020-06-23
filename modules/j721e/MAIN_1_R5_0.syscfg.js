
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex R5_1 context 0 on Main island",
  "Security": "Non Secure",
  "hostId": 40,
  "hostName": "MAIN_1_R5_0",
  "privId": 214
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        