const mysql = require('mysql2')

function addEmployee(data){
    let queryString = `ADD ${data.name} TO employee.name`

    connection.query(queryString,function(err,results,field){

    })
}

module.exports = {}