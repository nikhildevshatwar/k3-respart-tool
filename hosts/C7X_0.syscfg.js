
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 20,
  "hostName": "C7X_0",
  "Security": "Secure",
  "Description": "C7x Context 0 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
