const { Telegraf } = require('telegraf');
// const { Composer } = require('micro-bot');
// const bot = new Composer;
const Telegram = require('telegraf/telegram');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const app = express();

const telegram = new Telegram(process.env.BOT_TOKEN);
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.telegram.setWebhook(`${process.env.BOT_DOMAIN}/bot${process.env.BOT_TOKEN}`) // comment this out when hosting on local machine
app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/sms', (req, res) => {
  // if (req.body.From !== process.env.SOURCE_NO) return res.status(401).send(`User ${req.body.From} not authorised to send messages`);
  console.log(`${req.body.From} sent an sms to the bot`);
  const twiml = new MessagingResponse();


  telegram
    .sendMessage(process.env.CHANNEL_ID, req.body.Body)
    .catch((err) => console.log(err));


  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());

});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express server listening on port ${port}`));



// module.exports = bot;
bot.launch();
