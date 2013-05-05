var config = {
  "database": {
    "server": "localhost",
    "port": "27017",
    "username": "",
    "password": "",
    "database": "cyrus",
    "user_collection": "users"
  },
  "source_directory": "./input_files",
  "input_formats": [{
    "name": "CSV",
    "delimiter": ",",
    "columns": ['LastName', 'FirstName', 'Gender', 'FavoriteColor', 'DateOfBirth'],
    "dateFormat": "M/D/YYYY"      
  },{
    "name": "Pipe-delimited",
    "delimiter": "|",
    "columns": ['LastName', 'FirstName', 'MiddleInitial', 'Gender', 'FavoriteColor', 'DateOfBirth'],
    "dateFormat": "M-D-YYYY"      
  },{
    "name": "Space-delimited",
    "delimiter": " ",
    "columns": ['LastName', 'FirstName', 'MiddleInitial', 'Gender', 'DateOfBirth', 'FavoriteColor'],
    "dateFormat": "M-D-YYYY"
  }]
}

module.exports = config;