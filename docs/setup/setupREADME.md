# **Readme for System Setup**
---
## **Summary**

This setup guide provides step-by-step instructions for installing Docker, Docker Compose, Postman, Node.js, Standard JS, and Prettier on Ubuntu 22.04 and Windows (where applicable). Follow the commands carefully to ensure a successful setup.

## **Index**
1. [Docker Installation](#1-docker-installation)
2. [Docker Compose Installation](#2-docker-compose-installation)
3. [Node.Js Installation](#3-nodejs-installation)
4. [Standard JS](#4-standard-js)
5. [Prettier](#5-prettier)

---

# **1. Docker Installation :**
---
## **A. How To Install Docker 20.10 on Ubuntu 22.04:**
### **Step 1: Update system repositories**
First of all, open up the terminal by hitting “CTRL+ALT+T” in Ubuntu 22.04 and write out the below-given commands for updating the system repositories:
```
sudo apt update
sudo apt upgrade
```
### **Step 2: Install required dependencies**
After updating the system packages, the next step is to install required dependencies for Docker:
```
sudo apt install lsb-release ca-certificates apt-transport-https software-properties-common -y
```
### **Step 3: Adding Docker repository to system sources**
When a Docker repository is added to the system sources, it makes the Docker installation easier and provides faster updates.

To add the Docker repository to the system sources, firstly, import the Docker GPG key required for connecting to the Docker repository:
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```
After doing so, execute the following command for adding the Docker repository to your Ubuntu 22.04 system sources list:
```
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list /dev/null
```
### **Step 4: Update system packages**
After adding Docker repository to the system sources, again update the system packages:
```
sudo apt update
```
### **Step 5: Install Docker on Ubuntu 22.04**
At this point, our Ubuntu 22.04 system is all ready for the Docker installation:
```
sudo apt install docker-ce
```
Note that we are utilizing the “docker-ce” package instead of “docker-ie” as it is supported by the official Docker repository:

Enter “y” to permit the Docker installation to continue:
### **Step 6: Verify Docker status**
Now, execute the below-given “systemctl” command to verify if the Docker is currently active or not on your system:
```
sudo systemctl status docker
```

## **B. How To Install Docker 20.10 on Windows:**
To download and install the Docker 20.10 [Click here](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe).

 Docker Compose will be installed along with the Docker desktop application.

---

# **2. Docker Compose Installation**
---
## **A. How To Install Docker Compose 2.10.2 on Ubuntu 22.04:**
Note: If its not installed along with Dockr then you need to follow the steps bellow. You can check using following command:
```
docker compose version
or
docker-compose version
```
### **Step 1: Download Docker Compose package**
First of all, verify the latest version of the Docker Compose package from the release page. For example, at this moment, the most stable version of Docker Compose is “2.10.2”. 

So, we will create a directory with the help of the following “mkdir” command:
```
mkdir -p ~/.docker/cli-plugins/
```
After doing so, utilize the below-given “curl” command for installing Docker Compose on Ubuntu 22.04:
```
curl -SL https://github.com/docker/compose/releases/download/v2.10.2/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
```
### **Step 2: Docker Compose Installation**
In the next step, set the executable permissions to the “docker-compose” command:
```
chmod +x ~/.docker/cli-plugins/docker-compose
```
### **Step 3: Verify Docker Compose Installation**
In this step, execute the following command on your terminal to verify Docker Compose 2.10.2 installation on ubuntu 22.04:
```
docker compose version
```

---

# **3. Node.Js Installation**
---
## **A. How To Install Node.Js on Ubuntu 22.04:**
### **Step 1 – Open Terminal OR Command Prompt**
First of all, open your terminal or command prompt by pressing Ctrl+Alt+T key.
### **Step 2 – Update the Ubuntu system**
Node.js and npm are available in the default Ubuntu repositories. As such you can easily install them using the APT package Manager. First, update the ubuntu system:
```
sudo apt update
```
### **Step 3 – Install Node.js and NPM**
Install Node.js and NPM via apt as follows:
```
sudo apt install nodejs npm
```
### **Step 4: Verify Node.Js Installation**
In this step, execute the following command on your terminal to verify Node.Js installation on ubuntu 22.04:
```
node -v
```

---

# **4. Standard JS**
Standard JS code analyzer for Javascript.
Standard JS analyses your Javascript code without actually running it. It checks for errors, enforces a coding standard, looks for code smells, and can make suggestions about how the code could be refactored. 

```commandline 
npm install standard
```
To use Standard run the following code snippet:
```commandline 
npx standard --fix <file path>
```

---

# **5. Prettier**
Prettier is the Javascript code formatter.

```commandline 
npm install prettier
```
To use Prettier, run the following code snippet:
```commandline 
npx prettier --write <file path>
```

