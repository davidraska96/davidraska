const puppeteer = require('puppeteer-core');
const chrome = require('chrome-aws-lambda'); // Knihovna pro běh Puppeteer v serverless prostředí

async function scrapeGoogle(query) {
    const browser = await puppeteer.launch({
        executablePath: await chrome.executablePath,
        headless: true,
        args: chrome.args,
        defaultViewport: chrome.defaultViewport
    });

    const page = await browser.newPage();
    await page.goto('https://www.google.com/');
    await page.type('input[name="q"]', query);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.g');

    const results = await page.evaluate(() => {
        const items = document.querySelectorAll('.g');
        const resultsArray = [];
        items.forEach(item => {
            const title = item.querySelector('h3') ? item.querySelector('h3').innerText : null;
            const url = item.querySelector('a') ? item.querySelector('a').href : null;
            if (title && url) {
                resultsArray.push({ title, url });
            }
        });
        return resultsArray;
    });

    await browser.close();
    return results;
}

// Serverless funkce pro scraping
module.exports = async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).send('Missing query parameter');
    }

    try {
        const results = await scrapeGoogle(query);
        res.json(results);
    } catch (err) {
        res.status(500).send('Error while scraping Google');
    }
};
