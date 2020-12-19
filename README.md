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

Make sure you are in bot directory [`~/Telegram-Bot`], then

```
$ sudo passenger start
```

### Changing/Adding env vars

Make sure you are in the root directory, then
```
$ nano .bashrc
```
Scroll to the bottom with Alt + /, and change/add your env vars.
After changing the env vars, you need to restart the bot.

To do `restart-app`...
```
$ sudo -E -u appuser -H bash -l
$ passenger-config restart-app
```
then `$ exit` to return to ubuntu admin

See [Phusion Passenger Docs](https://www.phusionpassenger.com/library/) for more info
