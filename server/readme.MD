Installation on server
===

I made a quick installation script to simplify the installation process of the server software on my VPS.

# Prerequisites
- A Debian based Distro
- NOTE: Tested only on Ubuntu 19.10
- git configured to clone this repository from github

# Installation
```console
git clone git@github.com:leerikss/baby-monitor.git
sudo mv baby-monitor /opt
cd /opt/baby-monitor/server
./install.sh
```
- Type the host name of your server
- Change if repository is to be somwhere else than in /opt/baby-monitor
- Type a (hard enough) password
  - Will be the access token for viewing the WebRTC Video/Audo feed, as well as obtaining the WebSocket connections
- The script will:
  - Install nodejs, npm
  - Install the websocket-proxy app and adds a websocket-proxy systemd service
  - Installs and configures letsencrypt and nginx
  - Installs and configures the Janus Server
