
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex A53 context 3 on Main island",
  "Security": "Non Secure",
  "hostId": 13,
  "hostName": "A53_3",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        