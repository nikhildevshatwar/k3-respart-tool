
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex A72 context 1 on Main island",
  "Security": "Secure",
  "hostId": 11,
  "hostName": "A72_1",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        