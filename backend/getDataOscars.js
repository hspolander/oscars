const cheerio = require('cheerio'),
	req = require ('tinyreq');

module.exports = function (url, cb) {
  req(url, (err, body) => {
  
  if (err) { 
    return cb(err); 
  }
  
  let page = cheerio.load(body), 
  	pageData = page('.wikitable'),
    d = new Date(),
    tableArray,
    winners = 0;

  let table = page(pageData[0]),
    resultlist = [],
    tableTdList;
          
    if (table.find('a').first().attr('title') === 'Academy Award for Best Picture') {

    	let date = page('.infobox.vevent').find('th:contains("Date")').next().text(),
     	current_time = d.toLocaleString();
           	
      tableArray = {'ceremony_name': page('#firstHeading').text(),
     	  'host' : page('.infobox.vevent').find('th:contains("Hosted by")').next().text(),
     		'year' : date.substr(date.length - 4),
     		'date' : date,
        'can_predict' : 1,
        'ceremony_name' : page('#firstHeading').text(),
     		'last_time_updated' : current_time,
     		'nominees' : resultlist};
    
       	tableTdList = table.find('td');

       	for (var l =  0; l < tableTdList.length; l++) {
       		let nomineeLiItems = page(tableTdList[l]).find('li'),
       		nomineeList = [];

          for (var j =  0; j < nomineeLiItems.length; j++) {
         	  nomineeList.push(page(nomineeLiItems[j]).find('a').first().text());
            let category = page(tableTdList[l]).find('div a').text();
                  
            //Handles older oscars wiki formatting
            if (category === "") {
              oldOscarsCategoryTable = table.find('th');
              category = page(oldOscarsCategoryTable[l]).find('th a').text();
            }

         		if (page(nomineeLiItems[j]).find('b').find('a').first().text()) {
              winners = winners + 1;
         					
              resultlist.push(
              { 'category': category,
            	 	'nominee' : page(nomineeLiItems[j]).find('a').first().text(),
	          	 	'winner' : 1,
              });
           		} else {
              resultlist.push(
		        	{  'category': category,
		             'nominee' : page(nomineeLiItems[j]).find('a').first().text(),
			           'winner' : 0,
              });
           	  }
          }
        };

      if (d.getFullYear() > tableArray.year || winners > 23 ) {
        tableArray.can_predict = 0;
      }
      cb(null, tableArray);
    }
  });
}