//chirps
var express = require('express'),
    morgan = require('morgan'),
    logger = require('./logger'),
    config = require('./config'), 
    glob = require('glob'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cors = require('cors');

module.exports = function (app, config) {
  
logger.log("Starting application");

app.use(express.static(config.root + '/public'));

app.use(cors());

mongoose.connect(config.db);
  mongoose.Promise = global.Promise;
  var db = mongoose.connection;
  db.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db);
  });

if(process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
    app.use(function (req, res, next) {
      logger.log('Request from ' + req.connection.remoteAddress, 'info');
      mongoose.set('debug', true);
      mongoose.connection.once('open', function callback() {
      logger.log("Mongoose connected to the database");
                });
      next();
    });
  }

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function (model) {
    require(model);
  });

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
      controllers.forEach(function (controllers) {
      require(controllers)(app, config);
  });

  app.use(function (req, res) {
    res.type('text/plan');
    res.status(404);
    res.send('404 Not Found');
  });

  app.use(function (err, req, res, next) {
    console.log(err);
    if (process.env.NODE_ENV !== 'test') logger.log(err.stack,'error');
    res.type('text/plan');
    if(err.status){
      res.status(err.status).send(err.message);
    } else {
      res.status(500).send('500 Sever Error');
    }
  });
};
