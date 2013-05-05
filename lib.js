/* jslint node: true */
"use strict";

var config = require('./config'),
  moment = require('moment'),
  fs = require('fs'),
  inputFormats = config.input_formats || [],
  inputFormatsLength = config.input_formats.length;
  
module.exports = {
  /**
   * Formats a user record for display
   * @param object record The user record
   * @return string Formatted user record for display on the console
   */
  formatUserRecord: function(record) {
    if(!record || typeof record !== "object") {
      return "";
    }
  
    var lastName = record.LastName || "",
      firstName = record.FirstName || "",
      gender = (record.Gender && (record.Gender === "M" || record.Gender === "F")) ? (record.Gender === "M" ? "Male" : "Female") : "",
      dateOfBirth = (record.DateOfBirth && moment(record.DateOfBirth).isValid()) ? moment(record.DateOfBirth).format("M/D/YYYY") : "",
      favoriteColor = record.FavoriteColor || "";
    return lastName + ' ' + firstName + ' ' + gender + ' ' + dateOfBirth + ' ' + favoriteColor;
  },
  
  /**
   * Transforms a raw import record into a user object
   * @param object record Raw imported user record
   * @return object record Transformed user record
   */
  transformUserRecord: function(record, dateFormat) {
    // safely assume that if the record itself is an object and we have a LastName, that this is a valid record
    if(record && typeof record === "object" && record.LastName) {
      // make a copy of the original record
      var transformedRecord = JSON.parse(JSON.stringify(record));
      
      // transform the DOB to UTC format for consistant storage
      // due to the inconsistant way date parsing is handled, require either "M-D-YYYY" or "M/D/YYYY" as the date format; default to "M-D-YYYY"
      if(dateFormat !== "M-D-YYYY" || dateFormat !== "M/D/YYYY") {
        dateFormat = "M-D-YYYY";
      }
      transformedRecord.DateOfBirth = (record.DateOfBirth && moment.utc(record.DateOfBirth, dateFormat).isValid()) ? moment.utc(record.DateOfBirth, dateFormat).format() : '';
      
      // allowed genders are "Male", "Female", "M" or "F", convert all others to ""
      if (record.Gender && typeof record.Gender === "string") {
        var lcGender = transformedRecord.Gender.toLowerCase();
        if(lcGender === "male" || lcGender === "female" || lcGender === "m" || lcGender === "f") {
          transformedRecord.Gender   = lcGender.substr(0,1).toUpperCase();
        } else {
          transformedRecord.Gender = "";
        }
      } else {
        transformedRecord.Gender = "";
      }
      
      return transformedRecord;
     } else {
      return null;
    }
  },
  
  /**
   * Outputs a cursor object as a list in the console
   * @asyc
   * @param string listHeading Heading that should be output above the list
   * @param object cursor A cursor object who's objects should be displayed
   * @param function cb Callback method that will be called upon completion
   */
  outputQueryAsList: function(listHeading, cursor, cb) {
    var lib = this;
    var output = (listHeading || '') + ':\n';
    var stream = cursor.stream();
    stream.on("data", function(item) {
      output += lib.formatUserRecord(item) + '\n';
    });
    stream.on("end", function() {
      console.log(output);
      cb();
    });
  },
  
  /**
   * Determines the format of a file and returns the appropriate column configuration
   * @async
   * @param string filePath Full path to the file being opened
   * @param function cb Callback method which sends the file's configuration
   */
  determineInputFileConfiguration: function(filePath, cb) {
    // set the initial parameters to be returned
    var delimiter = null, columns = [], dateFormat = "";
    var contents = fs.readFileSync(filePath).toString();
    
    for(var i = 0; i < inputFormatsLength; i++) {
      var inputFormat = inputFormats[i];
      if(contents.indexOf(inputFormat.delimiter) !== -1) {
        delimiter = inputFormat.delimiter;
        columns = inputFormat.columns || [];
        dateFormat = inputFormat.dateFormat || "";
        break;
      }
    }
    
    return cb(delimiter, columns, dateFormat);
  },
}