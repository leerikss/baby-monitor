Install RPI
===========

Laptop:
-------
- Download & dd image to Micro SD card
lsblk
- Check where sd card is mounted. Below it's /dev/sda
sudo umount /dev/sda1
sudo umount /dev/sda2
sudo dd bs=4M if=2019-07-10-raspbian-buster-lite.img of=/dev/sda conv=fsync

sudo emacs /media/leerikss/boot/wpa_supplicant.conf

country=FI
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="DNA-WLAN-2G-BD10"
    psk="24956486492"
}
network={
    ssid="DNA-WLAN-5G-BD10"
    psk="24956486492"
}
network={
    ssid="Lefa Phone"
    psk="lefa1974"
}

sudo touch /media/leerikss/boot/ssh

RPI
---
- nmap -sn 192.168.1.0/24 - find RPI IP
- ssh pi@raspberrypi.local
  - password: raspberry

passwd pi
- Set new password

sudo pico /etc/hostname
- Change it ex. rpi3

sudo pico /etc/hosts
127.0.0.1	rpi3

sudo apt update
sudo apt upgrade

sudo raspi-config
  - Localisation options
    - Change Locale => Add fi_FI.UTF-8, Default = en_GB.UTF-8
    - Change timezone >= Europe Helsinki
  - Interfacing options - P1 Camera - Enable
  - Advanced options > Memory Split > RPI3: GPU mem to 256 Gb, RPI Zero W 128 Gb?

# Change keyboard layout
sudo pico /etc/default/keyboard
XKBLAYOUT="fi"

# Update RPI firmware
sudo apt-get install rpi-update
sudo rpi-update

sudo reboot

# Turn off wlan power save
sudo iw dev wlan0 set power_save off
sudo pico /etc/network/interfaces
wireless-power off

- Additional software:
sudo apt install emacs-nox git tmux

mkdir -p /home/pi/.ssh
Laptop: scp ~/.ssh/id_rsa* pi@rpi3.local:/home/pi/.ssh

git config --global user.email "leerikss@gmail.com"
git config --global user.name "Leif Eriksson"
mkdir git && cd git
git clone git@leif.fi:/var/git/dotfiles.git
cp dotfiles/.* ~/

emacs
- Alt-x package-install
  - powerline
  - zenburn-theme

sudo reboot

Increase microphone sensitivity
===============================
alsamixer
- F6 - choose USB
- F4 - set to max

gstreamer + gst-rpicamsrc
=========================
sudo apt-get install gstreamer1.0-tools gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-plugins-bad libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev gstreamer1.0-alsa

git clone https://github.com/thaytan/gst-rpicamsrc /tmp/gst-rpicamsrc

cd /tmp/gst-rpicamsrc

./autogen.sh --prefix=/usr --libdir=/usr/lib/arm-linux-gnueabihf/

make && sudo make install

RaspiWiFi
=========
cd ~/git
git clone https://github.com/jasbur/RaspiWiFi.git
cd RaspiWiFi
sudo python3 initial_setup.py
