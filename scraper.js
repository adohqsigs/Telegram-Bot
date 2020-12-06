const puppeteer = require('puppeteer'); // main library for web scrapping
const C = require('./constants'); //contains all the environmental variables

//CSS SELECTOR for username, password textbox and login button on targeted website
const USERNAME_SELECTOR = '#user_login';
const PASSWORD_SELECTOR = '#pwd';
const CTA_SELECTOR = '#wp-submit';




async function startBrowser() {
    const browser = await puppeteer.launch({ slowMo: 30, args: ['--no-sandbox']}); //slowmo 30ms to ensure credentials are entered in a timely manner , args: ['--no-sandbox']
    const page = await browser.newPage();
    return { browser, page };
}


// core function to scrap CAT 1 details
async function scrapCAT(url) {
    let cat_status = `[CAT Status Update] ⚡\n`

    const { browser, page } = await startBrowser();
    page.setViewport({ width: 1366, height: 1020 });

    // perform series of automation for login
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(C.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(C.password);
    await page.click(CTA_SELECTOR);

    // go to CAT 1 related URL upon logging in successfully
    // networkidle0: consider navigation to be finished when there are no more than 0 network connections for at least 500 ms. Solves reading cells of undefined
    await page.goto(C.cat_url, { waitUntil: 'networkidle2', timeout: 0  });

    // Get the cat 1 table results
    let [sector, CAT, validity] = await page.evaluate(() => {

        var nodes = document.querySelectorAll('tr');
        // nodes as of now, first sector is index [4], last sector is index [35]
        var list = [];
        // add all sectors into list, from index 4 aka first sector to index 35 aka last sector
        for (var i = 4; i <= 35; i++) {
            list.push(nodes[i]);
        };
        //if website loads too slow, might get cells of undefined error
        if (list[0] && list.length == 32) { //total 32 sectors, only if list is exact 32 items
            return [
                list.map(s => s.cells[0].innerHTML), // sector
                list.map(s => s.cells[1].innerHTML), // CAT status
                list.map(s => s.cells[2].innerHTML)  // validity
            ];
        };

    });

    // ends the scrapping session
    await browser.close();

    if (!sector || !CAT || !validity) {
        // items in sector or CAT or validity are undefined
        throw new Error('website not loaded properly');
    }
    else {
        // display all sector clear if all sector's CAT status is 0
        if (!CAT.includes('1')) {
            cat_status += `All Sectors Clear (${validity[0]})`;
        }
        else // show which sector is CAT 1
        {
            let catGrouping = {};

            cat_status += `CAT 1:\n`;

            // grouping validity period with sectors
            for (var i = 0; i < CAT.length; i++) {
                if (CAT[i] == 1) {
                    if (validity[i] in catGrouping) {
                        catGrouping[validity[i]] += sector[i] + ',';

                    } else {
                        catGrouping[validity[i]] = sector[i] + ',';

                    };
                };
            };

            for (let key in catGrouping) {
                cat_status += `(${key})\n${catGrouping[key].slice(0, -1)}\n\n`;
            };
        };
    };


    return cat_status;


};

async function scrapPSI(url) {
    let psi_reading = '[PSI Reading Update] 🌫\n';

    const { browser, page } = await startBrowser();
    page.setViewport({ width: 1366, height: 1020 });

    // perform series of automation for login
    await page.goto(url, { waitUntil: 'load', timeout: 0 });
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(C.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(C.password);
    await page.click(CTA_SELECTOR);

    await page.goto(C.psi_url, { waitUntil: 'networkidle2', timeout: 0 });

    let tds = [];
    while (!tds[0]) {
        tds = await page.evaluate(() => {
            let tds = Array.from(document.querySelectorAll('td'))
            return tds.map(td => td.innerText);
        });
    };

    await browser.close();

    let psi = [];
    let prevTd = '';

    for (let td of tds) {
        if (td === '-' && prevTd !== '-') psi.push(prevTd);
        prevTd = td;
    };

    //11am case
    let elevenamIndex = 12;
    if (psi[0] === 'North') {
        psi = [];
        for (let i = 0; i <= 5; i++) {
            psi.push(tds[elevenamIndex + i * 13]);
        }
    }

    // 11pm case
    let elevenpmIndex = 90;
    if (!psi.length) {
        for (let i = 0; i <= 5; i++) {
            psi.push(tds[elevenpmIndex + i * 13]);
        }
    };

    psi_reading += `North: ${psi[0]}\n`;
    psi_reading += `South: ${psi[1]}\n`;
    psi_reading += `East: ${psi[2]}\n`;
    psi_reading += `West: ${psi[3]}\n`;
    psi_reading += `Central: ${psi[4]}\n`;
    psi_reading += `Overall: ${psi[5]}\n`;


    return psi_reading

};


exports.scrapCAT = scrapCAT;
exports.scrapPSI = scrapPSI;
