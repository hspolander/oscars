var mysql = require("mysql");
var scrapeOscars = require('./getDataOscars.js');

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {

    router.get("/getOscarsByYear",function(req,res){
        var ceremonyNumber = req.query.ceremony_name.toString();

        if (ceremonyNumber.slice(-1) === '1' && (req.query.ceremony_name > 20 || req.query.ceremony_name < 10)) {
            ceremonyNumber = ceremonyNumber + 'st';
        } else if (ceremonyNumber.slice(-1) === '2' && (req.query.ceremony_name > 20 || req.query.ceremony_name < 10)) {
            ceremonyNumber = ceremonyNumber + 'nd';
        } else if (ceremonyNumber.slice(-1) === '3' && (req.query.ceremony_name > 20 || req.query.ceremony_name < 10)) {
            ceremonyNumber = ceremonyNumber + 'rd';
        } else {
            ceremonyNumber = ceremonyNumber + 'th';
        }        

        scrapeOscars("https://en.wikipedia.org/wiki/"+ceremonyNumber+"_Academy_Awards", (err, data) => {
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
        var query = "SELECT nominee.category, nominee.nominee, nominee.won, " +
                                    "oscars.year, oscars.ceremony_name, oscars.date, oscars.host, oscars.can_predict "+
                                    "FROM nominee, oscars WHERE oscars.id = ? AND nominee.fk_oscars_id = oscars.id";
        var params = [req.query.id];
        query = mysql.format(query,params);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
            } else {
                res.json({"Error" : false, "Message" : "Success", "data" : rows});
            }
        });    
    });

    router.get("/autocompleteSearch",function(req,res){
        var query = "SELECT distinct oscars.year FROM oscars WHERE oscars.year like ?; " + 
                    "SELECT distinct oscars.host FROM oscars WHERE oscars.host like ?; " + 
                    "SELECT distinct nominee.nominee FROM nominee WHERE nominee.nominee like ?; " + 
                    "SELECT distinct nominee.category FROM nominee WHERE nominee.category like ?; ";
        var params = ['%'+req.query.startsWith+'%', '%'+req.query.startsWith+'%', '%'+req.query.startsWith+'%', '%'+req.query.startsWith+'%'];
        query = mysql.format(query, params);

        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
            } else {
                res.json({"Error" : false, "Message" : "Success", "data" : rows});
            }
        });    
    });
    
    router.get("/getOscarsByHost",function(req,res){
        var query = "SELECT distinct oscars.year, oscars.ceremony_name, oscars.date, oscars.host, oscars.can_predict "+
                                    "FROM oscars WHERE oscars.host like ?;";
        var params = ['%'+req.query.host+'%'];
        query = mysql.format(query,params);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
            } else {
                res.json({"Error" : false, "Message" : "Success", "data" : rows});
            }
        });    
    });
}

module.exports = REST_ROUTER;