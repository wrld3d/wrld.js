#!/usr/bin/env sh

# Trap errors #
error() {
  # Dump error location #
  local parent_lineno="$1"
  local message="$2"
  local code="${3:-1}"
  if [[ -n "$message" ]] ; then
    echo "Error on or near line ${parent_lineno}: ${message}; exiting with status ${code}"
  else
    echo "Error on or near line ${parent_lineno}; exiting with status ${code}"
  fi

  # Exit with original error code #
  exit "${code}"
}
trap 'error ${LINENO}' ERR

sdk_version=$1

if [ -z "$sdk_version" ]; then
	echo "No SDK version number supplied, using latest."
	sdk_version="early_access/latest"
fi

sdk_url="https://cdn-webgl.eegeo.com/eegeojs/${sdk_version}/eeGeoWebGL.jgz"
echo "Using eegeo.js SDK URL: ${sdk_url}"

sdk_dir=./tmp/sdk

rm -rf ./tmp/
mkdir -p ${sdk_dir}
curl ${sdk_url} 2>/dev/null >${sdk_dir}/eeGeoWebGL.js.gz
gunzip ${sdk_dir}/eeGeoWebGL.js.gz 

#Appending line to work with require.js loader used in jasmine tests
echo 'module.exports = createWrldModule;' >> tmp/sdk/eeGeoWebGL.js

npm install
npm run test
