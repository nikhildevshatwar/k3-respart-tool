
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex A72 context 2 on Main island",
  "Security": "Non Secure",
  "hostId": 12,
  "hostName": "A72_2",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        