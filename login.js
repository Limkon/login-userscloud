const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  // 读取 accounts.json 文件中的 JSON 字符串
  const accountsJson = fs.readFileSync('accounts.json', 'utf-8');
  const accounts = JSON.parse(accountsJson);

  for (const account of accounts) {
    const { username, password } = account;

    try {
      // 修改网址为新的登录页面
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto('https://userscloud.com/login.html');

      // 输入实际的账号和密码
      await page.type('input[name="username"]', username);
      await page.type('input[name="password"]', password);

      // 提交登录表单
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000); // 等待1秒

      // 等待登录成功（如果有跳转页面的话）
      await page.waitForNavigation();
      await page.waitForTimeout(10000); // 等待10秒

      // 判断是否登录成功
      const isLoggedIn = await page.evaluate(() => {
        const logoutButton = document.querySelector('#logout');
        return logoutButton !== null;
      });

      if (isLoggedIn) {
        console.log(`账号 ${username} 登录成功！`);
      } else {
        console.error(`账号 ${username} 登录失败，请检查账号和密码是否正确。`);
      }
    } catch (error) {
      console.error(`账号 ${username} 登录时出现错误: ${error}`);
    } finally {
      // 关闭页面和浏览器
      await page.close();
      await browser.close();

      // 用户之间添加随机延时
      const delay = Math.floor(Math.random() * 10000) + 5000; // 随机延时5秒到15秒之间
      await delayTime(delay);
    }
  }

  console.log('所有账号登录完成！');
})();

// 自定义延时函数
function delayTime(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
