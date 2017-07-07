# Swarmops

**Requirements**
- a Docker Swarm with managers & workers nodes

**1/ Clone swarmops repository**
- on a **manager** node :
```shell
git clone https://github.com/cdelaitre/swarmops.git
cd swarmops
```

**2/ Configure**
- **Swarmops web**
  - On your **manager** node, edit **swarmops-web.yml** and set constraint **node.hostname** with your manager hostname :
```shell
vim swarmops-web.yml

...
        constraints:
          - node.role == manager
          - node.hostname == <YOUR_MANAGER_HOSTNAME>
...
```

- **Swarmops cluster**
  - On your **manager** node, edit **config.js** and set **swarmopsCluster** with LAN IP of your nodes :
```shell
vim config.js

...
// - swarmopsCluster : array of lan ip nodes
var swarmopsCluster = ["192.168.0.34", "192.168.0.43", "192.168.0.44", "192.168.0.45", "192.168.0.46"];
...
```

**3/ Deploy**
- **Swarmops netdata component**
  - on **each node**, run command (cf 10-swarmops-netdata-deploy.sh) :
```shell
docker run -d \
  --cap-add SYS_PTRACE \
  --restart=always \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -p 19999:19999 \
  --name swarmops-netdata \
  titpetric/netdata
```

- **Swarmops web component**
  - on your manager node, run command (cf 20-swarmops-web-deploy.sh) :
```shell
docker stack deploy --compose-file swarmops-web.yml swarmops
```

**4/ Monitor**
- Go to http://<LAN_IP_NODE>:19998

