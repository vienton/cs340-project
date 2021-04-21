module.exports = function() {
    let express = require('express');
    let router = express.Router();
    let script = "/js/reservations.js";


    // Reformat the date received from sql server
    function sqlDateToHTMLDate(dateString) {
        let year = dateString.getFullYear();
        let month = dateString.getMonth() + 1;
        let day = dateString.getDate();
        return year + '-' + month + '-' + day;
    }

    // Get unique visitorIDs from the Visitors table
    function getVisitorIDs(res, mysql, context, complete) {
        let sql = "SELECT DISTINCT visitorID FROM Visitors ORDER BY visitorID";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                context.visitorIDs = results;
                complete();
            }
        });
    }

    // Get services from the Reservations table
    function getReservations(res, mysql, context, complete) {
        let sql = "SELECT reservationID, visitorID, reservationDate FROM Reservations";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                for(i of results) {
                    i.reservationDate = sqlDateToHTMLDate(i.reservationDate);
                }
                context.reservations = results;
                complete();
            }
        })
    }

    // Router for the Reservations page
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getVisitorIDs(res, mysql, context, complete);
        getReservations(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 2) {
                res.render('reservations', context);
            }
        }
    })

    // Router to insert a reservation then refresh the page
    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO Reservations (visitorID, reservationDate) VALUES (?, ?)";
        let data = [req.body.visitorID, req.body.reservationDate];
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

    // Router to delete a reservation then refresh the page
    router.delete('/', function (req, res) {
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM Reservations WHERE reservationID = ?";
        let data = [req.query.reservationID];
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

    // Router to update a reservation
    router.put('/', function(req, res) {
        let visitorID;
        // let callbackCount = 0;
        let mysql = req.app.get('mysql');
        let sql = "UPDATE Reservations SET visitorID = ?, reservationDate = ? WHERE reservationID = ?";
        // Check for null value in visitorID
        if(!req.query.visitorID) {
            visitorID = null;
        } else {
            visitorID = req.query.visitorID;
        }
        let data = [visitorID, req.query.reservationDate, req.query.reservationID];
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