
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "SGX544 Context 0 on Main island",
  "Security": "Non Secure",
  "hostId": 30,
  "hostName": "GPU_0",
  "privId": 184
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        