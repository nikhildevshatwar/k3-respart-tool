
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex R5 context 2 on MCU island",
  "Security": "Non Secure",
  "hostId": 5,
  "hostName": "MCU_0_R5_2",
  "privId": 97
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        