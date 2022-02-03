# Weather Status Bot
[![Known Vulnerabilities](https://snyk.io/test/github/adohqsigs/Telegram-Bot/badge.svg?targetFile=package.json)](https://snyk.io/test/github/adohqsigs/Telegram-Bot?targetFile=package.json)

## Introduction

This bot scrapes weather data from a website to format into a message, which is then broadcasted to a dedicated telegram channel. 
The script was written in Nodejs and is run on an AWS EC2 environment.

## Features

- Broadcasts CAT status messages
- Broadcasts PSI reading messages(toggleable with RUN_PSI, see environment vars)

## Environment Variables

These variables are used to give the bot and the scripts information that is private and necessary to instruct the bot on how to behave.

- `BOT_TOKEN` unique token for telegraf api to recognize which bot to use
- `CHANNEL_ID` unique id for bot to access correct channel
- `CAT1_USERNAME` username to access website
- `CAT1_PASSWORD` password to access website
- `WEB_LOGIN_URL` website url
- `WEB_CAT_URL` url for cat status page on website
- `WEB_PSI_URL` url for psi readings page on website
- `RUN_PSI` toggles psi reading messages(yes/no)

## Controlling the bot on the EC2 instance

Begin by ssh-ing into the ec2 instance, which you will need access to the aws account for.

### Starting the bot

Make sure you are in bot directory [`cd Telegram-Bot`], then

```
$ pm2 start index.js
```

### Changing/Adding env vars

```
$ sudo nano ~/.bashrc
```
Crtl-X, Y and Enter to save changes to environment variable file


See [PM2 Docs](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) for more info
