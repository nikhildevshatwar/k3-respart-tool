
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 21,
  "hostName": "C7X_1",
  "Security": "Non Secure",
  "Description": "C7x context 1 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
