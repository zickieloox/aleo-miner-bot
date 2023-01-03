#!/usr/bin/env bash


conf=" --address $CUSTOM_TEMPLATE --proxy $CUSTOM_URL" 
[[ ! -z $CUSTOM_USER_CONFIG ]] && conf+=" $CUSTOM_USER_CONFIG"

echo "$conf"
echo "$conf" > $CUSTOM_CONFIG_FILENAME