#!/bin/bash

set -a

read -p "Install nodejs and npm (y/N)?" node
read -p "Server domain? " domain
read -e -p "WebSocket Proxy URL? " -i "wss://$domain/speaker" ws_url
read -p "Authentication token? " token

# Install requirements
function install_node() {
    curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
}

# Copy scripts
function create_bin() {
    sudo apt-get install libasound2-dev
    sudo rm -Rf /opt/speaker-client
    sudo mkdir /opt/speaker-client
    sudo cp *.js* /opt/speaker-client
    sudo npm install --unsafe-perm --prefix /opt/speaker-client ws speaker
}

function create_config() {
    sudo -E sh -c 'envsubst < config.json.template > /opt/speaker-client/config.json'
}

# Init systemd
function init_systemd() {
    sudo cp speaker-client.service /etc/systemd/system
    sudo systemctl enable speaker-client
    sudo systemctl start speaker-client
    sudo systemctl reenable speaker-client
}

case $node in
[Yy]*) install_node ;;
esac
create_bin
create_config
init_systemd

set +a
