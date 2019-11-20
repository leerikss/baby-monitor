#!/bin/bash

set -a

read -p "Install nodejs and npm (y/N)?" node
read -p "Server domain? " domain
read -e -p "WebSocket Proxy URL? " -i "wss://$domain/music" ws_url
read -e -p "Song files path? " -i "/opt/music-client/songs" songs_path
read -p "Authentication token? " token

function install_node() {
    curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
}

# Copy scripts
function create_app() {
    sudo apt-get install omxplayer
    sudo rm -Rf /opt/music-client
    sudo mkdir -p /opt/music-client
    sudo cp *.js* /opt/music-client
    sudo npm install --prefix /opt/music-client ws node-omxplayer
}

function create_config() {
    sudo -E sh -c 'envsubst < config.json.template > /opt/music-client/config.json'
}

function copy_songs() {
    sudo mkdir $songs_path
    sudo cp -rf songs/* $songs_path/
}

# Init systemd
function init_systemd() {
    sudo cp music-client.service /etc/systemd/system
    sudo systemctl enable music-client
    sudo systemctl start music-client
    sudo systemctl reenable music-client
}

case $node in
[Yy]*) install_node ;;
esac
create_app
create_config
copy_songs
init_systemd

set +a
