
        const {createHostModule} = system.getScript("/modules/sysfwResPart.js");
        const hostInfo = {
  "Description": "Cortex A53 context 4 on Main island",
  "Security": "Non Secure",
  "hostId": 14,
  "hostName": "A53_4",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        