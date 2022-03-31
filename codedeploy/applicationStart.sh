# cd /home/ec2-user/node-app
# pwd
# ls
# pm2 stop all
# pm2 start index.js
# sudo pm2 startup systemd
# sudo pm2 save
# sudo ln -s /home/ec2-user/node-app/node-service.service /etc/systemd/system/node-service.service
# sudo systemctl daemon-reload
# sudo systemctl restart node-service.service

#!/bin/bash

cd /home/ec2-user/node-app || exit

sudo systemctl enable node-app

sudo systemctl start node-app

sudo pm2 restart all --update-env

sudo pm2 start index.js

if [ $? == 0 ]; then echo "Application has started successfully"; else echo "Something went wrong while starting the application"; fi

sudo pm2 status