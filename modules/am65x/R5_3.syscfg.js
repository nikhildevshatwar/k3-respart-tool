
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex R5 Context 3 on MCU island",
  "Security": "Secure",
  "hostId": 6,
  "hostName": "R5_3",
  "privId": 97
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        