const deviceSelected = system.deviceData.device;
const devData = _.keyBy(system.getScript("/data/SOC.json"), (r) => r.soc);


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
                        endPoint.push(inst.qosdev);
                }
        }

        return endPoint;
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
        endPoint
}