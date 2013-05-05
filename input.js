/* jslint node: true */
"use strict";

var lib = require('./lib');

module.exports = {
  /**
   * Gets input from the file system, parses each file
   * @async
   * @param object options Required options
   * @param function onDataCallback Callback function that will be called on each data record
   * @param function onEndCallback Callback function that will be called afte all files are parsed
   */
  "inputFromFileSystem": function(options, onDataCallback, onEndCallback) {
    // hook up required libraries
    var csv = require('csv'),
      walk = require('walk');
      
    // initial variable initialization
    var files = [],
      totalFiles = 0,
      totalRecords = 0,
      completedFiles = 0,
      completedRecords = 0;

    // Configure the Walker
    var walker  = walk.walk(options.source_directory, { followLinks: false });

    // Open each file found and try to parse it
    walker.on('file', function(root, stat, next) {
      // add one to our total number of files
      var filename = root + '/' + stat.name;
      // console.log("Processing file " + filename);
      totalFiles++;

      // Add this file to the list of files
      files.push(filename);

      // Identify the type of file
      lib.determineInputFileConfiguration(filename, function(delimiter, columns, dateFormat) {
        // If the format couldn't be identified, we should break and return
        if(delimiter === null) {
          // console.log("No valid format identified for file " + filename);
          completedFiles++;
          next();
        } else {
          // Parse it!
          csv()
          // set the source file as the file found, and set the options using the identified type
          .from(filename)
          .from.options({
            'delimiter': delimiter,
            'trim': true,
            'columns': columns
          })
          // normalize all the data
          .transform(function(row, index) {
            return lib.transformUserRecord(row, dateFormat);
          })
          // process each record
          .on('record', function(row, index) {
            // increment the count of total records processed
            totalRecords++;
            
            onDataCallback(row, function() {
              // increment the count of records successfully processed
              completedRecords++;
              if(completedFiles === totalFiles && completedRecords === totalRecords) {
                return onEndCallback(totalFiles, totalRecords);
              }
            });
          })
          .on('end', function(count) {
            completedFiles++;        
            if(completedFiles === totalFiles && completedRecords === totalRecords) {
              return onEndCallback(totalFiles, totalRecords);
            }
          })
          .on('error', function(error) {
            completedFiles++;
            console.log(error.message);
          });        
        }
      });

      // Move on to the next file
      next();
    });

    // when we're done checking the source directory, if no files are found, close the database and return
    walker.on('end', function() {
      if(files.length === 0) {
        return onEndCallback(0, 0);
      }
    });  
  }
}