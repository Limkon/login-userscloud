const fs = require('fs');
const puppeteer = require('puppeteer');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const accountsJson = fs.readFileSync('accounts.json', 'utf-8');
  const accounts = JSON.parse(accountsJson);

  for (const account of accounts) {
    const { username, password } = account;

    try {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto('https://userscloud.com/login.html');

      // Wait for the page to fully load
      await page.waitForLoad();

      // Type in the username and password
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', password);

      // Wait for 1 second to simulate human-like typing
      await delay(1000);

      // Click the login button
      await page.click('button[type="submit"]');

      // Wait for the page to navigate to the home page
      await page.waitForNavigation();

      // Check if the login was successful
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
      // Random delay between login attempts to avoid triggering anti-bot mechanisms
      const randomDelay = Math.floor(Math.random() * 5000) + 1000;
      await delay(randomDelay);

      // Close the browser
      await browser.close();
    }
  }

  console.log('All accounts logged in.');
})();
