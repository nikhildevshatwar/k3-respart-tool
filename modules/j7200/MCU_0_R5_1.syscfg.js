
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex R5 context 1 on MCU island(Boot)",
  "Security": "Secure",
  "hostId": 4,
  "hostName": "MCU_0_R5_1",
  "privId": 96
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        