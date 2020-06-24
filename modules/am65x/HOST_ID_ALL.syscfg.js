
        const {createHostModule} = system.getScript("/modules/sysfwResPart.js");
        const hostInfo = {
  "Description": "Host catch all. Used in board configuration resource assignments to define resource ranges useable by all hosts. Cannot be used",
  "Security": "N/A",
  "hostId": 128,
  "hostName": "HOST_ID_ALL"
};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        