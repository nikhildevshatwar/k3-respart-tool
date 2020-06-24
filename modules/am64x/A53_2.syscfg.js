
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex A53 context 2 on Main island - VM/OS1",
  "Security": "Non Secure",
  "hostId": 12,
  "hostName": "A53_2",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        