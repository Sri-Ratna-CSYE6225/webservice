sleep 30

# sudo yum -y update
# sudo yum -y install git
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash -y
# . ~/.nvm/nvm.sh
# nvm install node -y
# git clone git://github.com/joyent/node.git ~/node
# curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
# sudo yum -y install nodejs
# sudo yum -y update
# locate apt-get


sudo yum update -y
sudo yum install git make gcc -y
# curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
# source ~/.bashrc
# nvm install 14
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash -y
# . ~/.nvm/nvm.sh
# nvm install node -y
# git clone git://github.com/joyent/node.git ~/node
# curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
# git clone git://github.com/joyent/node.git ~/node
#         cd ~/node
#         git checkout v0.10.37
#         ./configure
#         make
#         sudo make install
#         node -v
#         git clone https://github.com/npm/npm.git ~/npm
#         cd ~/npm
#         git checkout v2.7.1
#         sudo make install
#         npm -v
#         sudo npm install -g pm2 gulp nodemon forever bower n 
sudo amazon-linux-extras install epel
# sudo yum install nodejs -y
# npm install -g npm@latest
# sudo chmod -R 777 /usr/local/lib
# sudo npm install -g pm2

sudo yum -y install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm
sudo yum -y install mysql-community-server
sudo systemctl enable --now mysqld
systemctl status mysqld
mysqld -u root --password=password
mkdir /home/ec2-user/node-app
chown ec2-user:ec2-user /home/ec2-user/node-app