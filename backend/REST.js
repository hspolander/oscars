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
        
        scrapeOscars("https://en.wikipedia.org/w/index.php?title="+req.query.ceremony_name+"th_Academy_Awards", (err, data) => {
        if(err) {
                res.json({"Error" : true, "Message" : "Error executing request. Please check year"});
            } else {
                var insertOscarsData = require('./oscars.js');

                insertOscarsData(data, connection, mysql, (err, response) => {
                    if(err) {
                        res.json({"Error" : true, "Message" : "Error during insert."});
                    } else {
                        res.json({"Error" : false, "Message" : "Success", "data" : response});
                    }   
                });
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
}

module.exports = REST_ROUTER;