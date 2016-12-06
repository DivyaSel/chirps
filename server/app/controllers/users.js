//Chirps
var express = require('express'),
	logger = require('../../config/logger'),
  	router = express.Router(),

    Mongoose = require('mongoose'),
    User = Mongoose.model('User'),
    Chirp = Mongoose.model('Chirp'),
    passportService = require('../../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', { session:false}),
    requireLogin = passport.authenticate('local', { session:false});

module.exports = function (app) {

app.use('/api', router); 

	router.route('/users')	
		.get(requireAuth, function (req, res, next) {
            logger.log('Get all Users', 'verbose');
            var query = User.find()
            .sort(req.query.order)
            .exec()
            .then(function (result) {
            res.status(200).json(result);
            })
            .catch(function(err){
            return next(err);
            })
            })
         .put(requireAuth, function (req, res, next) {
            logger.log('Update User ' + req.body._id, 'verbose');
            var query = User.findOneAndUpdate(
		    { _id: req.body._id }, 
		    req.body, 
		    { new: true })
            .exec()
            .then(function (result) {
            res.status(200).json(result);
            })
            .catch(function(err){
            return next(err);
            })
            })
		.post(function(req, res, next){
			logger.log("Create a user","verbose");
            var user = new User(req.body);
            user.save()
            .then(function (result) {
            res.status(200).json(result);
            })
            .catch(function(err){
            return next(err);
            })
		    });

        router.route('/users/:id')
        .get(requireAuth, function (req, res, next) {
            logger.log('Get a User ' + req.params.id, 'verbose');
            var query = User.findById({ _id: req.params.id }).exec()
            .then(function (result) {
            res.status(200).json(result);
            })
            .catch(function(err){
            return next(err);
            })
            })
        .delete(requireAuth, function (req, res, next) {
            logger.log('Delete User ' + req.params.id, 'verbose');
            var query = User.remove({ _id: req.params.id })
            .exec()
            .then(function (result) {
            res.status(200).json({ message: 'User deleted' });
            })
            .catch(function (err) {
            return next(err);
            });
            })
         .put(requireAuth, function (req, res, next) {
            logger.log('Update User ' + req.params.id, 'verbose');
            var query = User.findById(req.params.id)
            .exec()
            .then(function (user) {
            var query = User.findById(req.params.id)
            .exec()
            .then(function (user) {
            if (req.body.firstName !== undefined) {
                user.firstName = req.body.firstName;
            };
            if (req.body.lastName !== undefined) {
                user.lastName = req.body.lastName;
            };
            if (req.body.screenName !== undefined) {
                user.screenName = req.body.screenName;
            };
            if (req.body.email !== undefined) {
                user.email = req.body.email;
            };
            if (req.body.password !== undefined) {
                user.password = req.body.password;
            };

            return user.save();
            })
            .then(function(user) {
            res.status(200).json(user);
            })
            .catch(function (err) {
            return next(err);
            });})
            })

        router.route('/users/screenName/:name')
        .get(requireAuth, function (req, res, next) {
            logger.log('Get User ' + req.params.name, 'verbose');				
            User.findOne({ screenName: req.params.name }).exec()	
			.then(function (user) {							
                res.status(200).json(user);
			})
			.catch(function (err) { 
				return next(err);
			});
        });

        router.route('/users/followedChirps/:id')
        //returns both the chirps created by the user id and chirps of users followed by the user id
       .get(requireAuth, function (req, res, next) {
      		logger.log('Get Users followed chirps ' + req.params.id, 'verbose');
      		User.findOne({ _id: req.params.id })
			.then(function(user){
	        			Chirp.find({$or: [{ chirpAuthor: user._id }, { chirpAuthor: { $in: user.follow } }]})
				//.populate('screenName')
                .populate('chirpAuthor')
				.sort('-dateCreated')
				.exec()
					.then(function (chirps) {
						res.status(200).json(chirps);
					})
			})
			.catch(function(err){
				return next(error);
			});
	});


        router.route('/users/follow/:id')
            .put(requireAuth, function (req, res, next) {
                logger.log('Follow a user ' + req.params.id, 'verbose');
                User.findOne({ _id: req.params.id }).exec()
                    .then(function (user) {
                        if (user.follow.indexOf(req.body._id) == -1) {
                            user.follow.push(req.body._id);
                            user.save()
                                .then(function ( user) {
                                    res.status(200).json(user);
                                })
                                .catch(function (err) {
                                    return next(error);
                                });
                            }
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                    });
        
        router.route('/users/login')
            .post(requireLogin, login);
}