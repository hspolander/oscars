var mysql = require("mysql");
var scrapeOscars = require('./getDataOscars.js');
function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/getAllOscars",function(req,res){
           
    });
    router.get("/getOscarsByYear",function(req,res){
        //var query = "SELECT * FROM oscars where ?? = ?";
        //var table = ['year', req.query.year];
        //query = mysql.format(query,table);
        //connection.query(query,function(err,rows){
        //    if(err) {
        //        res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        //    } else {
        //        res.json({"Error" : false, "Message" : "Success", "Nominees" : rows});
        //    }
        //});
        scrapeOscars("https://en.wikipedia.org/w/index.php?title="+req.query.ceremony_name+"th_Academy_Awards", (err, data) => {
    	if(err) {
                res.json({"Error" : true, "Message" : "Error executing request. Please check year"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Nominees" : data});
            }   
    	});  
    });
    router.get("/getOscarsById",function(req,res){
        var query = "SELECT * FROM oscars";
        var table = ['id', req.query.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });    
    });
    router.get("/getYearByCeremonyName",function(req,res){
        var query = "SELECT * FROM oscars";
        var table = ["user_login"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });   
    });
    router.get("/deleteOscarsByYear",function(req,res){
        var query = "DELETE * FROM oscars where ?? = ?";
        var table = ['year', req.query.year];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Action" : "Deketed from year "+ req.query.year});
            }
        });
    });
    router.post("/createNominee",function(req,res){
    	console.log(req.query);
        var query = "INSERT INTO oscars (??, ??, ??, ??, ??, ?? ,??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var table = ['year', 'ceremony_name', 'date', 'host', 'nominee', 'won' ,'category', 'last_time_updated', 'last_time_accessed', req.query.year, req.query.ceremony_name, req.query.date, req.query.host, req.query.nominee, req.query.won ,req.query.category, req.query.last_time_updated, req.query.last_time_accessed];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query", "SqlError": err});
            } else {
                res.json({"Error" : false, "Message" : "Entity Added !"});
            }
        });
    });
}

module.exports = REST_ROUTER;