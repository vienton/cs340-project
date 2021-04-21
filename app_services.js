module.exports = function() {
    let express = require('express');
    let router = express.Router();
    let script = "/js/services.js";

    // Get services from the Services table
    function getServices(res, mysql, context, complete) {
        let sql = "SELECT serviceID, description FROM Services ORDER BY serviceID";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                context.services = results;
                complete();
            }
        })
    }

    // Router for the services page
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getServices(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 1) {
                res.render('services', context);
            }
        }
    })

    // Router to insert a service then refresh the page
    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO Services (description) VALUE (?)";
        let data = [req.body.description];
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

    // Router to delete a service then refresh the page
    router.delete('/', function (req, res) {
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM Services WHERE serviceID = ?";
        let data = [req.query.serviceID];
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

    // Router to update a service
    router.put('/', function(req, res) {
        // let callbackCount = 0;
        let mysql = req.app.get('mysql');
        let sql = "UPDATE Services SET description = ? WHERE serviceID = ?";
        let data = [req.query.description, req.query.serviceID];
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