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
- The script will prompt for various parameters you need to know to get the system up and running
- 
