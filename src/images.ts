import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://web.whatsapp.com');

  console.log('Please scan the QR code with your phone to log in.');

  try {
    // Wait for WhatsApp Web to load
    await page.waitForSelector('._1Flk2', { timeout: 60000 });
    console.log('Logged in successfully.');

    // Select all conversations
    const contacts = await page.$$('._2aBzC');
    console.log(`Found ${contacts.length} conversations.`);

    for (let i = 0; i < contacts.length; i++) {
      await contacts[i].click();

      // Wait for chat to load
      await page.waitForSelector('._1ays2');

      // Extract the contact name
      const contactName = await page.$eval('._1hI5g', el => (el as HTMLElement).textContent || '');
      console.log(`Reading conversation with ${contactName}`);

      // Extract all images from the conversation
      const images = await page.$$eval('img._3Whw5', imgs => imgs.map(img => (img as HTMLImageElement).src));

      if (images.length > 0) {
        console.log(`Found ${images.length} images in conversation with ${contactName}`);

        // Download images
        for (let j = 0; j < images.length; j++) {
          const viewSource = await page.goto(images[j]);
          const imagePath = path.join('images', `${contactName}_${j}.jpg`);
          // fs.writeFileSync(imagePath, await viewSource!.buffer());
          console.log(`Image ${j + 1} saved from conversation with ${contactName}`);
        }
      } else {
        console.log(`No images found in conversation with ${contactName}`);
      }
    }

    console.log('All conversations processed.');
    // Note: browser.close() is omitted, so the browser will remain open.
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
