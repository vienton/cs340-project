module.exports = function() {
    let express = require('express');
    let router = express.Router();
    let script = "/js/parks.js";

    // Get parks from the Parks table
    function getParks(res, mysql, context, complete) {
        let sql = "SELECT parkID, name, state, acreage, capacity FROM Parks";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                context.parks = results;
                complete();
            }
        })
    }

    // Router for the parks page
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getParks(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 1) {
                res.render('parks', context);
            }
        }
    })

    // Router to insert a park then refresh the page
    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO Parks (name, state, acreage, capacity) VALUES (?, ?, ?, ?)";
        let data = [req.body.name, req.body.state, req.body.acreage, req.body.capacity];
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

    // Router to delete a park then refresh the page
    router.delete('/', function (req, res) {
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM Parks WHERE parkID = ?";
        let data = [req.query.parkID];
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

    // Router to update a park
    router.put('/', function(req, res) {
        // let callbackCount = 0;
        let mysql = req.app.get('mysql');
        let sql = "UPDATE Parks SET name = ?, state = ?, acreage = ?, capacity = ? WHERE parkID = ?";
        let data = [req.query.name, req.query.state, req.query.acreage, req.query.capacity, req.query.parkID];
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