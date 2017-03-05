const cheerio = require("cheerio"),
	req = require ("tinyreq");


function scrapeOscars(url, cb) {
    req(url, (err, body) => {
        if (err) { return cb(err); }

        let page = cheerio.load(body)
          , pageData = page(".wikitable")
          , tableArray = []
          ;

        for (var i = 0 ; pageData.length > i; i++) {
           	let table = page(pageData[i]),
           	resultlist = [],
           	tableTdList;
           	if (table.find('a').first().attr('title') === "Academy Award for Best Picture") {
           		tableTdList = table.find('td');
           		for (var l =  0; l < tableTdList.length; l++) {
           			let nomineeList = [],
           			winner,
           			nomineeLiItems = page(tableTdList[l]).find('li');
           			for (var j =  0; j < nomineeLiItems.length; j++) {
           				nomineeList.push(page(nomineeLiItems[j]).find('a').first().text());
           				if (page(nomineeLiItems[j]).find('b').find('a').first().text()) {
           					winner = page(nomineeLiItems[j]).find('b').find('a').first().text();
           				}
           			}
           			if (winner) {
           				resultlist.push({"award": page(tableTdList[l]).find('div a').text(),
           			 	"nominees" : nomineeList,
           			 	'winner' : winner});
           			} else {
           				resultlist.push({"award": page(tableTdList[l]).find('div a').text(),
           			 	"nominees" : nomineeList});
           			}
           		};
           	tableArray = resultlist;
           	}
        }
        cb(null, tableArray);
    });
}

scrapeOscars("https://en.wikipedia.org/w/index.php?title=89th_Academy_Awards&offset=20170227051636&limit=500&action=history", (err, data) => {
    console.log(err || data);
});