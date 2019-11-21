Installation on RPI
===

# Prerequisites
- A RPI running Raspbian
  - Tested on RPI3 and RPI Zero Wireless running Raspbian Buster Lite
- Internet access from the RPI
- Raspicam and a microphone attached (tested with IR raspicam + a USB mini microphone)
- git configured to clone repositories from github

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
- First time you run the script, answer "y" for gstreamer and RaspiWiFi
- Type the domain name of the server where you have installed the Janus WebRTC server
- Type the video and audio port numbers that your Janus server is configured to listen to
  - These ports must match the corresponding values found on your server in
    /opt/janus/etc/janus/janus.plugin.streaming.jcfg
  - Each RPI device should have their own configuration block in this file, with own video/audio ports
- The rest of the installation prompts are dealing with video, type enter for default values
- Installation of RaspiWiFi starts another installation script
  - Check for further information here: https://github.com/jasbur/RaspiWiFi

# Running
```console
sudo systemctl start janus-stream
```
- The installation will create a shell script: /opt/janus-stream/janus-stream.sh
- A systemd service is created to automatically start the janus-stream.sh upon RPI startup
- Upon script failure, the janus-stream.sh will automatically restart
- If the RPI cannot access the internet at all, it will restart in host mode, and you can configure the WiFi network/password headlessly. Refer to https://github.com/jasbur/RaspiWiFi
