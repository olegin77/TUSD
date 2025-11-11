#!/bin/bash
# Скрипт для настройки зеркал APT (требует sudo)

echo "Backing up original sources.list..."
sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup

echo "Configuring APT mirrors..."
sudo sed -i 's|http://archive.ubuntu.com|http://mirror.yandex.ru|g' /etc/apt/sources.list
sudo sed -i 's|http://security.ubuntu.com|http://mirror.yandex.ru|g' /etc/apt/sources.list

echo "Updating package lists..."
sudo apt update

echo "APT mirrors configured successfully!"
echo "Backup saved at: /etc/apt/sources.list.backup"
