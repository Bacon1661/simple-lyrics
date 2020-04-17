const cheerio = require("cheerio");
const superagent = require("superagent");

async function getLyrics(search) {
	let res = await loadBody(`https://search.azlyrics.com/search.php?q=${encodeURIComponent(search)}`);
	let firstResult;
	let lyricInfo;

	try {
		const listResult = res("div.panel", "div.col-xs-12.col-sm-10.col-sm-offset-1.col-md-8.col-md-offset-2.text-center").last().children("table.table.table-condensed").children("tbody").children("tr");

		if(listResult.children("td.text-left.visitedlyr").children("a").attr()) {
			firstResult = listResult.children("td.text-left.visitedlyr").children("a").attr().href;
			const lyricInfoArr = listResult.children("td.text-left.visitedlyr").text().split("\n");
			lyricInfo = lyricInfoArr[1].slice(lyricInfoArr[1].indexOf(".") + 2);
		} else {
			let findFirstResult = listResult.nextAll().eq(0).children("td.text-left.visitedlyr").children("a").attr();

			for(var i = 0; !findFirstResult && i < 10; i++) {
				try {
					findFirstResult = listResult.nextAll().eq(i).children("td.text-left.visitedlyr").children("a").attr();
				} catch(error) {
					continue;
				}
			}
			firstResult = listResult.nextAll().eq(i).children("td.text-left.visitedlyr").children("a").attr().href;
			const lyricInfoArr = listResult.nextAll().eq(i).children("td.text-left.visitedlyr").text().split("\n");
			lyricInfo = lyricInfoArr[1].slice(lyricInfoArr[1].indexOf(".") + 2);
		}
	} catch(error) {
		return console.error(Error("No results found"));
	}

	res = await loadBody(firstResult);
	let lyrics;
	let divTest = res("div.ringtone", "div.col-xs-12.col-lg-8.text-center").nextAll().eq(0).prop("tagName");
	for(i = 0; divTest !== "DIV" && i < 10; i++) {
		try {
			divTest = res("div.ringtone", "div.col-xs-12.col-lg-8.text-center").nextAll().eq(i).prop("tagName");
		} catch(error) {
			continue;
		}
	}
	lyrics = res("div.ringtone", "div.col-xs-12.col-lg-8.text-center").nextAll().eq(i - 1).text();

	lyricInfo = /(.*)by(.*)/.exec(lyricInfo);
	let output = { "lyrics": lyrics, "title": lyricInfo[1], "artist": lyricInfo[2], "url": firstResult };
	Object.keys(output).map(key => output[key] = output[key].trim());
	return output;
}

async function loadBody(link) {
	let body = await superagent.get(link)
		.catch(err => console.error(err));
	if(body) return cheerio.load(body.text);
}

module.exports = getLyrics;
