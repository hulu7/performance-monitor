#!/bin/bash
sm=`ps -fe |grep "God Daemon (/root/.pm2)" |grep -v "grep" |wc -l`
if [ $sm -eq 0 ]; then
   echo "start to run performance monitor."
   cd /mnt/hgfs/Repository/performance-monitor/output/
   npm start
else
   echo "performance monitor already running!"
fi

