const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Chybí klíčové slovo!' });
    }

    try {
        const results = await scrapeGoogle(query);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error scraping Google:', error);
        res.status(500).json({ error: 'Chyba při získávání výsledků.' });
    }
};

async function scrapeGoogle(query) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Přejdeme na Google a provedeme vyhledávání
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

    // Scraping výsledků
    const results = await page.evaluate(() => {
        const items = [];
        const elements = document.querySelectorAll('h3');
        elements.forEach((element) => {
            const title = element.innerText;
            const url = element.parentElement.href;
            if (title && url) {
                items.push({ title, url });
            }
        });
        return items;
    });

    await browser.close();
    return results;
}
