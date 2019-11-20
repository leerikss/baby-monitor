#!/bin/bash

set -a

read -p "Install gstreamer libraries (y/N)?" libs
read -p "Install RaspiWiFi (y/N)?" rwifi
read -p "janus host? " jhost
read -e -p "janus video port? " -i "5001" vport
read -e -p "janus audio port? " -i "5002" aport
read -e -p "gstreamer argument vflip? " -i "false" vflip
read -e -p "gstreamer argument hflip? " -i "false" hflip
read -e -p "gstreamer argument width? " -i "960" width
read -e -p "gstreamer argument height? " -i "540" height
read -e -p "gstreamer argument framerate? " -i "24" framerate

# Install gstreamer + rpicamsrc
function install_libs() {
    sudo apt-get install -y gstreamer1.0-tools gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-plugins-bad libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev gstreamer1.0-alsa
    git clone https://github.com/thaytan/gst-rpicamsrc.git /tmp/gst-rpicamsrc
    cd /tmp/gst-rpicamsrc
    ./autogen.sh --prefix=/usr --libdir=/usr/lib/arm-linux-gnueabihf/
    make && sudo make install
    rm -Rf /tmp/gst-rpicamsrc
}

# Copy scripts
function create_script() {
    sudo mkdir -p /opt/janus-stream
    sudo -E sh -c 'envsubst < janus-stream.sh.template > /opt/janus-stream/janus-stream.sh'
    sudo chmod +x /opt/janus-stream/janus-stream.sh
}

# Init systemd
function init_systemd() {
    sudo cp janus-stream.service /etc/systemd/system
    sudo systemctl enable janus-stream
    sudo systemctl start janus-stream
    sudo systemctl reenable janus-stream
}

# Install RaspiWiFi
function install_RaspiWiFi() {
    sudo systemctl stop janus-stream
    git clone https://github.com/jasbur/RaspiWiFi.git /tmp/RaspiWiFi
    cd /tmp/RaspiWiFi
    sudo python3 initial_setup.py
    sudo rm -Rf /tmp/RaspiWiFi
}

case $libs in
[Yy]*) install_libs ;;
esac
create_script
init_systemd
case $rwifi in
[Yy]*) install_RaspiWiFi ;;
esac

set +a
