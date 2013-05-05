var lib = require('../lib');

exports.lib = {
  "formatUserRecords": function(test) {
    // set up normal record
    var record = {
      "LastName":"Seles",
      "FirstName":"Monica",
      "MiddleInitial":"H",
      "Gender":"F",
      "DateOfBirth":"1973-12-02T00:00:00+00:00",
      "FavoriteColor":"Black"
    };
  
    // test normal case
    test.equal(lib.formatUserRecord(record), "Seles Monica Female 12/1/1973 Black", "valid record");
    
    // test empty values
    var emptyLastName = JSON.parse(JSON.stringify(record)); emptyLastName.LastName = "";
    test.equal(lib.formatUserRecord(emptyLastName), " Monica Female 12/1/1973 Black", "empty last name");
    
    var emptyFirstName = JSON.parse(JSON.stringify(record)); emptyFirstName.FirstName = "";
    test.equal(lib.formatUserRecord(emptyFirstName), "Seles  Female 12/1/1973 Black", "empty first name");

    var emptyGender = JSON.parse(JSON.stringify(record)); emptyGender.Gender = "";
    test.equal(lib.formatUserRecord(emptyGender), "Seles Monica  12/1/1973 Black", "empty gender");
    
    var emptyDOB = JSON.parse(JSON.stringify(record)); emptyDOB.DateOfBirth = "";
    test.equal(lib.formatUserRecord(emptyDOB), "Seles Monica Female  Black", "empty date of birth");
    
    var emptyFavoriteColor = JSON.parse(JSON.stringify(record)); emptyFavoriteColor.FavoriteColor = "";
    test.equal(lib.formatUserRecord(emptyFavoriteColor), "Seles Monica Female 12/1/1973 ", "empty favorite color");
    
    // test null values
    var nullLastName = JSON.parse(JSON.stringify(record)); nullLastName.LastName = null;
    test.equal(lib.formatUserRecord(nullLastName), " Monica Female 12/1/1973 Black", "null last name");
    
    var nullFirstName = JSON.parse(JSON.stringify(record)); nullFirstName.FirstName = null;
    test.equal(lib.formatUserRecord(nullFirstName), "Seles  Female 12/1/1973 Black", "null first name");

    var nullGender = JSON.parse(JSON.stringify(record)); nullGender.Gender = null;
    test.equal(lib.formatUserRecord(nullGender), "Seles Monica  12/1/1973 Black", "null gender");
    
    var nullDOB = JSON.parse(JSON.stringify(record)); nullDOB.DateOfBirth = null;
    test.equal(lib.formatUserRecord(nullDOB), "Seles Monica Female  Black", "null date of birth");
    
    var nullFavoriteColor = JSON.parse(JSON.stringify(record)); nullFavoriteColor.FavoriteColor = null;
    test.equal(lib.formatUserRecord(nullFavoriteColor), "Seles Monica Female 12/1/1973 ", "null favorite color");
    
    // test invalid values
    var invalidGender = JSON.parse(JSON.stringify(record)); invalidGender.Gender = "Foo";
    test.equal(lib.formatUserRecord(invalidGender), "Seles Monica  12/1/1973 Black", "invalid gender");
    
    var invalidDOB = JSON.parse(JSON.stringify(record)); invalidDOB.DateOfBirth = "Foo";
    test.equal(lib.formatUserRecord(invalidDOB), "Seles Monica Female  Black", "invalid date of birth");
    
    // test empty records
    test.equal(lib.formatUserRecord(), "", "no record");
    test.equal(lib.formatUserRecord(""), "", "empty string");
    test.equal(lib.formatUserRecord(null), "", "null record");
    test.equal(lib.formatUserRecord({}), "    ", "empty object");
    
    test.done();
  },
  
  "transformUserRecords": function(test) {
    // set up normal record
    var input = {
      "LastName":"Seles",
      "FirstName":"Monica",
      "MiddleInitial":"H",
      "Gender":"F",
      "DateOfBirth":"12/02/1973",
      "FavoriteColor":"Black"
    };
    var output = {
      "LastName":"Seles",
      "FirstName":"Monica",
      "MiddleInitial":"H",
      "Gender":"F",
      "DateOfBirth":"1973-12-02T00:00:00+00:00",
      "FavoriteColor":"Black"
    };
  
    // test valid record
    test.equal(JSON.stringify(output), JSON.stringify(lib.transformUserRecord(input, "M/D/YYYY")), "valid record");

    // test invalid record
    test.equal(null, lib.transformUserRecord(), "no record");
    test.equal(null, lib.transformUserRecord(""), "empty string");
    test.equal(null, lib.transformUserRecord({}), "emtpy object");
    test.equal(null, lib.transformUserRecord(null), "null record");

    var noLastName = JSON.parse(JSON.stringify(input)); noLastName.LastName = null;
    test.equal(null, lib.transformUserRecord(noLastName, "M/D/YYYY"), "no last name");
   
    // test DateOfBirth transforation
    var wrongDate = JSON.parse(JSON.stringify(input)); wrongDate.DateOfBirth = "foo";
    var emptyDate = JSON.parse(JSON.stringify(output)); emptyDate.DateOfBirth = "";
    test.equal(JSON.stringify(output), JSON.stringify(lib.transformUserRecord(input, "M/D/YYYY")), "right date, wrong format");
    test.equal(JSON.stringify(output), JSON.stringify(lib.transformUserRecord(input, "foo")), "right date, invalid format");
    test.equal(JSON.stringify(output), JSON.stringify(lib.transformUserRecord(input)), "right date, empty format");
    test.equal(JSON.stringify(emptyDate), JSON.stringify(lib.transformUserRecord(wrongDate, "M/D/YYYY")), "wrong date, right format");
    test.equal(JSON.stringify(emptyDate), JSON.stringify(lib.transformUserRecord(wrongDate, "M-D-YYYY")), "wrong date, wrong format");
    test.equal(JSON.stringify(emptyDate), JSON.stringify(lib.transformUserRecord(wrongDate, "foo")), "wrong date, invalid format");
    test.equal(JSON.stringify(emptyDate), JSON.stringify(lib.transformUserRecord(wrongDate)), "wrong date, empty format");
    
    // test Gender transformation
    var genderFullWordFemaleUC = JSON.parse(JSON.stringify(input)); genderFullWordFemaleUC.Gender = "Female";
    test.equal(JSON.stringify(output), JSON.stringify(lib.transformUserRecord(genderFullWordFemaleUC, "M/D/YYYY")), "Female converted to F");
    
    var genderFullWordFemaleLC = JSON.parse(JSON.stringify(input)); genderFullWordFemaleLC.Gender = "female";
    test.equal(JSON.stringify(output), JSON.stringify(lib.transformUserRecord(genderFullWordFemaleLC, "M/D/YYYY")), "female converted to F");
    
    var genderSingleLetterFemaleUC = JSON.parse(JSON.stringify(input)); genderSingleLetterFemaleUC.Gender = "F";
    test.equal(JSON.stringify(output), JSON.stringify(lib.transformUserRecord(genderSingleLetterFemaleUC, "M/D/YYYY")), "F converted to F");
    
    var genderSingleLetterFemaleLC = JSON.parse(JSON.stringify(input)); genderSingleLetterFemaleLC.Gender = "f";
    test.equal(JSON.stringify(output), JSON.stringify(lib.transformUserRecord(genderSingleLetterFemaleLC, "M/D/YYYY")), "f converted to F");

    var maleOutput = JSON.parse(JSON.stringify(output)); maleOutput.Gender = "M";
    var genderFullWordMaleUC = JSON.parse(JSON.stringify(input)); genderFullWordMaleUC.Gender = "Male";
    test.equal(JSON.stringify(maleOutput), JSON.stringify(lib.transformUserRecord(genderFullWordMaleUC, "M/D/YYYY")), "Male converted to M");
    
    var genderFullWordMaleLC = JSON.parse(JSON.stringify(input)); genderFullWordMaleLC.Gender = "male";
    test.equal(JSON.stringify(maleOutput), JSON.stringify(lib.transformUserRecord(genderFullWordMaleLC, "M/D/YYYY")), "male converted to M");
    
    var genderSingleLetterMaleUC = JSON.parse(JSON.stringify(input)); genderSingleLetterMaleUC.Gender = "M";
    test.equal(JSON.stringify(maleOutput), JSON.stringify(lib.transformUserRecord(genderSingleLetterMaleUC, "M/D/YYYY")), "M converted to M");
    
    var genderSingleLetterMaleLC = JSON.parse(JSON.stringify(input)); genderSingleLetterMaleLC.Gender = "m";
    test.equal(JSON.stringify(maleOutput), JSON.stringify(lib.transformUserRecord(genderSingleLetterMaleLC, "M/D/YYYY")), "m converted to M");
    
    var invalidGender = JSON.parse(JSON.stringify(input)); invalidGender.Gender = "foo";
    var emptyGender = JSON.parse(JSON.stringify(output)); emptyGender.Gender = "";
    test.equal(JSON.stringify(emptyGender), JSON.stringify(lib.transformUserRecord(invalidGender, "M/D/YYYY")), "invalid gender");
  
    test.done();
  },
  
  "determineInputFileConfiguration": function(test) {
    test.expect(5);
    
    // setup
    var fs = require('fs');
    var _readFile = fs.readFileSync;
    fs.readFileSync = function(path) {
        if(path == "comma.csv") return "Abercrombie, Neil, Male, Tan, 2/13/1943\nBishop, Timothy, Male, Yellow, 4/23/1967";
        else if(path == "pipe.txt") return "Smith | Steve | D | M | Red | 3-3-1985\nBonk | Radek | S | M | Green | 6-3-1975";
        else if(path == "space.txt") return "Kournikova Anna F F 6-3-1975 Red\nHingis Martina M F 4-2-1979 Green";
        else if(path == "empty.txt") return "";
        else if(path == "other.txt") return "Kournikova\tAnna\tF\tF\t6-3-1975\tRed\nHingis\tMartina\tM\tF\t4-2-1979\tGreen"
        else return "";
    };
  
    // test a CSV is recognized
    lib.determineInputFileConfiguration("comma.csv", function(delimiter, columns, dateFormat) {
      test.equal(",", delimiter);
    });
    
    // test a pipe-delimited file is recognized
    lib.determineInputFileConfiguration("pipe.txt", function(delimiter, columns, dateFormat) {
      test.equal("|", delimiter);
    });
    
    // test a space-delimited file is recongized
    lib.determineInputFileConfiguration("space.txt", function(delimiter, columns, dateFormat) {
      test.equal(" ", delimiter);
    });
    
    // test that an empty file is not recognized (expect null delimiter)
    lib.determineInputFileConfiguration("empty.txt", function(delimiter, columns, dateFormat) {
      test.strictEqual(null, delimiter);
    });
    
    // test that any other file is not recognized (expect null delimiter)
    lib.determineInputFileConfiguration("other.txt", function(delimiter, columns, dateFormat) {
      test.strictEqual(null, delimiter);
    });
    
    // tear down
    fs.readFile = _readFile;

    test.done();
  }
}