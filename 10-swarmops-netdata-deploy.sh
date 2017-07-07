#!/bin/sh
docker run -d \
  --cap-add SYS_PTRACE \
  --restart=always \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -p 19999:19999 \
  --name swarmops-netdata \
  titpetric/netdata

