
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex A72 context 3 on Main island",
  "Security": "Non Secure",
  "hostId": 13,
  "hostName": "A72_3",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        