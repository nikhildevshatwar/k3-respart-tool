topdir=`git rev-parse --show-toplevel`
sysfw_repo=`cd $topdir/../system-firmware; pwd`
csl_repo=`cd $topdir/../csl; pwd`

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
	esac

	# Parse SYSFW documentation Resource assignments
	node $topdir/scripts/parse_resource_rst.js --soc $soc \
	  --doc $sysfw_repo/docs/public/5_soc_doc/$sysfw_soc/resasg_types.rst \
	  --dep $topdir/data/$soc/ResDependencies.json
	echo "Generated data/$soc/ResDependencies.json"
	cat $topdir/data/$soc/Resources.json | json_pp -json_opt pretty > pretty.json
	mv pretty.json $topdir/data/$soc/Resources.json
	echo "  Converted to pretty format"

	# Parse CSL SoC QoS data
	if [ "$csl_soc" != "" ]; then
		node $topdir/scripts/parse_csl_soc_qos_h.js --soc $soc \
		   --doc $csl_repo/soc/$csl_soc/src/csl_soc_qos.h
		echo "Generated data/$soc/Qos.json"
		cat $topdir/data/$soc/Qos.json | json_pp -json_opt pretty > pretty.json
		mv pretty.json $topdir/data/$soc/Qos.json
	echo "  Converted to pretty format"
	fi
}

if [ "$1" = "" ]; then
	echo "Specify which soc to build"
	exit
elif [ "$1" = "all" ]; then
	gen_files j721e
	gen_files am65x
else
	gen_files $1
fi

