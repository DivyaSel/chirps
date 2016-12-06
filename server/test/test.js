//chirps
"use strict";
var mongoose = require("mongoose"),
	User = require('../app/models/users');
var USER_ID="";

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
let should = chai.should();

chai.use(chaiHttp);
/*
describe('Test', function() {
  it('/GET index.html');
  it('/GET 404');
  it('/GET users');
});

it('it should GET the index.html file', (done) => {
	chai.request(server)
		.get('/index.html')
		.end((err, res) => {
			res.should.have.status(200);
			res.should.be.html;//200 response msg will be html(since, index.html); 404 err msg will be plan text
		done();
		});     
	});

it('it should return 404', (done) => {
	chai.request(server)		
	.get('/index2.html')
		.end((err, res) => {
			res.should.have.status(404);
		done();
		});
	});

describe('/GET users', () => {
	it('it should GET all the users', (done) => {
		chai.request(server)
			.get('/api/users')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(3);
				res.body[0].should.be.a('object');
 				res.body[0].should.have.property('name');
				res.body[0].should.have.property('email');
				res.body[0].name.should.be.a('string');
				res.body[0].name.should.equal('John'); 
			done();
			});
	});
});*/

//Test for services
describe('User', () => {
	beforeEach((done) => { 
		User.remove({}, (err) => {
			done();
		});
	});

it('it should GET all the users', (done) => {
	chai.request(server)
		.get('/api/users')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('array');
			//res.body.length.should.be.eql(0);//equals to number of users in the db
			done();
		});
	});

it('it should POST a user', (done) => {
		var user = {
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "one@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		}
		chai.request(server)
			.post('/api/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('firstName');
				res.body.firstName.should.be.a('string');
				res.body.firstName.should.equal('Jane');
				done();
			});
	});

it('it should not POST a user without email field', (done) => {
	var user = {
		"firstName": "Jane",
		"lastName": "Doe",
		"screenName": "JoJo",
		"password": "pass"
	}
	chai.request(server)
		.post('/api/users')
		.send(user)
		.end((err, res) => {
			res.should.have.status(500);
			done();
		});
	});

it('it should GET a user by the given id', (done) => {
	var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "one@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});
	user.save((err, user) => {
//Define a valid user document as before
		chai.request(server)
			.get('/api/users/' + user._id)
			.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('firstName');
				res.body.should.have.property('lastName');
				res.body.should.have.property('email');
				res.body.should.have.property('screenName');
				res.body.should.have.property('_id').eql(user._id.toString());
				done();
			});
		});
	});

it('it should UPDATE a user', (done) => {
	//Define a valid user document as before with an email other than woo@hoo.com and name other than Joey
    var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "one@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});
	    user.save((err, user) => {
                chai.request(server)
                .put('/api/users/')
                .send({
						"_id": user._id,
						"firstName": "Jane",
						"lastName": "Doe",
						"email": "woo@hoo.com",
						"screenName": "Joey",
						"password": "pass"
				})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('email').eql('woo@hoo.com');
                    res.body.should.have.property('screenName').eql('Joey');
                  done();
                });
          });
      });

	  it('it should GET a user give the screenName', (done) => {
	//Define a valid user document as before
		var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "one@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});
		user.save((err, user) => {
			chai.request(server)
				.get('/api/users/screenName/' + user.screenName)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('firstName');
					res.body.should.have.property('lastName');
					res.body.should.have.property('email');
					res.body.should.have.property('screenName');
					res.body.should.have.property('_id').eql(user._id.toString());
					done();
				});
				});
			});

it('it should DELETE a user given the id', (done) => {
        var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "five@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});
        user.save((err, user) => {
                chai.request(server)
                .delete('/api/users/' + user.id)
                .end((err, res) => {
						res.should.have.status(204);
						done();
                });
          });
      });

it('it should UPDATE a users follow array', (done) => {
	 //Define a valid user document as before
	 var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "one@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});
		user.save((err, user) => {
                		chai.request(server)
                		.put('/api/users/follow/' + user._id)
                		.send({
								"_id": "5804ec7fdde8d3035c9bfbcb"
							})
                		.end((err, res) => {					
                    		res.should.have.status(200);
                    		res.body.should.be.a('object');
                    		res.body.should.have.property('follow');
							res.body.follow.should.be.a('array');
							res.body.follow.length.should.be.eql(1);
                  			done();
                		});
						});
				});
			});

describe('User', () => {
	beforeEach((done) => { //Before each test we empty the database
		User.remove({}, (err) => {
			var user = new User({
				"firstName": "Sally",
				"lastName": "Jones",
				"email": "SallyJones@hoo.com",
				"screenName": "SoSo",
				"password": "pass"
			});
			user.save((err, user) => {
				 USER_ID = user._id;
				var chirp = Chirp({
					"chirp" : "This is a chirp",
					"chirpAuthor" : USER_ID
				});
				chirp.save((err, chirp) => {
					done();
				});
			});
		});
		});	


	it('it should GET a users followed chirps', (done) => {
        var user = new User({
		"firstName": "Jane",
		"lastName": "Doe",
		"email": "eight@hoo.com",
		"screenName": "JoJo",
		"password": "pass"
        });
        user.save((err, user) => {
		var NEW_USER_ID = user._id;
		var chirp = Chirp({
			"chirp": "This is another chirp",
			"chirpAuthor": user._id
		});
		chirp.save((err, chirp) => {
			chai.request(server)
							.put('/api/users/follow/' + NEW_USER_ID)
							.send({"_id": USER_ID })
		.end((err, res) => {					
					chai.request(server)
		.get('/api/users/followedChirps/' + NEW_USER_ID)
		.send(user)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(2);
				res.body[0].should.have.property('chirp');
				res.body[0].chirp.should.be.a('string');
				res.body[0].chirp.should.equal('This is another chirp'); 
				res.body[1].chirp.should.equal('This is a chirp'); 
				done();
			});
		});
			});
		});
	});
});
