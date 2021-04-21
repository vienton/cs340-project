module.exports = function() {
    let express = require('express');
    let router = express.Router();
    let script = "/js/businessservices.js";

    // Get business services from the Business Services table
    function getBusinessServices(res, mysql, context, complete) {
        let sql = "SELECT businessServiceID, businessID, serviceID FROM BusinessServices";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                context.businessservices = results;
                complete();
            }
        })
    }

    // Router for the business services page
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getBusinessServices(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 1) {
                res.render('businessservices', context);
            }
        }
    })

    // Router to insert a business service then refresh the page
    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO BusinessServices (businessID, serviceID) VALUES (?, ?)";
        let data = [req.body.businessID, req.body.serviceID];
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

    // Router to delete a business service then refresh the page
    router.delete('/', function (req, res) {
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM BusinessServices WHERE businessServiceID = ?";
        let data = [req.query.businessServiceID];
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

    // Router to update a business service
    router.put('/', function(req, res) {
        let businessID, serviceID;
        // let callbackCount = 0;
        let mysql = req.app.get('mysql');
        let sql = "UPDATE BusinessServices SET businessID = ?, serviceID = ? WHERE businessServiceID = ?";

        // Check for null value in businessID
        if(!req.query.businessID) {
            businessID = null;
        } else {
            businessID = req.query.businessID;
        }

        // Check for null value in serviceID
        if(!req.query.serviceID) {
            serviceID = null;
        } else {
            serviceID = req.query.serviceID;
        }

        let data = [businessID, serviceID, req.query.businessServiceID];
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