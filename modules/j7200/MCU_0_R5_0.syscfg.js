
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex R5 context 0 on MCU island",
  "Security": "Non Secure",
  "hostId": 3,
  "hostName": "MCU_0_R5_0",
  "privId": 96
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        