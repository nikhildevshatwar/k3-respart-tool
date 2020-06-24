
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "SGX544 Context 1 on Main island",
  "Security": "Non Secure",
  "hostId": 31,
  "hostName": "GPU_1",
  "privId": 184
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        