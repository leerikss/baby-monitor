Installation on RPI
===

The janus-stream will generate a shell script that will stream video/audio to your Janus WebRTC server using gstreamer. A janus-stream systemd service will also be created.

# Prerequisites
- A RPI running Raspbian
  - Tested on RPI3 and RPI Zero Wireless, running Raspbian Buster Lite
- RPI configured with a working Internet connection
- A Raspicam and a microphone attached to your RPI
  - Tested with an infrared raspicam and a USB mini microphone
- git configured to clone this repository from github

## raspi-config
sudo raspi-config
1) Interfacing options - P1 Camera - Enable
2) Advanced options > Memory Split > 
   - RPI3: GPU mem set to 256 Gb
   - RPI Zero W: GPU mem set to 128 Gb

## Update RPI firmware
```console
sudo apt-get install rpi-update
sudo rpi-update
sudo reboot
```

## Turn off wlan power save
```console
sudo iw dev wlan0 set power_save off
sudo pico /etc/network/interfaces
# Add following line:
wireless-power off
```

## Increase microphone sensitivity
```console
alsamixer
```
- F6 - choose USB
- F4 - set to max

# Installation
```console
git clone git@github.com:leerikss/baby-monitor.git .
cd rpi/janus-stream
./install.sh
```
- The installaction script will prompt for various parameters you need to know
- First time you run this script, make sure you will install *gstreamer* and *RaspiWiFi*
- Type the domain name of the server where you have installed your Janus WebRTC server
- Type the video and audio port numbers that your Janus server is configured to listen to
  - These ports must match the corresponding values found on your server in:
    /opt/janus/etc/janus/janus.plugin.streaming.jcfg
  - Each RPI device should have their own configuration block in this file with their own video/audio ports
- The rest of the installation prompts are dealing with the video. Type enter for default values
- Installation of RaspiWiFi starts another installation script
  - Check for further information here: https://github.com/jasbur/RaspiWiFi

# Running/stopping
```console
sudo systemctl start janus-stream
sudo systemctl stop janus-stream
```
- The installation will create a shell script
  /opt/janus-stream/janus-stream.sh
- A systemd service is created to automatically start the janus-stream.sh upon RPI startup
- Upon script failures, the janus-stream.sh will automatically restart
- If the RPI cannot access the internet at all, it will restart in Host mode, and you can configure the WiFi network/password headlessly. Refer to https://github.com/jasbur/RaspiWiFi
