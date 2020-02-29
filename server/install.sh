#!/bin/bash

set -a

read -p "Hostname? " domain
read -e -p "Repository location? " -i "/opt/baby-monitor" repo
read -e -p "Security password? " -i "changeit" password

BASEDIR=$(pwd)

function sed_esc() {
    echo $(sed -e 's/[&\\/]/\\&/g; s/$/\\/' -e '$s/\\$//' <<<"$1")
}

function install_node() {
    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo npm install npm --global
}

function install_ws_proxy() {

    sudo npm install --prefix "$repo/server/websocket-proxy" ws dotenv

    sudo -E bash -c 'echo -e "PASSWORD=$password" > "$repo/server/websocket-proxy/.env"'
    sudo -E bash -c 'echo -e "ORIGIN=https://$domain" >> "$repo/server/websocket-proxy/.env"'
    sudo chmod 700 "$repo/server/websocket-proxy/.env"

    # systemd script
    sudo -E sh -c 'envsubst < "$repo/server/conf/systemd/websocket-proxy.service.template" \
        > /etc/systemd/system/websocket-proxy.service'
    sudo systemctl reenable websocket-proxy
    sudo systemctl start websocket-proxy

}

function install_nginx() {
    sudo apt install nginx

    sudo rm "/etc/nginx/sites-available/$domain"
    sudo rm "/etc/nginx/sites-enabled/$domain"

    sudo cp conf/nginx/nginx.conf.template "/etc/nginx/sites-available/$domain"
    domain=$(sed_esc "$domain")
    wwwhome="$repo/server/webroot"
    webroot=$(sed_esc "$wwwhome")
    sudo sed -i -e "s/\$domain/$domain/" -e "s/\$webroot/$webroot/" "/etc/nginx/sites-available/$domain"
    sudo ln -s "/etc/nginx/sites-available/$domain" "/etc/nginx/sites-enabled/$domain"
}

function install_certbot() {
    sudo apt-get install software-properties-common
    sudo add-apt-repository ppa:certbot/certbot -y
    sudo apt install python-certbot-nginx
    sudo certbot --nginx -d "$domain" -d "$domain"
    sudo systemctl restart nginx
}

function install_janus() {

    # Libraries
    sudo apt install libmicrohttpd-dev libjansson-dev \
        libssl-dev libsofia-sip-ua-dev libglib2.0-dev gtk-doc-tools \
        libopus-dev libogg-dev libcurl4-openssl-dev liblua5.3-dev \
        libconfig-dev pkg-config gengetopt libtool automake autoconf

    # libnice
    sudo rm -Rf /tmp/libnice
    git clone https://gitlab.freedesktop.org/libnice/libnice /tmp/libnice
    cd /tmp/libnice
    ./autogen.sh
    ./configure --prefix=/usr
    make && sudo make install

    # libsrtp2                                                                                                                                                                                                     
    cd /tmp
    rm -Rf libsrtp-2.2.0
    wget https://github.com/cisco/libsrtp/archive/v2.2.0.tar.gz
    tar xfv v2.2.0.tar.gz
    cd libsrtp-2.2.0
    ./configure --prefix=/usr --enable-openssl --libdir=/usr/lib64
    make shared_library && sudo make install
    # Permanent path /usr/lib64 libsrtp2 libs                                                                                                                                                                      
    sudo cp $BASEDIR/conf/ld.so.conf.d/libsrtp2.conf /etc/ld.so.conf.d/libsrtp2.conf
    sudo ldconfig
    
    # Janus
    sudo rm -Rf /opt/janus
    sudo rm -Rf /tmp/janus-gateway
    git clone https://github.com/meetecho/janus-gateway.git /tmp/janus-gateway
    cd /tmp/janus-gateway
    sh autogen.sh
    ./configure --prefix=/opt/janus --disable-websockets --disable-rabbitmq --disable-mqtt --disable-data-channels
    make && sudo make install
    sudo make configs

}

function config_janus() {

    # Janus configs
    sudo cp $BASEDIR/conf/janus/*.jcfg /opt/janus/etc/janus
    sudo -E sh -c 'envsubst < conf/janus/janus.transport.http.jcfg.template > /opt/janus/etc/janus/janus.transport.http.jcfg'

    read -e -p "Number of streaming devices? " -i 1 devices
    sudo rm -f /opt/janus/etc/janus/janus.plugin.streaming.jcfg
    sudo touch /opt/janus/etc/janus/janus.plugin.streaming.jcfg
    for ((id = 1; id <= $devices; id++)); do
        read -e -p "Streaming device [$id] name? " -i "RPI3" name
        read -e -p "Streaming device [$id] description? " -i "$name Stream" description
        read -e -p "Streaming device [$id] video port number? " -i 5001 videoport
        read -e -p "Streaming device [$id] audio port number? " -i 5002 audioport
        sudo -E sh -c 'envsubst < conf/janus/janus.plugin.streaming.jcfg.template >> /opt/janus/etc/janus/janus.plugin.streaming.jcfg'
    done

    # systemd scripts
    sudo cp $BASEDIR/conf/systemd/janus.service /etc/systemd/system
    sudo systemctl reenable janus
    sudo systemctl start janus
}

function install_turnserver() {
    sudo apt-get install -y coturn
    sudo -E sh -c 'envsubst < conf/turnserver/turnserver.conf.template > /etc/turnserver.conf'
    sudo cp $BASEDIR/conf/systemd/turnserver.service /etc/systemd/system
    sudo systemctl reenable turnserver
    sudo systemctl start turnserver
}

# TODO: npm deploy react app & config nginx

install_node
install_ws_proxy
install_nginx
install_certbot
install_janus
install_turnserver
config_janus

set +a
