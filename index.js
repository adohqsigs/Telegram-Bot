// const { Telegraf } = require('telegraf');
const { Composer } = require('micro-bot');
const bot = new Composer;
const Telegram = require('telegraf/telegram');
const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const bodyParser = require('body-parser');


const telegram = new Telegram(process.env.BOT_TOKEN);
// const bot = new Telegraf(process.env.BOT_TOKEN);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/sms', (req, res) => {
  console.log(`${req.body.From} sent an sms to the bot`);
  const twiml = new MessagingResponse();


  telegram
    .sendMessage(process.env.CHANNEL_ID, req.body.Body)
    .then(() => twiml.message('sms has been forwarded'))
    .catch((err) => {
        console.log(err);
        twiml.message(err.message);
    });


  console.log(twiml.toString());
  res.writeHead(200, {'Content-Type': 'text/xml', });
  res.end(twiml.toString());

});

const port = process.env.PORT || 3000
http.createServer(app).listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});



module.exports = bot;
// bot.launch();
