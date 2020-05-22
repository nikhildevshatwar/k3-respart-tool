
const {createHostModule} = system.getScript("createHostModule");
const hostInfo = {
  "hostId": 30,
  "hostName": "GPU_0",
  "Security": "Non Secure",
  "Description": "RGX context 0 on Main island"
};
const modDef = createHostModule(hostInfo);
exports = modDef;
