const { Telegraf } = require('telegraf');
const Telegram = require('telegraf/telegram');
const express = require('express');
const scraper = require('./scraper');
const bodyParser = require('body-parser');
const app = express();

const telegram = new Telegram(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
var twoHoursOver = false;
var fiveMinCounter = 0;
var prevMessage = '';



setInterval(async () => {
  let message = await scraper.scrapWeb(process.env.WEB_LOGIN_URL);

  if (twoHoursOver || message !== prevMessage) {
    twoHoursOver = false;
    telegram
      .sendMessage(process.env.CHANNEL_ID, message) // req.body.Body
      .then(() => console.log('message was sent'))
      .catch((err) => console.log(err));

    prevMessage = message;
  };


  if (fiveMinCounter > 23) {
    twoHoursOver = true;
    fiveMinCounter = 0;
  } else {
    fiveMinCounter++;
  };
  console.log(fiveMinCounter);
}, 300000);
