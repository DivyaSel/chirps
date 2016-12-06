//chirps
var path = require('path'),    
       rootPath = path.normalize(__dirname + '/..'),    
       env = process.env.NODE_ENV || 'development';

var config = {  
       development: {    
                   root: rootPath,    
                   app: {      name: 'chirps'    },    
                   port: 5000, 
                   db: 'mongodb://127.0.0.1/chirp-dev',
                   secret: "DivyaShankar" 
                    },  
        test: {
                    root: rootPath,
                    app: {      name: 'chirps'    },
                    port: 5000,
                    secret: "DivyaShankar"
              },
        production: {    
                     root: rootPath,    
                     app: {      name: 'chirps'    },    
                     port: 80,
                     secret: "DivyaShankar"
                    }
         };
         
module.exports = config[env];
