#!/bin/bash

set -o errexit
set -o xtrace


if [[ `uname` = "Darwin" ]]; then
  exit 0
fi

sed -i -e "s/DOMAIN = 'wedeploy.me'/DOMAIN = 'wedeploy.io'/g" ./scripts/main.js

