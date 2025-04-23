// puppeteer-server.js
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/scrape-and-highlight', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // ✅ Spoof a real browser
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // ✅ Inject JS to draw bounding boxes and make divs interactive
    // await page.evaluate(() => {
    //   const divs = document.querySelectorAll('div');

    //   divs.forEach(div => {
    //     const rect = div.getBoundingClientRect();
    //     const overlay = document.createElement('div');

    //     // Style bounding box
    //     Object.assign(overlay.style, {
    //       position: 'absolute',
    //       top: `${rect.top + window.scrollY}px`,
    //       left: `${rect.left + window.scrollX}px`,
    //       width: `${rect.width}px`,
    //       height: `${rect.height}px`,
    //       border: '1px dashed red',
    //       zIndex: 9999,
    //       pointerEvents: 'none',
    //     });

    //     const button = document.createElement('button');
    //     button.textContent = '+';
    //     Object.assign(button.style, {
    //       position: 'absolute',
    //       top: '5px',
    //       left: '5px',
    //       backgroundColor: 'black',
    //       color: 'white',
    //       padding: '4px 8px',
    //       border: 'none',
    //       cursor: 'pointer',
    //       zIndex: 10000,
    //       pointerEvents: 'auto',
    //     });

    //     button.addEventListener('click', () => {
    //       alert('Div text: ' + div.textContent?.trim().slice(0, 100));
    //     });

    //     overlay.appendChild(button);
    //     document.body.appendChild(overlay);
    //   });
    // });

    // ✅ Return the fully rendered page as HTML
    const content = await page.content();
    await browser.close();

    res.send(content);
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send('Error rendering site');
  }
});

app.listen(3002, () => {
  console.log('🚀 Puppeteer server running at http://localhost:3002');
});
