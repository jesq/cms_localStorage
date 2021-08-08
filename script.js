// Employee Class - represents an employee
class Employee {
    constructor(firstName, lastName, emailAddress) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
    }
}

// UI Class - handles the displaying of the data
class UI {
    static displayEmployees() {
        const StoredEmployees = [
            {
                firstName: 'Cosmin',
                lastName: 'Jescu',
                emailAddress: 'jescucosmin99@gmail.com'
            },
            {
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'johndoe@gmail.com'
            }
        ];
        const employees = StoredEmployees;

        employees.forEach((employee) => UI.addEmployeeToList(employee));
    }

    //adds a new table row
    static addEmployeeToList(employee) {
        const list = document.querySelector('#employee-list');

        const row = document.createElement('tr');
        row.innerHTML = `<td>${employee.firstName}</td>
        <td>${employee.lastName}</td>
        <td>${employee.emailAddress}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;  //delete button

        list.appendChild(row);
    }
}


// Store Class - handles local storage

// Event: Display employees

// Event: Add an employee

// Event: Remove an employee