module.exports = function (data, connection, mysql, cb) {
    var query = "DELETE FROM oscars WHERE ?? = ?";
    var table = ['year', data.year];
        query = mysql.format(query,table);
        connection.query(query, function(err,result){
        
        var query = "INSERT INTO oscars(??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?)";
        var table = ['year', 'ceremony_name', 'date', 'host', 'can_predict', data.year, data.ceremony_name, data.date, data.host, data.can_predict];
            query = mysql.format(query,table);
            connection.query(query, function(err,result){
            var values = [];   

            for (var i = data.nominees.length - 1; i >= 0; i--) {
                values.push([result.insertId, data.nominees[i].category, data.nominees[i].nominee, data.nominees[i].winner]);
            }
            var query = "INSERT INTO nominee (fk_oscars_id, category, nominee, won) VALUES ?";
            connection.query(query, [values], function(err) {
                 if (err) throw err;
                connection.end();
            });

        }); 
    });
  cb(null,"success")

}
