//chirps
var express = require('express'),
	logger = require('../../config/logger'),
  	router = express.Router();
    Mongoose = require('mongoose'),
    User = Mongoose.model('User'),
    Chirp = Mongoose.model('Chirp'),  

module.exports = function (app) {

app.use('/api', router);  

	router.route('/chirps')	
		.get(function (req, res, next) {
            logger.log('Get all Chirps', 'verbose');
            var query = Chirp.find()
            .sort(req.query.order)
            .exec()
            .then(function (result) {
            res.status(200).json(result);
            })
            .catch(function(err){
            return next(err);
            })
        	})
        .put(function (req, res, next) {
			logger.log('Update a chirp ' + req.body._id, 'verbose');
            var query = Chirp.findOneAndUpdate(
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
			logger.log("Create a chirp","verbose");
            var chirp = new Chirp(req.body);
            chirp.save()
            .then(function (result) {
            res.status(200).json(result);
            })
            .catch(function(err){
            return next(err);
        	});
		    });

        router.route('/chirps/:id')
    	.get(function (req, res, next) {
            logger.log('Get a Chirp ' + req.params.id, 'verbose');
            var query = Chirp.find({ _id: req.params.id }).exec()
            .then(function (result) {
            res.status(200).json(result);
            })
            .catch(function(err){
            return next(err);
            })
            })
        .delete(function (req, res, next) {
            logger.log('Delete Chirp ' + req.params.id, 'verbose');
            var query = Chirp.remove({ _id: req.params.id })
            .exec()
            .then(function (result) {
            res.status(200).json({ message: 'Chirp deleted' });
            })
            .catch(function (err) {
            return next(err);
            });
            })

        router.route('/chirps/userChirps/:id')
		//Display all the chirps created by a user
        .get( function(req, res,next){
			logger.log('Get User Chirps ' + req.params.id, 'verbose');
			Chirp.find({chirpAuthor: req.params.id})
			.populate('chirpAuthor')
			.sort("-dateCreated")
			.exec()
			.then(function(chirps){
				res.status(200).json(chirps);
			})
			.catch(function(err){
				return next(err);
			})
		    });


        router.route('/chirps/like/:id')
        //Increment a like
		.put( function(req, res, next){
			logger.log('Update Chirp ' + req.params.id,'debug');
			Chirp.findOne({_id: req.params.id}).exec()
			.then(function(chirp){
						chirp.likes++;
						return chirp.save();
			})
			.then(function(chirp){
				res.status(200).json(chirp);
			})
		    .catch(function (err) {
			return next(err);
			});
		    });
}
