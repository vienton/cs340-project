module.exports = function() {
    let express = require('express');
    let router = express.Router();
    let script = "/js/businesses.js";

    // Get businesses from the Businesses table
    function getBusinesses(res, mysql, context, complete) {
        let sql = "SELECT businessID, parkID, businessName, streetAddress, city, state, zipCode, telephone FROM Businesses";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                context.businesses = results;
                complete();
            }
        })
    }

    // Get parkID from the Parks table
    function getParkIDs(res, mysql, context, complete) {
        let sql = "SELECT parkID FROM Parks ORDER BY parkID";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                context.parkIDs = results;
                complete();
            }
        })
    }

    // Router for the businesses page
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getBusinesses(res, mysql, context, complete);
        getParkIDs(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 2) {
                res.render('businesses', context);
            }
        }
    })

    // Router to insert a business then refresh the page
    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO Businesses (parkID, businessName, telephone, streetAddress, city, state, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?)";
        let data = [req.body.parkID, req.body.businessName, req.body.telephone, req.body.streetAddress, req.body.city, req.body.state, req.body.zipCode];
        mysql.pool.query(sql, data, function(error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(201);
                res.redirect('back');
            }
        })
    })

    // Router to delete a business then refresh the page
    router.delete('/', function (req, res) {
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM Businesses WHERE businessID = ?";
        let data = [req.query.businessID];
        mysql.pool.query(sql, data, function(error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        })
    })

    // Router to update a business
    router.put('/', function(req, res) {
        let parkID;
        // let callbackCount = 0;
        let mysql = req.app.get('mysql');
        let sql = "UPDATE Businesses SET parkID = ?, businessName = ?, streetAddress = ?, city = ?, state = ?, zipCode = ?, telephone = ? WHERE businessID = ?";
        // Check for null in parkID
        if(!req.query.parkID) {
            parkID = null;
        } else {
            parkID = req.query.parkID;
        }
        let data = [parkID, req.query.businessName, req.query.streetAddress, req.query.city, req.query.state, req.query.zipCode, req.query.telephone, req.query.businessID];
        // let data = [req.query.parkID, req.query.businessName, req.query.streetAddress, req.query.city, req.query.state, req.query.zipCode, req.query.telephone, req.query.businessID];
        mysql.pool.query(sql, data, function(error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                res.end();
            }
        })
    })

    return router;
}();