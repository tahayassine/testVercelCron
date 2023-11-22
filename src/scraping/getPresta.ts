import path from 'path';

const prestinfoUrl =
  'https://web.prestinfo.eu/WD120AWP/WD120Awp.exe/CONNECT/Pre_Extranet';

const userName = 'INITIELY001';
const password = 't63ia63GFFUp';
const downloadPath = path.resolve('./download');

let chrome: any = {};
let puppeteer: any;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require('chrome-aws-lambda');
  puppeteer = require('puppeteer-core');
} else {
  puppeteer = require('puppeteer');
}

const getPresta = async () => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch(options);

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto(prestinfoUrl, {
    waitUntil: 'networkidle2',
  });

  // await page.click('.col-md-4 a');
  await page.focus('#A15');
  await page.keyboard.type(userName);
  await page.focus('#A16');
  await page.keyboard.type(password);
  await page.keyboard.press('Enter');
  // waiting new page
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  // await page.waitForNavigation();
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

  // select the first image and click
  // src="/PRE_EXTRANET_WEB/res/ConversionTable.GIF"
  await page.click('img[src="/PRE_EXTRANET_WEB/res/ConversionTable.GIF"]');
  // await page.waitForNavigation();
  // Option1
  await page.click('#Option1');
  // close the browser
  // await browser.close();
};

export default getPresta;
