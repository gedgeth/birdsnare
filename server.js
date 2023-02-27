const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Define a route handler for the /tweet/:id endpoint
app.get('/tweet/:id', async (req, res) => {
  try {
    // Generate the URL for the tweet based on the ID parameter
    const tweetUrl = `https://twitter.com/user/status/${req.params.id}`;

    // Launch a headless browser instance using Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Open a new page in the browser instance
    const page = await browser.newPage();

    // Navigate to the tweet URL
    await page.goto(tweetUrl, { waitUntil: 'networkidle2' });

    // Get the height of the tweet content
    const tweetContentHeight = await page.$eval('.css-901oao.r-18jsvk2.r-1qd0xha.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0', el => el.offsetHeight);

    // Get the screenshot of the tweet content
    const screenshot = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width: 600,
        height: tweetContentHeight + 40 // Add extra padding to the bottom of the image
      },
      omitBackground: true
    });

    // Close the browser instance
    await browser.close();

    // Set the response headers to specify that the response is an image
    res.set('Content-Type', 'image/png');

    // Send the image data as the response body
    res.send(screenshot);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating the image');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
