const args = require("yargs")
	.options({
		soc: {
			describe: "Soc name",
			demandOption: true,
			type: "string",
		},
	})
	.help()
	.alias("help", "h").argv;

var soc = args.soc;

var fs = require("fs");

var hosts = fs.readFileSync("../data/" + soc + "/Hosts.json");

var modulePath = [];

hosts = JSON.parse(hosts);

hosts.forEach((host) => {
	const def = `
        const {createHostModule} = system.getScript("/scripts/createHostModule.js");
        const hostInfo = ${JSON.stringify(host, null, 2)};
        const modDef = createHostModule(hostInfo);
        exports = modDef;
        `;
	fs.writeFileSync(`../modules/${soc}/${host.hostName}.syscfg.js`, def);

	modulePath.push(`/modules/${soc}/${host.hostName}`);
});

var product = fs.readFileSync(`../.metadata/product.json`);

product = JSON.parse(product);

modulePath.forEach((module) => {
	if (!product.topModules.find((value) => value === module)) {
		product.topModules.push(module);
	}
});

fs.writeFileSync(`../.metadata/product.json`, JSON.stringify(product, null, 2));
