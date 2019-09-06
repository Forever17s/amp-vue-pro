#!/bin/bash
kill $(ps aux | grep 'node' | grep -v grep | awk '{print $2}')
sh run.sh &
