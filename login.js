const fs = require('fs');
const puppeteer = require('puppeteer');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  try {
    const accountsJson = fs.readFileSync('accounts.json', 'utf-8');
    const accounts = JSON.parse(accountsJson);

    for (const account of accounts) {
      const { username, password } = account;
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();

      try {
        await page.goto('https://userscloud.com/login.html');
        await page.waitForSelector('input[name="login"]');
        await page.type('input[name="login"]', username);
        await page.type('input[name="password"]', password);
        await page.click('button[type="submit"]');
        
        // Add a short delay to ensure the page navigation
        await page.waitForNavigation();
        
        const isLoggedIn = await page.evaluate(() => {
          const logoutButton = document.querySelector('#logout');
          return logoutButton !== null;
        });

        if (isLoggedIn) {
          console.log(`Account ${username} logged in successfully!`);
        } else {
          console.error(`Account ${username} login failed, please check your credentials.`);
        }
      } catch (error) {
        console.error(`Error logging in account ${username}: ${error}`);
      } finally {
        await browser.close();
        const randomDelay = Math.floor(Math.random() * 5000) + 1000;
        await delay(randomDelay);
      }
    }

    console.log('All accounts logged in.');
  } catch (error) {
    console.error('Global error:', error);
  }
})();
