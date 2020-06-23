
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "Cortex A53 context 6 on Main island",
  "Security": "Non Secure",
  "hostId": 16,
  "hostName": "A53_6",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        