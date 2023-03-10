
# Abrnoc Subscription Task

Financial management project for user subscriptions


## Installation

1 - First you should run MongoDB database on port 27017      
Open this link and follow the guide: https://www.mongodb.com/docs/manual/administration/install-community/    

You can also use official docker image of mongo:

```bash
  docker pull mongo
  docker run -d -p27017:27017 mongo
```
2 - Now if you sure mongodb is running on port 27017 clone this repository and execute below commands:
```bash
  git clone https://github.com/soroush-habibi/abrnoc-subscription-task.git
  cd abrnoc-subscription-task
  npm i
```
Make sure your VPN is active      

3 - If your port 3000 is free run below command:
```bash
  npm start
```

If port 3000 is busy then go to .env file and change port number and retry step 3      

4 - If you see "App is running on port 3000" in terminal that means everything is fine.now open below link in your browser:   
[http://127.0.0.1:3000](http://127.0.0.1:3000)
## Demo

![Screenshot from 2023-03-10 17-46-21.png](https://github.com/soroush-habibi/abrnoc-subscription-task/blob/master/demo/Screenshot%20from%202023-03-10%2017-46-21.png)
