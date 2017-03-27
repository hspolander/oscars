const cheerio = require('cheerio'),
	req = require ('tinyreq');

module.exports = function (url, cb) {
    req(url, (err, body) => {
        if (err) { return cb(err); }
        console.log(url);
        let page = cheerio.load(body), 
        	pageData = page('.wikitable'),
        	d = new Date(),
        	tableArray;

        for (var i = 0 ; pageData.length > i; i++) {
           	let table = page(pageData[i]),
           	resultlist = [],
           	nomineeList,
           	tableTdList;
           	if (table.find('a').first().attr('title') === 'Academy Award for Best Picture') {

           		let date = page('.infobox.vevent').find('th:contains("Date")').next().text(),
	           		fullDateUpdated = d.toLocaleString();
	           		tableArray = {'ceremony_name': page('#firstHeading').text(),
	           		'host' : page('.infobox.vevent').find('th:contains("Hosted by")').next().text(),
	           		'year' : date.substr(date.length - 4),
	           		'date' : date,
	           		'last_time_accessed' : fullDateUpdated,
	           		'award_data' : resultlist};

           		tableTdList = table.find('td');

           		for (var l =  0; l < tableTdList.length; l++) {
           			let nomineeLiItems = page(tableTdList[l]).find('li');
           			nomineeList = [];

           			for (var j =  0; j < nomineeLiItems.length; j++) {
           				nomineeList.push(page(nomineeLiItems[j]).find('a').first().text());
                  let category = page(tableTdList[l]).find('div a').text();
                  if (category === "") {
                    oldOscarsCategoryTable = table.find('th');
                    category = page(oldOscarsCategoryTable[l]).find('th a').text();
                  }

           				if (page(nomineeLiItems[j]).find('b').find('a').first().text()) {
           					resultlist.push(
		           				{'host': page('.infobox.vevent').find('th:contains("Hosted by")').next().text(),
                      'year' : date.substr(date.length - 4),
		           			 	'ceremony_name': page('#firstHeading').text(),
		           			 	'date' : date,
		           			 	'last_time_updated': fullDateUpdated,
		           			 	'category': category,
		           			 	'nominee' : page(nomineeLiItems[j]).find('a').first().text(),
		           			 	'winner' : 1}
                      );
           				} else {
	           				resultlist.push(
		           				{'host': page('.infobox.vevent').find('th:contains("Hosted by")').next().text(),
		           			 	'year' : date.substr(date.length - 4),
		           			 	'ceremony_name': page('#firstHeading').text(),
		           			 	'date' : date,
		           			 	'last_time_updated': fullDateUpdated,
		           			 	'category': category,
		           			 	'nominee' : page(nomineeLiItems[j]).find('a').first().text(),
			           			 'winner' : 0}
                       );
           				}
           			}
           		};
        	cb(null, resultlist);
           	}
        }
    });
}