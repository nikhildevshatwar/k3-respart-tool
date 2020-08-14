
const {createHostModule} = system.getScript("/modules/sysfwResPart.js");
const hostInfo = {
  "Description": "DMSC to DM communication",
  "Security": "Non Secure",
  "displayName": "DMSC to DM communication",
  "hostId": 251,
  "hostName": "DMSC2DM",
  "privId": 96
};
const modDef = createHostModule(hostInfo);
exports = modDef;
