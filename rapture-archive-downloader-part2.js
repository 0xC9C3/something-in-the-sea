const baseUrl = 'https://www.rapturearchives.org/sits/';
const part = 'part1';
const day = 'day3';
const url = `${baseUrl}${part}/${day}/`;

// try to download ${url}/day1.swf, ${url}/day2.swf ... until day9.swf, then try to download top.swf and day10pm.swf
const downloadUrls = [];
for (let i = 1; i <= 10; i++) {
		downloadUrls.push(`${url}day${i}.swf`);
}

downloadUrls.push(`${url}somethinginthesea.swf`);
downloadUrls.push(`${url}top.swf`);
downloadUrls.push(`${url}day10am.swf`);
downloadUrls.push(`${url}day10pm.swf`);

// try to download and store them in ./static/swf/{partNumber}/{dayNumber}/
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

async function downloadFile(url, dest) {
		const response = await fetch(url);
		if (!response.ok) {
				throw new Error(`Failed to download ${url}: ${response.statusText}`);
		}
		const buffer = await response.buffer();
		fs.mkdirSync(path.dirname(dest), { recursive: true });
		fs.writeFileSync(dest, buffer);
		console.log(`Downloaded ${url} to ${dest}`);
}

async function downloadAll() {
		for (const fileUrl of downloadUrls) {
				const fileName = path.basename(fileUrl);
				const partNumber = part.match(/part(\d+)/)[1];
				const dayNumber = day.split('day')[1];
				const destPath = path.join('./', 'static', 'swf', partNumber, dayNumber, fileName);
				try {
						await downloadFile(fileUrl, destPath);
				} catch (error) {
						console.error(`Error downloading ${fileUrl}:`, error.message);
				}
		}
}

downloadAll().catch(error => {
		console.error('An error occurred during the download process:', error.message);
		process.exit(1);
});
