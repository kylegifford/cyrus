/* jslint node: true */
"use strict";

// include the configuration and libraries
var config = require('./config'),
  input = require('./input'),
  lib = require('./lib'),
  MongoClient = require('mongodb').MongoClient;

// configure the DB connection string from the config
var connectionString = "mongodb://" +
   (config.database.username ? config.database.username + ":" + config.database.password + "@" : "") +
   config.database.server +
   (config.database.port ? ":" + config.database.port : "") +
   "/" +
   config.database.database;
   
// establish a database connection
MongoClient.connect(connectionString, function(err, db) {
  if(err) { return console.dir(err); }

  // define the collection and empty it
  var userCollection = db.collection(config.database.user_collection);
  userCollection.remove(function(err, result) {});
  
  // get the input from the file system
  input.inputFromFileSystem({
    "source_directory": (config.source_directory || './input_files')
   }, function addUserToDatabase(record, cb) {   
    // insert the normalized record into the database
    // console.log("found record: " + JSON.stringify(record));
    
    // ignore invalid records
    if(record.LastName) {
      userCollection.insert(record, function(err, result) {
        return cb();
      });
    } else {
      return cb();
    }
  }, function presentOutput(totalFiles, totalRecords) {
    console.log("Processed " + totalFiles + " files containing " + totalRecords + " records.\n");
    lib.outputQueryAsList("Output 1", userCollection.find({}, {"sort": [["Gender", "asc"], ["LastName", "asc"]]}), function output2() {
      lib.outputQueryAsList("Output 2", userCollection.find({}, {"sort": "DateOfBirth"}), function output3() {
        lib.outputQueryAsList("Output 3", userCollection.find({}, {"sort": [["LastName", "desc"]]}), function() {
          return db.close();
        });
      });
    });
  });
});