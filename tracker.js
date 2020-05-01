const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "@rTyF1986",
    database: "employee_trackerDB"
});

connection.connect(err => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add department",
                "Add role",
                "Add employee",
                "View departments",
                "View roles",
                "View employees",
                "Update employee role",
                "Delete employee",
                "EXIT"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "Add department":
                    addDepartment();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "View departments":
                    viewDepartments();
                    break;
                case "View roles":
                    viewRoles();
                    break;
                case "View employees":
                    viewEmployees();
                    break;
                case "Update employee role":
                    updateRoles();
                    break;
                case "Delete employee":
                    deleteEmployee();
                default:
                    connection.end();
                    break;
            }
        })

}

function addDepartment() {
    // loadDepartment();
    inquirer
        .prompt({
            name: "departmentName",
            type: "input",
            message: "What kind of department would you like to create?"
        }).then(function (answer) {
            connection.query("INSERT INTO department SET ?",
                {
                    name: answer.departmentName,
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your department was created!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );

        })
}

function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What title would you like to add?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is the starting salary?"
            },
            {
                name: "departmentID",
                type: "input",
                message: "What is the department ID?"
            }
        ]).then(function (answer) {
            connection.query("INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentID
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your role was created!!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );

        })
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is your first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is your last name?"
            },
            {
                name: "roleID",
                type: "input",
                message: "What is your role ID?"
            },
            {
                name: "managerID",
                type: "input",
                message: "What is your manager's ID?"
            }
        ]).then(function (answer) {
            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleID,
                    manager_id: answer.managerID
                },
                function (err) {
                    if (err) throw err;
                    console.log("Employee was created!!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );

        })
}



function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
}

function updateRoles() {
    inquirer
        .prompt([
            
            {
                name: "roleUpdate",
                type: "input",
                message: "What role ID would you like to assign?"

            },
            {
                name: "currentRole",
                type: "input",
                message: "What is the ID number of the employee to update?"

            }
           
        ]).then(function (answer) {
                var query = "UPDATE employee SET role_id = ? WHERE role_id = ?";
                connection.query(query, [answer.roleUpdate, answer.currentRole], function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    start();
                })

            })

}

function deleteEmployee() {
    inquirer
        .prompt([{
            name: "roleID",
            type: "input",
            message: "What is the employee's role ID?"
        }
        ]).then(function(answer) {

            var query = "DELETE FROM employee WHERE role_id = ?";

            console.log(answer.roleID);

            connection.query(query, function (err, results) {
                if (err) throw err;
                console.table(results);
                start();
            }
            )
        })
}

