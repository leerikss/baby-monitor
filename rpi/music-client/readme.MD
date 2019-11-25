Installation on RPI
===

The music-client will install a nodejs app, that listens for WebSocket commands to play mp3 files to the speaker. In addition, a systemd service will be created for starting/stopping the music-client nodejs app.
NOTE: You will have to add your own mp3 files locally into folder /opt/music-client/songs.

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
cd baby-monitor/rpi/music-client
./install.sh
```
- First time you run the script, type y to install required nodejs/npm dependencies
- Type the domain name of the server where the websocket-proxy is installed
- The WebSocket Proxy URL is ok by default, if your server NGINX is configured to proxy pass the wss://[domain]/music location to the corresponding server nodejs websocket proxy app
- Authentication token needs to match your server configured websocket proxy token

# Starting/stopping
```console
sudo systemctl start music-client
sudo systemctl stop music-client
```
- The installation will create a nodejs app into: 
  /opt/music-client
- A systemd service is created to automatically start the music-client upon RPI startup
- Upon script failures, the music-client will automatically restart
- Add mp3 files of your liking into /opt/music-client/songs
