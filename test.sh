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
	sdk_version="public/latest"
fi

sdk_base_url="https://cdn-webgl.eegeo.com/eegeojs/${sdk_version}/"
sdk_url="${sdk_base_url}eeGeoWebGL.jgz"
memory_initialiser_url="${sdk_base_url}eeGeoWebGL.js.mem"
echo "Using eegeo.js SDK URL: ${sdk_url}, MEM URL: ${memory_initialiser_url}"

sdk_dir=./tmp/sdk

rm -rf ./tmp/
mkdir -p ${sdk_dir}
curl ${sdk_url} 2>/dev/null >${sdk_dir}/eeGeoWebGL.js.gz
gunzip ${sdk_dir}/eeGeoWebGL.js.gz

# Manually check headers for gzip compression because of
# missing '--compressed' flag with Windows shipped curl.
out="$(curl -H "Accept-Encoding: gzip" -I ${memory_initialiser_url})"
if [[ $out == *"Content-Encoding: gzip"* ]]; then
  echo "Downloading and using gunzip to decompress memory file."
  curl ${memory_initialiser_url} 2>/dev/null | gunzip >${sdk_dir}/eeGeoWebGL.js.mem
else
  echo "Downloading uncompressed memory file."
  curl ${memory_initialiser_url} 2>/dev/null >${sdk_dir}/eeGeoWebGL.js.mem
fi

npm install
npm run test:interop
