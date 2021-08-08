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

    static deleteEmployee(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#firstName').value = '';
        document.querySelector('#lastName').value = '';
        document.querySelector('#emailAddress').value = '';
    }
}


// Store Class - handles local storage

// Event: Display employees
document.addEventListener('DOMContentLoaded', UI.displayEmployees);

// Event: Add an employee
document.querySelector('#employee-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // get form inputs
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const emailAddress = document.querySelector('#emailAddress').value;

    // Instatiate employee
    const employee = new Employee(firstName, lastName, emailAddress);
    
    // Add Employee to UI
    UI.addEmployeeToList(employee);

    // Clear fields
    UI.clearFields();
});

// Event: Remove an employee
document.querySelector('#employee-list').addEventListener('click', (e) => {
    UI.deleteEmployee(e.target)
});
 