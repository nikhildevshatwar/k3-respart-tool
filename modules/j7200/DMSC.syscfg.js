
        const {createHostModule} = system.getScript("/modules/sysfwResPart.js");
        const hostInfo = {
  "Description": "Device Management and Security Control",
  "Security": "Secure",
  "hostId": 0,
  "hostName": "DMSC"
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        