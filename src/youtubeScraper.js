const puppeteer = require('puppeteer');

let browser, page;
(async () => {
	browser = await puppeteer.launch({ args: [
		'--no-sandbox', 
		'--disable-setuid-sandbox',
		'--disable-canvas-aa', 
		'--disable-2d-canvas-clip-aa', 
		'--disable-gl-drawing-for-tests', 
		'--disable-dev-shm-usage', 
		'--no-zygote', 
		'--use-gl=swiftshader',
		'--enable-webgl',
		'--hide-scrollbars',
		'--mute-audio',
		'--no-first-run',
		'--disable-infobars',
		'--disable-breakpad',
	] });
	page = await browser.newPage();
})();

module.exports = {
	getSong,
};

async function getSong(query) {
	await page.goto(`https://www.youtube.com/results?search_query=${query}`);
	await page.waitForSelector('#thumbnail');
	const video = await page.evaluate(() => {
		const title = document.querySelector('ytd-video-renderer yt-formatted-string').innerText;
		const url = `https://www.youtube.com${document.querySelector('#thumbnail').getAttribute('href')}`;
		const thumbnail = document.querySelector('ytd-video-renderer #img').getAttribute('src');
		return { title, url, thumbnail };
	});
	return video;
}