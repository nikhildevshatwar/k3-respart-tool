
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex A53 context 7 on Main island",
  "Security": "Non Secure",
  "hostId": 17,
  "hostName": "A53_7",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        