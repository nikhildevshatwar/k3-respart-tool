var fs = require('fs');

function copy-devnames() {
	var input = JSON.parse(fs.readFileSync("./data/am65x/DeviceName.json").toString());
	var output = JSON.parse(fs.readFileSync("./data/am64x/DeviceName.json").toString());

	processed = []
	output.forEach(out => {
		input.forEach(inp => {
			if (JSON.stringify(inp.protected_inst) == JSON.stringify(out.protected_inst)) {
				out.name = inp.name
			}
		})
		console.log(out.name)
		processed.push(out)
	})
	output = processed

	fs.writeFile("./data/am64x/Processed.json", JSON.stringify(output), (err) => {
		if (err) throw err;
	})
}
