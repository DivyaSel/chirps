//chirps
var winston = require('winston'),
       fs = require('fs');

var env = process.env.NODE_ENV || 'development';
var tsFormat = () => (new Date()).toLocaleTimeString();	

var logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
//creates new log dir every day
var logger = new (winston.Logger)({
  transports: [
      new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
    }) 
  ]
});

/*//Colorise log
var  logger = new (winston.Logger)({	
 transports: [
      //colorize the output to the console 
      new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      })
    ]
});	*/

log = function(message, level){		
	level = level || 'info';		
  logger.info(message);
};

exports.log = log;
