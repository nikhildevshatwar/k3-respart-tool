
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex a53 context 0 on Main islana - ATF",
  "Security": "Secure",
  "hostId": 10,
  "hostName": "A53_0",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        