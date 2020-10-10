// const { Telegraf } = require('telegraf');
const { Composer } = require('micro-bot');
const bot = new Composer;
const Telegram = require('telegraf/telegram')
const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000
const telegram = new Telegram(process.env.BOT_TOKEN);
// const bot = new Telegraf('1364016845:AAEIYZHp7SD8A2BvDHl5m3r8G-I_QPqtBDA');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hello');
})

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  telegram.sendMessage(process.env.CHANNEL_ID, req.body.Body)

  res.send('message received')
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(3000, () => {
  console.log('Express server listening on port 3000');
});




module.exports = bot;
// bot.launch();
