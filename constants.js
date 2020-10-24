const DOTENV = require('dotenv');
DOTENV.config();
module.exports = {
    username: process.env.CAT1_USERNAME,
    password: process.env.CAT1_PASSWORD,
    login_url: process.env.WEB_LOGIN_URL,
    scrap_url: process.env.WEB_SCRAP_URL
  }