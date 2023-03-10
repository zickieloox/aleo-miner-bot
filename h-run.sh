#!/bin/bash

. h-manifest.conf                                                                                                                                                                                                  


[[ `ps aux | grep "\./zic_damominer" | grep -v grep | wc -l` != 0 ]] &&
        echo -e "${RED}$CUSTOM_NAME miner is already running${NOCOLOR}" &&
        exit 1                                                                                                                                                                                                     

#try to release TIME_WAIT sockets
#while true; do
#       for con in `netstat -anp | grep TIME_WAIT | grep $MINER_API_PORT | awk '{print $5}'`; do
#               killcx $con lo
#       done
#       netstat -anp | grep TIME_WAIT | grep $MINER_API_PORT &&
#               continue ||
#               break
#done

CUSTOM_LOG_BASEDIR=`dirname "$CUSTOM_LOG_BASENAME"`
[[ ! -d $CUSTOM_LOG_BASEDIR ]] && mkdir -p $CUSTOM_LOG_BASEDIR

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/hive/lib                                                                                                                                                                  
./zic_damominer $(< $CUSTOM_CONFIG_FILENAME) 2>&1 | tee --append ${CUSTOM_LOG_BASENAME}.log