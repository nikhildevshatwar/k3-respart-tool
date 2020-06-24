
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "Cortex A72 context 4 on Main island",
  "Security": "Non Secure",
  "hostId": 14,
  "hostName": "A72_4",
  "privId": 1
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        