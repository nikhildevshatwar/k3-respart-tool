
        const {createHostModule} = system.getScript("/modules/sysfwResPart.js");
        const hostInfo = {
  "Description": "Cortex A72 context 1 on Main island - EL2/Hyp",
  "Security": "Non Secure",
  "hostId": 11,
  "hostName": "A53_1",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        