module.exports = function (data, connection, mysql, cb) {
    var query = "SELECT last_time_updated, year FROM oscars WHERE ?? = ?";
    var table = ['year', data.year];
        query = mysql.format(query,table);
        connection.query(query, function(err,result){
        if (err) throw err;
        if (true /*result[0] && new Date().getTime() > new Date(result[0].last_time_updated).getTime() + 60000 && new Date().getFullYear() === result[0].year*/) {
            var query = "DELETE FROM oscars WHERE ?? = ?";
            var table = ['year', data.year];
                query = mysql.format(query,table);
                connection.query(query, function(err,result){
                if (err) throw err;
                
                var query = "INSERT INTO oscars(??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?)";
                var table = ['year', 'ceremony_name', 'date', 'host', 'can_predict', data.year, data.ceremony_name, data.date, data.host, data.can_predict];
                    query = mysql.format(query,table);
                    connection.query(query, function(err,result){
                    if (err) throw err;
                    var values = [];   

                    for (var i = data.nominees.length - 1; i >= 0; i--) {
                        values.push([result.insertId, data.nominees[i].category, data.nominees[i].nominee, data.nominees[i].winner]);
                    }
                    var query = "INSERT INTO nominee (fk_oscars_id, category, nominee, won) VALUES ?";
                    connection.query(query, [values], function(err) {
                        if (err) throw err;
                        var query = "SELECT nominee.category, nominee.nominee, nominee.won, " +
                                    "oscars.year, oscars.ceremony_name, oscars.date, oscars.host, oscars.can_predict "+
                                    "FROM nominee, oscars WHERE oscars.year = ? AND nominee.fk_oscars_id = oscars.id";
                                    var table = [data.year];
                                        query = mysql.format(query,table);
                                        connection.query(query, function(err,result){
                                        if (err) throw err;
                                        cb(err, result);
                                    });
                    });
                }); 
            });
        } else {
            var query = "SELECT nominee.category, nominee.nominee, nominee.won, " +
            "oscars.year, oscars.ceremony_name, oscars.date, oscars.host, oscars.can_predict "+
            "FROM nominee, oscars WHERE oscars.year = ? AND nominee.fk_oscars_id = oscars.id";
            var table = [data.year];
                query = mysql.format(query,table);
                connection.query(query, function(err,result){
                if (err) throw err;
                cb(err, result);
            });
        }
    });
}
