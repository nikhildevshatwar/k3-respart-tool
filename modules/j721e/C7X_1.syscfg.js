
        const {createHostModule} = system.getScript("/scripts/host_module.js");
        const hostInfo = {
  "Description": "C7x context 1 on Main island",
  "Security": "Non Secure",
  "hostId": 21,
  "hostName": "C7X_1",
  "privId": 21
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        