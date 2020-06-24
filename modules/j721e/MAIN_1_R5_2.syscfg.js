
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex R5_1 context 2 on Main island",
  "Security": "Non Secure",
  "hostId": 42,
  "hostName": "MAIN_1_R5_2",
  "privId": 215
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        