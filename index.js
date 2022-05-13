//dependecies
var mysql = require("mysql");
var inquirer = require("inquirer");

//creates connection
var connection = mysql.createConnection({

    host: "localhost",
    // port
    port: 3306,
    // username
    user: "root",
    // password
    password: "Stronglion9*",
    database: "employee_tracker"
  });

  connection.connect((err) => {
    if (err) throw err;
  
    startApp();
  });
  

  function startApp() {

  }