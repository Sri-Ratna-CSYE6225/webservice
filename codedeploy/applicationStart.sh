cd /home/ec2-user/node-app
pwd
ls
pm2 stop all
pm2 start index.js
sudo pm2 startup systemd
sudo pm2 save
sudo ln -s /home/ec2-user/node-app/node-service.service /etc/systemd/system/node-service.service
sudo systemctl daemon-reload
sudo systemctl restart node-service.service