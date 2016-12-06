//Chirps
var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

//db
var ChirpSchema = Mongoose.Schema({
    chirp: {type: String, required: true}, 	
	chirpAuthor: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },	
	dateCreated: {type: Date, default: Date.now },	
	likes: {type: Number, default: 0 },		
	reChirp: {type: Boolean, default: false}
}); 

module.exports = Mongoose.model('Chirp', ChirpSchema);