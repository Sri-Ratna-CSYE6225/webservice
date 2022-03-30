sleep 30
sudo yum update -y
sudo yum install git -y
sudo amazon-linux-extras install epel
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash - 
sudo yum install -y nodejs 
sudo npm install -g pm2
sudo yum install ruby
sudo yum install wget
CODEDEPLOY_BIN="/opt/codedeploy-agent/bin/codedeploy-agent"
$CODEDEPLOY_BIN stop
yum erase codedeploy-agent -y
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent start
sudo service codedeploy-agent status

mkdir /home/ec2-user/node-app
chown ec2-user:ec2-user /home/ec2-user/node-app