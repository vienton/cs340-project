// server address
let serverAddress = 'http://flip.engr.oregonstate.edu'; // remember to log into VPN

// instantiate and use express
let express = require('express');
let app = express();
app.set('port', 5280);

// set up MySQL
let mysql = require('./dbcon.js');
app.set('mysql', mysql);

// set up and use body-parser
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up handlebars
let handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
})
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set up routes
app.use('/parks', require('./app_parks.js'));
app.use('/reservations', require('./app_reservations.js'));
app.use('/park-reservations', require('./app_parkreservations.js'));
app.use('/visitors', require('./app_visitors.js'));
app.use('/businesses', require('./app_businesses.js'));
app.use('/services', require('./app_services.js'));
app.use('/business-services', require('./app_businessservices.js'));
app.use('/reserve', require('./app_reserve.js'));

// set up public folder
app.use('/', express.static('public'));

// handler for 404 error
app.use(function(req,res){ // use mounts middleware at a specified path
    res.status(404);
    res.render('404');
});

// handler for 500 error
app.use(function(err, req, res, next){
    console.error(err.stack); // TODO: remove this [output error to console]
    res.status(500);
    res.render('500');
});

// start express
app.listen(app.get('port'), function(){
    console.log('Express started on ' + serverAddress + ':' + app.get('port') + '; press Ctrl-C to terminate.');
});