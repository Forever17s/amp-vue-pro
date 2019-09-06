#!/bin/bash
DIR=/data/amp-console-vue
cd $DIR
echo "pull code..."
git pull

echo "relaunch ..."
netstat -lntup | grep 3004 | awk '{print $NF}' | awk -F'/' '{print $1}' | xargs kill
sh run.sh &
echo "success !!!"
