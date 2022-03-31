#!/bin/bash

cd /home/ec2-user/node-app || exit
sudo systemctl enable node-app
sudo systemctl start node-app
sudo pm2 restart all --update-env
sudo systemctl restart node-service.service
sudo pm2 start index.js
if [ $? == 0 ]; then echo "Application has started successfully"; else echo "Something went wrong while starting the application"; fi
sudo pm2 status