//dependecies
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");


//creates connection
var connection = mysql.createConnection({

    host: "localhost",
    // port
    port: 3306,
    // username
    user: "root",
    // password
    password: "Stronglion9*",
    database: "employees"
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
      
      if (answer.selection === "View all Departments") {
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
      
    connection.query("SELECT * FROM department", function(err, results, fields) {
        if (err) throw err;
        console.table(results);
        // prompt for next selection
        startApp();
      }
    ); 
};

//view all roles function
function viewAllRoles() {
    connection.query("SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name FROM role LEFT JOIN department on role.department_id = department.id",
    function(err, result, fields) {
       if (err) throw err;
       console.table(result);
       // prompt for next selection
       startApp();
     }
    ); 
};

//view all employees function
function viewAllEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.id, department.id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id", 
      function(err, result, fields) {
        if (err) throw err;
        console.table('this is the result',result);
         // prompt for next selection
        startApp();
      }
    );
  };

  //empty arrays yo push data into
  var departmentChoices = [];
  var roleChoices = [];
  var employeeChoices = [];

  //function to look up departments
  function searchDepartments(){
    connection.query("SELECT * FROM department", function (err, data) {
      if (err) throw err;
      for (i = 0; i < data.length; i++) {
          departmentChoices.push(data[i].id + "-" + data[i].name)
      }
    })
    }

//function to look up roles
function searchRole(){  
  
    connection.query("SELECT * FROM role", function (err, data) {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
            roleChoices.push(data[i].id + "-" + data[i].title)
        }
     })
    }

//look up employees
function searchEmployees(){  
    connection.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;
        for (i = 0; i < data.length; i++) {
            employeeChoices.push(data[i].id + "-" + data[i].first_name+" "+ data[i].last_name)
        }
    }) 
   }

//function to add department
function addDepartment() {

    searchRole()
    searchEmployees()
    searchDepartments()
    
    inquirer.prompt([
    {
      name: "dept",
      type: "input",
      message: "Enter the department you would like to add:"
    }
    ]).then(function(answer) {
      var query = `INSERT INTO department (name)
       VALUES ('${answer.dept}')`;
      connection.query(query, function(err, res) {
      });
      startApp();
    });
    };
//function to add a role
function addRole() {

    searchRole()
    searchEmployees()
    searchDepartments()
    
    inquirer.prompt([
    {
      name: "role",
      type: "input",
      message: "Enter the role you would like to add:"
    },
    
    {
        name: "dept",
        type: "list",
        message: "In what department would you like to add this role?",
        choices: departmentChoices
    },
    
    {
      name: "salary",
      type: "number",
      message: "Enter the role's salary:"
    },
    
     ]).then(function(answer) {
       console.log(`${answer.role}`)
      var getDepartmentId =answer.dept.split("-")
      var query = 
      `INSERT INTO role (title, salary, department_id)
       VALUES ('${answer.role}','${answer.salary}','${getDepartmentId[0]}')`;
      connection.query(query, function(err, res) {
      });
      startApp();
    });
    };
//function to add employee
function addEmployee() {

    searchRole()
    searchEmployees()
  
    inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "What is the employee's first name?"
    },
  
    {
        name: "lastname",
        type: "input",
        message: "What is the employee's last name?"
    },
  
    {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: roleChoices 
      },
  
      {
        name: "reportingTo",
        type: "list",
        message: "Who is the employee's manager?",
        choices: employeeChoices
      }
    
     ]).then(function(answer) {
      var getRoleId =answer.role.split("-")
      var reportingId=answer.reportingTo.split("-")
      var query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
       VALUES ('${answer.firstname}','${answer.lastname}','${getRoleId[0]}','${reportingId[0]}')`;
      connection.query(query, function(err, res) {
      });
      startApp();
    });
  };
//updates employeerole
function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', function (err, result) {
      if (err) throw (err);
      inquirer
      //pompt to choose which employee to change
        .prompt([
          {
            name: "employeeName",
            type: "list",
            message: "Which employee's role is changing?",
            choices: function () {
              var updatedArray = [];
              result.forEach(result => {
                updatedArray.push(
                  result.last_name
                );
              })
              return updatedArray;
            }
          }
        ])
     //prompt to enter new role
        .then(function (response) {
          const name = response.employeeName;
          connection.query("SELECT * FROM role", function (err, res) {
            inquirer
              .prompt([
                {
                  name: "role",
                  type: "list",
                  message: "What is their new role?",
                  choices: function () {
                    var newRoleArray = [];
                    res.forEach(res => {
                      newRoleArray.push(
                        res.title)
                    })
                    return newRoleArray;
                  }
                }
                
              ]).then(function (roleResponse) {
                const role = roleResponse.role;
                connection.query('SELECT * FROM role WHERE title = ?', [role], function (err, res) {
                  if (err) throw (err);
                  let roleId = res[0].id;
     
                  let query = "UPDATE employee SET role_id = ? WHERE last_name =  ?";
                  let values = [parseInt(roleId), name]
          
                  connection.query(query, values,
                    function (err, res, fields) {
                      console.log(`You have updated ${name}'s role to ${role}.`)
                    })

                  viewAllEmployees();
                })
              })
          })
        })
    })
    };