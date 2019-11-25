Installation on RPI
===

The speaker-client will install a nodejs app, that streams incoming WebSocket audio data to the speaker.
In addition, a systemd service will be created for starting/stopping the speaker-client nodejs app.

# Prerequisites
- A RPI running Raspbian
  - Tested on RPI3 running Raspbian Buster Lite
- RPI configured with a working Internet connection
- A speaker connected to the RPI headphone jack
- RPI configured to output the audio to the headphone jack (usually works by default)
  - Refer to: https://www.raspberrypi.org/documentation/configuration/audio-config.md
- git configured to clone this repository from github

## Increase speaker volume
```console
alsamixer
```
- Refer to: https://wiki.ubuntu.com/Audio/Alsamixer

# Installation
```console
git clone git@github.com:leerikss/baby-monitor.git
cd baby-monitor/rpi/speaker-client
./install.sh
```
- First time you run the script, type y to install required nodejs/npm dependencies
- Type the domain name of the server where the websocket-proxy is installed
- The WebSocket Proxy URL is ok by default, if your server NGINX is configured to proxy pass the wss://[domain]/speaker location to the corresponding server nodejs websocket proxy app
- Authentication token needs to match your server configured websocket proxy token

# Starting/stopping
```console
sudo systemctl start speaker-client
sudo systemctl stop speaker-client
```
- The installation will create a nodejs app into: 
  /opt/speaker-client
- A systemd service is created to automatically start the speaker-client upon RPI startup
- Upon script failures, the speaker-client will automatically restart
