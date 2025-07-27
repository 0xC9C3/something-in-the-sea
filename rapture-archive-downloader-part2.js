const part = 'part2';

async function getUrlsForDay(dayNumber) {
	const baseUrl = 'https://www.rapturearchives.org/sits/';
	const day = 'day_';
	const url = `${baseUrl}${part}/${day}${dayNumber}/`;

	let downloadUrls = [];
	downloadUrls.push({
		url: `${url}xml/bioroom.xml`,
		path: `xml/bioroom.xml`
	});
	downloadUrls.push({
		url: `${url}swf/bioroom.swf`,
		path: `swf/bioroom.swf`
	});
	downloadUrls.push({
		url: `${url}swf/preloader.swf`,
		path: `swf/preloader.swf`
	});

	const response = await fetch(`${url}xml/bioroom.xml`);

	if (!response.ok) {
		throw new Error(`Failed to fetch XML from ${url}: ${response.statusText}`);
	}

	const xmlText = await response.text();

	const startKey = '<![CDATA[';
	const endKey = ']]>';
	const splitXml = xmlText.split(startKey);
	for (let i = 1; i < splitXml.length; i++) {
		const part = splitXml[i].split(endKey)[0].trim();
		if (part === '') continue;

		downloadUrls.push({
			url: `${url}${part}`,
			path: part.replace('../', '')
		});
	}

	//console.log(downloadUrls);
	//process.exit(0);

	return downloadUrls;
}

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

async function downloadAll(day, downloadUrls) {
	for (const fileUrlMeta of downloadUrls) {
		const fileUrl = fileUrlMeta.url;
		const partNumber = part.match(/part(\d+)/)[1];
		const destPath = path.join('./', 'static', '_swf', partNumber, day, fileUrlMeta.path);

		try {
			await downloadFile(fileUrl, destPath);
		} catch (error) {
			console.error(`Error downloading ${fileUrl}:`, error.message);
		}
	}
}

// start at day 1 until day 123
async function main() {
	for (let dayNumber = 1; dayNumber <= 123; dayNumber++) {
		try {
			const paddedDayNumber = String(dayNumber).padStart(3, '0');
			console.log(`Processing day ${paddedDayNumber}...`);

			if (dayNumber === 122) {
				const urls = await getUrlsForDay(`${paddedDayNumber}_morning`);
				await downloadAll(`${paddedDayNumber}_morning`, urls);
				const eveningUrls = await getUrlsForDay(`${paddedDayNumber}_evening`);
				await downloadAll(`${paddedDayNumber}_evening`, eveningUrls);
				continue;
			}

			const downloadUrls = await getUrlsForDay(paddedDayNumber);
			await downloadAll(`${dayNumber}`, downloadUrls);
		} catch (error) {
			console.error(`An error occurred while processing day ${dayNumber}:`, error.message);
		}
	}
}

main().catch((error) => {
	console.error('An error occurred during the download process:', error.message);
	process.exit(1);
});
