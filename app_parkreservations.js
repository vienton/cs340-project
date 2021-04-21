module.exports = function() {
    let express = require('express');
    let router = express.Router();
    let script = "/js/parkreservations.js";

    // Reformat the date received from sql server
    function sqlDateToHTMLDate(dateString) {
        let year = dateString.getFullYear();
        let month = dateString.getMonth() + 1;
        let day = dateString.getDate();
        return year + '-' + month + '-' + day;
    }

    // Get park reservations from the Park Reservations table
    function getParkReservations(res, mysql, context, complete) {
        let sql = "SELECT parkReservationID, parkID, reservationID, groupSize, date, overnight FROM ParkReservations";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                for(i of results) {
                    i.date = sqlDateToHTMLDate(i.date);
                }
                context.parkReservations = results;
                complete();
            }
        })
    }

    // Router for the park reservations page
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getParkReservations(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 1) {
                res.render('parkreservations', context);
            }
        }
    })

    // Router to insert a park reservation then refresh the page
    router.post('/', function(req, res) {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO ParkReservations (parkID, reservationID, groupSize, date, overnight) VALUES (?, ?, ?, ?, ?)";
        let data = [req.body.parkID, req.body.reservationID, req.body.groupSize, req.body.date, req.body.overnight];
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

    // Router to delete a park reservation then refresh the page
    router.delete('/', function (req, res) {
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM ParkReservations WHERE parkReservationID = ?";
        let data = [req.query.parkReservationID];
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

    // Router to update a park reservation
    router.put('/', function(req, res) {
        let parkID, reservationID;
        // let callbackCount = 0;
        let mysql = req.app.get('mysql');
        let sql = "UPDATE ParkReservations SET parkID = ?, reservationID = ?, groupSize = ?, date = ?, overnight = ? WHERE parkReservationID = ?";
        // Check for null in parkID
        if(!req.query.parkID) {
            parkID = null;
        } else {
            parkID = req.query.parkID;
        }

        // Check for null in reservationID
        if(!req.query.reservationID) {
            reservationID = null;
        } else {
            reservationID = req.query.reservationID;
        }

        let data = [parkID, reservationID, req.query.groupSize, req.query.date, req.query.overnight, req.query.parkReservationID];
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