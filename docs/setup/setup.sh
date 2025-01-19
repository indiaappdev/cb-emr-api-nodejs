#!/bin/bash

# Function to install Docker on Ubuntu
install_docker_ubuntu() {
  echo "Updating system repositories..."
  sudo apt update && sudo apt upgrade -y

  echo "Installing required dependencies..."
  sudo apt install lsb-release ca-certificates apt-transport-https software-properties-common -y

  echo "Adding Docker repository to system sources..."
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  echo "Updating system packages..."
  sudo apt update

  echo "Installing Docker..."
  sudo apt install docker-ce -y

  echo "Verifying Docker installation..."
  sudo systemctl status docker
}

# Function to install Docker Compose on Ubuntu
install_docker_compose_ubuntu() {
  echo "Creating Docker CLI plugins directory..."
  mkdir -p ~/.docker/cli-plugins/

  echo "Downloading Docker Compose..."
  curl -SL https://github.com/docker/compose/releases/download/v2.10.2/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose

  echo "Setting executable permissions..."
  chmod +x ~/.docker/cli-plugins/docker-compose

  echo "Verifying Docker Compose installation..."
  docker compose version
}

# Function to install Postman on Ubuntu
install_postman_ubuntu() {
  echo "Installing Postman via snap..."
  sudo snap install postman
}

# Function to install Node.js and npm on Ubuntu
install_nodejs_ubuntu() {
  echo "Updating system..."
  sudo apt update

  echo "Installing Node.js and npm..."
  sudo apt install nodejs npm -y

  echo "Verifying Node.js installation..."
  node -v
}

# Function to install Standard JS
install_standard_js() {
  echo "Installing Standard JS..."
  npm install standard
  echo "To run Standard JS, use: npx standard --fix <file path>"
}

# Function to install Prettier
install_prettier() {
  echo "Installing Prettier..."
  npm install prettier
  echo "To run Prettier, use: npx prettier --write <file path>"
}

# Main Menu
while true; do
  echo "\nSelect an option to install:" 
  echo "1. Docker (Ubuntu)"
  echo "2. Docker Compose (Ubuntu)"
  echo "3. Postman (Ubuntu)"
  echo "4. Node.js and npm (Ubuntu)"
  echo "5. Standard JS"
  echo "6. Prettier"
  echo "7. Exit"
  read -p "Enter your choice: " choice

  case $choice in
    1)
      sudo apt install curl
      install_docker_ubuntu
      ;;
    2)
      sudo apt install curl
      install_docker_compose_ubuntu
      ;;
    3)
      install_postman_ubuntu
      ;;
    4)
      install_nodejs_ubuntu
      ;;
    5)
      install_standard_js
      ;;
    6)
      install_prettier
      ;;
    7)
      echo "Exiting..."
      break
      ;;
    *)
      echo "Invalid choice, please try again."
      ;;
  esac
done
