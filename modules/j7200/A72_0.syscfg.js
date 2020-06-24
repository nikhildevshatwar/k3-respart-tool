
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex A72 context 0 on Main island",
  "Security": "Secure",
  "hostId": 10,
  "hostName": "A72_0",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        