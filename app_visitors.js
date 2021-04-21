module.exports = function() {
    let express = require('express');
    let router = express.Router();
    let script = "/js/visitors.js";

    // Get businesses from the Visitors table
    function getVisitors(res, mysql, context, complete) {
        let sql = "SELECT visitorID, firstName, lastName, email, telephone, streetAddress, city, state, zipCode FROM Visitors";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                context.visitors = results;
                complete();
            }
        })
    }

    // Router for the visitors page
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getVisitors(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 1) {
                res.render('visitors', context);
            }
        }
    })

    // Router to insert a visitor then refresh the page
    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO Visitors (firstName, lastName, email, telephone, streetAddress, city, state, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        let data = [req.body.firstName, req.body.lastName, req.body.email, req.body.telephone, req.body.streetAddress, req.body.city, req.body.state, req.body.zipCode];
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

    // Router to delete a visitor then refresh the page
    router.delete('/', function (req, res) {
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM Visitors WHERE visitorID = ?";
        let data = [req.query.visitorID];
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

    // Router to update a visitor
    router.put('/', function(req, res) {
        // let callbackCount = 0;
        let mysql = req.app.get('mysql');
        let sql = "UPDATE Visitors SET firstName = ?, lastName = ?, email = ?, telephone = ?, streetAddress = ?, city = ?, state = ?, zipCode = ? WHERE visitorID = ?";
        let data = [req.query.firstName, req.query.lastName, req.query.email, req.query.telephone, req.query.streetAddress, req.query.city, req.query.state, req.query.zipCode, req.query.visitorID];
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