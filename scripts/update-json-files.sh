topdir=`git rev-parse --show-toplevel`
sysfw_repo=`cd $topdir/../system-firmware; pwd`
csl_repo=`cd $topdir/../csl; pwd`

prettify_json() {
file=$1
	jq --tab --sort-keys . $file > pretty.json
	mv pretty.json $file
	echo "  Converted to pretty format"
}

gen_files() {
soc=$1
	case $soc in
		j721e)
			sysfw_soc=j721e
			csl_soc=j721e
			;;
		am65x)
			sysfw_soc=am6x
			csl_soc=
			;;
		am64x)
			sysfw_soc=am64x
			csl_soc=am64x
			;;
	esac

	# Parse SYSFW documentation Resource assignments
	node $topdir/scripts/parse_resource_rst.js --soc $soc \
	  --doc $sysfw_repo/docs/public/5_soc_doc/$sysfw_soc/resasg_types.rst \
	  --dep $topdir/data/$soc/ResDependencies.json
	echo "Generated data/$soc/Resources.json"
	prettify_json $topdir/data/$soc/Resources.json 

	# Parse SYSFW documentation Host descriptions
	node $topdir/scripts/parse_hostname_rst.js --soc $soc \
	  --doc $sysfw_repo/docs/public/5_soc_doc/$sysfw_soc/hosts.rst \
	  --firewall $sysfw_repo/docs/public/5_soc_doc/$sysfw_soc/firewalls.rst
	echo "Generated data/$soc/Hosts.json"
	prettify_json $topdir/data/$soc/Hosts.json 

	# Parse CSL SoC QoS data
	if [ -f $topdir/data/$soc/SOCData.json ]; then
		node $topdir/scripts/parse_csl_soc_qos_h.js --soc $soc \
		   --doc $topdir/data/$soc/SOCData.json
		echo "Generated data/$soc/Qos.json"
		prettify_json $topdir/data/$soc/Qos.json 
	fi

	# Parse Slave Firewall data
	if [ -f $topdir/data/$soc/SOCData.json ]; then
		node $topdir/scripts/generate_firewall_json.js --soc $soc \
		   --doc $topdir/data/$soc/SOCData.json \
		   --dname $topdir/data/$soc/DeviceName.json
		echo "Generated data/$soc/Firewall.json"
		prettify_json $topdir/data/$soc/Firewall.json 
	fi
}

if [ "$1" = "" ]; then
	echo "Specify which soc to build"
	exit
elif [ "$1" = "all" ]; then
	gen_files j721e
	gen_files am65x
	gen_files am64x
else
	gen_files $1
fi

