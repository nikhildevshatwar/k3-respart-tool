
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 12,
  "hostName": "A72_2",
  "Security": "Non Secure",
  "Description": "Cortex A72 context 2 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
