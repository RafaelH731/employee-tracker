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

  //connect or show error
  connection.connect((err) => {
    if (err) throw err;
  
    startApp();
  });
  

  function startApp() {
    inquirer
    .prompt({
      name: "selection",
      type: "list",
      message: "What would you like to do? Please select from options below.",
      choices: 
        [
            "View all Departments",
            "View all Roles",
            "View all Employees", 
            "Add Department",
            "Add a Role",
            "Add an Employee", 
            "Update Employee Role",
        ]
    })
    .then(function(answer) {
        console.log(answer);
      
      if (answer.selection === "View All Departments") {
        viewAllDepartments();
      }
      else if(answer.selection === "View all Roles") {
        viewAllRoles();
  
      } 
      else if(answer.selection === "View all Employees") {
        viewAllEmployees();
  
      }
      else if(answer.selection === "Add Department") {
        addDepartment();
  
      }
      else if(answer.selection === "Add a Role") {
        addRole();
  
      }
      else if(answer.selection === "Add an Employee") {
        addEmployee();
  
      }
      else if(answer.selection === "Update Employee Role") {
        updateEmployeeRole();
  
      }else{
        connection.end();
      }
    });
  }

  //view all departments function
  function viewAllDepartments() {
    connection.query("SELECT * FROM department", function(err, result, fields) {
        if (err) throw err;
        console.table(result);
        // re-prompt the user for another selection
        startApp();
      }
    ); 
};