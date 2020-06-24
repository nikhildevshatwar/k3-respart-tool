
        const {createHostModule} = system.getScript("/modules/sysfwResPart.js");
        const hostInfo = {
  "Description": "Cortex A53 context 1 on Main island",
  "Security": "Secure",
  "hostId": 11,
  "hostName": "A53_1",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        