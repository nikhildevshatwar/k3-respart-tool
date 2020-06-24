
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex R5 Context 0 on MCU island",
  "Security": "Non Secure",
  "hostId": 3,
  "hostName": "R5_0",
  "privId": 96
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        