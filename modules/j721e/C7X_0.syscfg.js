
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = {
  "Description": "C7x Context 0 on Main island",
  "Security": "Secure",
  "hostId": 20,
  "hostName": "C7X_0",
  "privId": 21
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        