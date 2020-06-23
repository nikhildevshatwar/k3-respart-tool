
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex R5 Context 2 on MCU island",
  "Security": "Non Secure",
  "hostId": 5,
  "hostName": "R5_2",
  "privId": 97
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        