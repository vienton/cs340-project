module.exports = function() {
    let express = require('express');
    let router = express.Router();
    let script = "/js/reserve.js";

    // Get unique states from the database where there are parks
    function getParkStates(res, mysql, context, complete) {
        let sql = "SELECT DISTINCT state FROM Parks ORDER BY state";
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                context.parkStates = results;
                complete();
            }
        });
    }

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
        });
    }

    // Search for parks by name from the search box
    function getParksByName(req, res, mysql, context, complete) {
        let sql = "SELECT parkID, name, state, acreage, capacity FROM Parks WHERE name LIKE " + mysql.pool.escape('%' + req.params.s + '%');
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
        });
    }

    // Filter parks by state from teh state drop down menu
    function getParksByState(req, res, mysql, context, complete) {
        let sql = "SELECT parkID, name, state, acreage, capacity FROM Parks WHERE state = " + mysql.pool.escape(req.params.s);
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
        });
    }

    // Look up Visitors record by email address
    function lookupEmail(req, res, mysql, context, complete) {
        let sql = "SELECT firstName, lastName, email, telephone, streetAddress, city, state, zipCode FROM Visitors WHERE email = " + mysql.pool.escape(req.params.s);
        mysql.pool.query(sql, function (error, results, fields) {
            if(error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.status(200);
                context.contactInfo = results;
                complete();
            }
        });
    }

    // Router for the parks page
    router.get('/', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getParkStates(res, mysql, context, complete);
        getParks(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 2) {
                res.render('reserve', context);
            }
        }
    });

    // Router search for parks by name
    router.get('/s/:s', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getParksByName(req, res, mysql, context, complete);
        getParkStates(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 2) {
                res.render('reserve', context);
            }
        }
    });

    // Router filter for parks by state
    router.get('/f/:s', function (req, res) {
        let callbackCount = 0;
        let context = {};
        context.jsscripts = [script];
        let mysql = req.app.get('mysql');
        getParksByState(req, res, mysql, context, complete);
        getParkStates(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount == 2) {
                res.render('reserve', context);
            }
        }
    });

    // Router search for parks by name; send context back as JSON stringified
    router.post('/', function (req, res) {
        let result = {};
        let context = {};
        let mysql = req.app.get('mysql');
        let contactInfo = req.body.contactInfo;
        // Insert record into Visitors table
        let visitorID;
        let sqlContactInfo = "INSERT INTO Visitors(firstName, lastName, email, telephone, streetAddress, city, state, zipCode) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
        let contactVals = [contactInfo.firstName, contactInfo.lastName, contactInfo.email, contactInfo.telephone, contactInfo.streetAddress, contactInfo.city, contactInfo.state, contactInfo.zipCode];
        // TODO: Deal with duplicate Visitors record; check email address and ...
        mysql.pool.query(sqlContactInfo, contactVals, function (error, result, fields) {
            if (error) {
                res.status(400);
                res.write(JSON.stringify(error));
                res.end();
            } else {
                // Get newly created visitorID
                visitorID = result.insertId;
                // Insert record into Reservations table
                let reservationID;
                let today = new Date().toISOString().slice(0, 10);
                let sqlReservations = "INSERT INTO Reservations(visitorID, reservationDate) VALUES (?, ?)";
                let reservationVals = [visitorID, today];
                mysql.pool.query(sqlReservations, reservationVals, function (error, result, fields) {
                    if (error) {
                        res.status(400);
                        res.write(JSON.stringify(error));
                        res.end();
                    } else {
                        // Get newly created reservationID
                        reservationID = result.insertId;
                        // Insert record into ParkReservations table
                        let sqlParkReservations = 'INSERT INTO ParkReservations(parkID, reservationID, groupSize, date, overnight) VALUES (?, ?, ?, ?, ?)';
                        for(let i = 0; i < req.body.reservations.length; i++) {
                            let parkReservationsVals = [req.body.reservations[i].parkID, reservationID, req.body.reservations[i].groupSize, req.body.reservations[i].reservationDate, req.body.reservations[i].overnight];
                            mysql.pool.query(sqlParkReservations, parkReservationsVals, function (error, result, fields) {
                                if (error) {
                                    res.status(400);
                                    res.write(JSON.stringify(error));
                                    res.end();
                                } else {
                                    context = JSON.stringify(result);
                                    res.status(201);
                                    res.send(context);
                                    res.end();
                                }
                            });
                        }
                    }
                });
            }
        });
    })

    return router;
}();