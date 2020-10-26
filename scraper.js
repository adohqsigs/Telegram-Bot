const puppeteer = require('puppeteer'); // main library for web scrapping
const C = require('./constants'); //contains all the environmental variables

//CSS SELECTOR for username, password textbox and login button on targeted website
const USERNAME_SELECTOR = '#user_login';
const PASSWORD_SELECTOR = '#pwd';
const CTA_SELECTOR = '#wp-submit';
let message = '';


async function startBrowser() {
    const browser = await puppeteer.launch({ slowMo: 30 , args: ['--no-sandbox'] }); //slowmo 30ms to ensure credentials are entered in a timely manner
    const page = await browser.newPage();
    return { browser, page };
}

async function closeBrowser(browser) {
    return browser.close();
}

// core function to scrap CAT 1 details
async function scrapWeb(url) {
    const { browser, page } = await startBrowser();
    page.setViewport({ width: 1366, height: 1020 });

    // perform series of automation for login
    await page.goto(url);
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(C.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(C.password);
    await page.click(CTA_SELECTOR);



    // snap a screenshot of the CAT 1 overview
    //await page.screenshot({ path: 'weather.png' });


    // go to CAT 1 related URL upon logging in successfully
    // networkidle0: consider navigation to be finished when there are no more than 0 network connections for at least 500 ms. Solves reading cells of undefined
    await page.goto(C.scrap_url, { waitUntil: 'networkidle0' });


    // Get the cat 1 table results
    let [sector, CAT, validity] = await page.evaluate(() => {

        var nodes = document.querySelectorAll('tr');
        // nodes as of now, first sector is index [4], last sector is index [35]
        var list = [];
        var i;
        // add all sectors into list, from index 4 aka first sector to index 35 aka last sector
        for (i = 4; i <= 35; i++) {
            list.push(nodes[i]);
        }
        //if website loads too slow, might get cells of undefined error
        if (list.length == 32) { //total 32 sectors, only if list is exact 32 items
            return [
                list.map(s => s.cells[0].innerHTML), // sector
                list.map(s => s.cells[1].innerHTML), // CAT status
                list.map(s => s.cells[2].innerHTML)  // validity
            ];
        }


    });
    if (!sector || !CAT || !validity) {
        // sector or CAT or validity is undefined
        console.log("Not working");
    }
    else {
        // console.log('Sector:', sector);
        // console.log('CAT: ', CAT);
        // console.log('validity: ', validity);

        // display all sector clear if all sector's CAT status is 0
        if (!CAT.includes('1')) {
            message = `All Sector Clears: ${validity[0]}`;
        }
        else // show which sector is CAT 1
        {
            message = `CAT 1 (${validity[0]})\n`;
            message += `Sector: `;

            for (var i = 0; i < CAT.length; i++) {
                if (CAT[i] == 1) {
                    console.log(sector[i]);
                    message += `${sector[i]}`
                }
            }

        }
    }

    // ends the scrapping session
    await closeBrowser(browser);
    return message;



    //await browser.waitForTarget(()=> false);
}

// (async () => {
//     // start scraping by logging in
//     // TODO:
//     // 1. retry scrapping web if login fails, happened before but rare.
//     await scrapWeb(C.login_url);
//     process.exit(1);
// })();

exports.scrapWeb = scrapWeb;
