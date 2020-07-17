SCRIPT=$(readlink -f $0)
SCRIPTPATH=`dirname $SCRIPT`
SCRIPTPATH=`dirname $SCRIPTPATH`

cd $SCRIPTPATH/
rm -rf k3-respart-tool
mkdir k3-respart-tool
mkdir k3-respart-tool/modules
mkdir k3-respart-tool/data
mkdir k3-respart-tool/out

# Copy the static data
cp README.md LICENSE k3-respart-tool/
cp modules/*.js k3-respart-tool/modules/
cp -r .metadata scripts templates k3-respart-tool/

# Create baseline JSON files
echo "[]" > k3-respart-tool/data/SOC.json
jq '.devices = []' .metadata/product.json > k3-respart-tool/.metadata/product.json

while [[ $# -gt 0 ]]
do
	soc=$1

	# Copy the soc specific data
	cp -r modules/$soc k3-respart-tool/modules/
	cp -r data/$soc k3-respart-tool/data/
	cp out/*$soc* k3-respart-tool/out/

	# Update baseline JSON files with all device names for a SoC
	dev_names=`jq -r '.[] | select(.shortName == "'$soc'") | .soc' data/SOC.json`
	for device in $dev_names;
	do
		echo "Adding $soc - $device"
		jq -s --tab --sort-keys '(.[0] + [.[1][] | select(.soc == "'$device'")])' \
			k3-respart-tool/data/SOC.json data/SOC.json > temp
		mv temp k3-respart-tool/data/SOC.json

		jq --tab --sort-keys '.devices = .devices + ["'$device'"]' \
			k3-respart-tool/.metadata/product.json > temp
		mv temp k3-respart-tool/.metadata/product.json
	done
	shift
done

jq --tab --sort-keys 'sort_by(.soc)' \
	k3-respart-tool/data/SOC.json > temp
mv temp k3-respart-tool/data/SOC.json

# Create final package
version=`jq -r '.version' .metadata/product.json`
zip -r k3-respart-tool-$version.zip k3-respart-tool
