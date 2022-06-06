const app = require('express')();
const ytdl = require('ytdl-core');

const PORT = "4000"

app.listen(PORT, console.log(`App running on port: ${PORT}`));

app.get('/download',async function(req, res) {
	const url = req.query.url;
	const quality = req.query.quality;

	await ytdl(url, { filter: 'audioandvideo', quality: quality }).pipe(res);
});