const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"), (r) => r.soc);
const socName = devData[deviceSelected].shortName;

var devices = _.keyBy(system.getScript("/data/" + socName + "/Firewall.json"),(d) => d.name);


// Set the bits to 10 if a option is selected else to 01

function setBit(Resource, maxValue) {

        // This array contain option that are not selected

        var notSelected = [];
        for (var i = 0; i < maxValue; i++) {
                var found = 0;
                for (var j = 0; j < Resource.length; j++) {
                        if (Resource[j] === i) {
                                found = 1;
                        }
                }
                if (!found) {
                        notSelected.push(i);
                }
        }
        // set the selected bits to 10

        var val = 0;
        for (var i = 0; i < Resource.length; i++) {
                var bit = Resource[i];
                val |= (1 << (2 * bit + 1));
        }

        // set the unselected bits to 01

        for (var i = 0; i < notSelected.length; i++) {
                var bit = notSelected[i];
                val |= (1 << (2 * bit));
        }
        return val;
}

function decimalToBinary(val) {
        return "0b" + val.toString(2);
}

function decimalToHexadecimal(val) {
        return "0x" + val.toString(16).toUpperCase();
}

function unsignedToBinary(Resource) {
        var notSelected = [];
        var maxValue = 16;
        for (var i = 0; i < maxValue; i++) {
                var found = 0;
                for (var j = 0; j < Resource.length; j++) {
                        if (Resource[j] === i) {
                                found = 1;
                        }
                }
                if (!found) {
                        notSelected.push(i);
                }
        }
        var val = [];
        for (var i = 0; i < Resource.length; i++) {
                var bit = Resource[i];
                val[(2 * bit + 1)] = 1;
        }
        for (var i = 0; i < notSelected.length; i++) {
                var bit = notSelected[i];
                val[(2 * bit)] = 1;
        }
        var str = "";
        for (var i = 31; i >= 0; i--) {
                if (val[i]) str += "1";
                else str += "0";
        }
        return str;
}

function toHexa(val) {
        var hex = "";
        for (var i = 7; i >= 0; i--) {
                var str = val[4 * i] + val[4 * i + 1] + val[4 * i + 2] + val[4 * i + 3];
                hex += parseInt(str, 2).toString(16).toUpperCase();
        }
        return "0x" + hex;
}

function removePrefix(str) {
        var pieces = _.split(str, "_");
        pieces.shift();
        return _.join(pieces, "_");
}

function addPrefix(str) {
        return devData[deviceSelected].sciClientPrefixReplacement + str;
}

function getValue(inst) {
        var mask = 0;
        mask |= inst.qos;
        mask |= (inst.orderId << 4);
        mask |= (inst.asel << 8);
        mask |= (inst.epriority << 12);
        mask |= (inst.virtId << 16);
        mask |= (inst.atype << 28);

        return mask;
}

function endPoint() {

        var endPoint = [];

        if (system.modules["/modules/qosConfig"]) {
                for (let inst of system.modules["/modules/qosConfig"].$instances) {
                        _.each(inst.qosdev,(e) => {
                                endPoint.push(e);
                        })
                }
        }

        return endPoint;
}

function getPermissionMask(p){
                
        var val = 0;
        var order = ["s_supervisor_wr","s_supervisor_rd","s_supervisor_cache","s_supervisor_debug","s_user_wr"
        ,"s_user_rd","s_user_cache","s_user_debug","ns_supervisor_wr","ns_supervisor_rd","ns_supervisor_cache"
        ,"ns_supervisor_debug","ns_user_wr","ns_user_rd","ns_user_cache","ns_user_deb"]
        
        for(var idx = 0 ; idx < order.length ; idx++){
                if(p[order[idx]]){
                        val |= (p[order[idx]] << idx);
                }
        }

        var pid = p.privid;
        for(var idx = 0; idx < 8 ; idx++){
                if(pid & (1 << idx)){
                        val |= (1 << (16 + idx));
                }
        }
        return "0x" + val.toString(16).toUpperCase();
}

function getControlMask(r){
        var val = 10;
        if(r.lock){
                val |= (1 << 4);
        }

        if(r.background){
                val |= (1 << 8);
        }
        val |= (1 << 9);

        return "0x" + val.toString(16).toUpperCase();
}


function generateFirewallEntries(){
        var entries = [];
        if (system.modules["/modules/firewallConfig"]) {
                for (let inst of system.modules["/modules/firewallConfig"].$instances) {
                        var device = devices[inst.device];
                        var ids = device.ids;

                        _.each(ids,(id) => {
                                var regions = inst.regions;

                                _.each(regions , (r, idx) => {
                                        var params = r.perms;
                                        var premissionArray = [];

                                        _.each(params, (p) => {
                                                premissionArray.push(getPermissionMask(p));
                                        }) 

                                        entries.push({
                                                fwl_id : id,
                                                start : r.addrStart,
                                                end : r.addrEnd,
                                                region : idx,
                                                permissions : premissionArray,
                                                n_permission_regs : params.length,
                                                control : getControlMask(r)
                                        })
                                })
                        })
                }
        }

        return entries;
}

function getNumber(val){
        var TotalSize = devData[deviceSelected].sRAMSize;
        var cacheSize = TotalSize - val;

        val = (32 * cacheSize) / TotalSize;

        return "0x" + val.toString(16).toUpperCase();
}

exports = {
        setBit,
        decimalToBinary,
        decimalToHexadecimal,
        unsignedToBinary,
        toHexa,
        removePrefix,
        addPrefix,
        getValue,
        endPoint,
        generateFirewallEntries,
        getNumber
}