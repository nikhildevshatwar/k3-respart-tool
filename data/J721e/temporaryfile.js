var resource = [];

var fs = require('fs');
var str = fs.readFileSync("./Resources.json").toString();
var array = JSON.parse(str);

for( var idx = 0 ; idx < array.length ; idx++ ){
        var name = array[idx].utype.split(" ").join("_").toLowerCase();
        resource.push({
                name : name,
                displayName : array[idx].utype,
                default : 0
        });
}

exports = resource ;