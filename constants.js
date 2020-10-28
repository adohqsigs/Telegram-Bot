const DOTENV = require('dotenv');
DOTENV.config();
module.exports = {
    username: process.env.CAT1_USERNAME,
    password: process.env.CAT1_PASSWORD,
    login_url: process.env.WEB_LOGIN_URL,
    cat_url: process.env.WEB_CAT_URL,
    psi_url: process.env.WEB_PSI_URL
  }
