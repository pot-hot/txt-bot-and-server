/*
 *  mongoDB data-backend
 *  Handles the communication with a mongoDB database
 */

//@TODO configure config path

//Dependencies
const config = require('../../config.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Connect to the db
mongoose.connect(config["mongodb-url"], {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
var con = mongoose.connection;

//Gets called when there is an error connecting to the db
con.on('error', function() {
  console.log('Error connecting to database');
});

//Gets called when the connection to the db succeeds
con.on('open', function() {
  console.log('Sucessfully connected to database');
  db = con;
});

//Create the container
const main = {};

//Stores a new entry
main.new = function(input, type, options, callback) {
  //Get our current model
  let model = models[type];
  let document = new model(input);
  document.save(function(err, doc){
    if(!err && doc){
      callback(false, doc);
    }else{
      callback(err, false);
    }
  });
};

//Edits one existing entry
main.edit = function(input, type, options, callback) {
  let filter = false;
  filter = input.hasOwnProperty('_id') ? {_id: input._id} : filter;
  filter = input.hasOwnProperty('id') ? {id : input.id} : filter;
  filter = input.hasOwnProperty('discord') ? {discord: input.discord} : filter;
  filter = input.hasOwnProperty('discord_id') ? {discord_id: input.discord_id} : filter;

  if(filter){
    //Get our current model
    let model = models[type];
    model.findOneAndUpdate(filter, input, function(err, doc){
      if(!err && doc){
        callback(false, doc);
      }else{
        callback(err, false);
      }
    });
  }else{
    callback('Couldnt find the object to modify in the database', false);
  }
};

//Gets multiple existing entries
main.get = function(filter, type, options, callback) {
  //Get our current model
  let model = models[type];
  model.find(filter, {}, {}, function(err, docs){
    if(!err && docs){
      callback(false, docs);
    }else{
      callback(err, false);
    }
  });
};

//Deletes one existing entry
main.delete = function(filter, type, options, callback) {
  //Get our current model
  let model = models[type];
  model.deleteMany(filter, function(err){
    if(!err){
      callback(false);
    }else{
      callback(true);
    }
  });
};

//Set up the application schema
var applicationSchema = new Schema({
  id: {
    type: Number,
    index: true,
    unique: true,
    default: 0
  },
  timestamp: Date,
  mc_uuid: String,
  discord_id: String,
  email_address: String,
  country: String,
  birth_month: Number,
  birth_year: Number,
  about_me: String,
  motivation: String,
  build_images: String,
  publish_about_me: Boolean,
  publish_age: Boolean,
  publish_country: Boolean,
  status: {
    type: Number,
    default: 1         //1 = pending review; 2 = denied; 3 = accepted
  },
  deny_reason: String,
  testing: {
    type: Boolean,
    default: false
  }
});

//Code from stackoverflow to increment the counter id
applicationSchema.pre('save', function(next) {
  // Only increment when the document is new
  if(this.isNew) {
    applicationModel.count().then(res => {
      this.id = res; // Increment count
      next();
    });
  } else {
    next();
  }
});

//Set up the model
var applicationModel = mongoose.model('applications', applicationSchema);

//Container for all database models
const models = {
  'application': applicationModel
};

//Export the container
module.exports = main;