// Firebase config
var firebaseConfig = {
    apiKey: "AIzaSyA72UIwOLf7K24WOek_EDTDHCetzErQOjY",
    authDomain: "cms-fe-training.firebaseapp.com",
    projectId: "cms-fe-training",
    storageBucket: "cms-fe-training.appspot.com",
    messagingSenderId: "830598915445",
    appId: "1:830598915445:web:f06a6a7dd2e8b7e60f1f3c",
    measurementId: "G-G0W8R847KE"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  
var db = firebase.firestore();

// Employee Class - represents an employee
class Employee {
    constructor(id, profileImage, firstName, lastName, gender, birthday, emailAddress) {
        this.id = id;
        this.profileImage = profileImage;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.birthday = birthday;
        this.emailAddress = emailAddress;
    }
    toString() {
        return this.id + ', ' + this.firstName + ', ' + this.lastName + ', ' + this.gender + ', '
            + this.birthday + ', ' + this.emailAddress;
    }
}

var employeeConverter = {
    toFirestore: function (employee) {
        return {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            gender: employee.gender,
            birthday: employee.birthday,
            emailAddress: employee.emailAddress
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new Employee(data.id, data.firstName, data.lastName, data.gender, data.birthday, data.emailAddress);
    }
};

// UI Class - handles the displaying of the data
class UI {
    static async displayEmployees() {
        const employees = await Store.getEmployees();

        employees.forEach((employee) => UI.addEmployeeToList(employee));
    }

    //adds a new table row
    static addEmployeeToList(employee) {
        const list = document.querySelector('#employee-list');

        const row = document.createElement('tr');
        row.innerHTML = `<td>${employee.id}</td>
        <td><img src="${employee.profileImage}" id="imgPreview" style="width: 100px; border-radius: 50%;"></td>
        <td>${employee.firstName}</td>
        <td>${employee.lastName}</td>
        <td>${employee.gender}</td>
        <td>${employee.birthday}</td>
        <td>${employee.emailAddress}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;  //delete button

        list.appendChild(row);
    }

    static deleteEmployee(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#employee-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#imgPreview').src = 'img/profile_picture.png';
        document.querySelector('#firstName').value = '';
        document.querySelector('#lastName').value = '';
        document.querySelector('#gender').value = 'Select one';
        document.querySelector('#birthday').value = 'dd/mm/yyyy';
        document.querySelector('#emailAddress').value = '';
    }
}


// Store Class - handles local storage
class Store {
    static async getEmployees() {
        const employees = [];
        // if (localStorage.getItem('employees') === null) {
        //     employees = [];
        // } else {
        //     employees = JSON.parse(localStorage.getItem('employees'));
        // }
        await db.collection('employees').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                employees.push(doc.data());
            });
        });
        return employees;
    }

    static addEmployee(employee) {
        // const employees = Store.getEmployees();
        // employees.push(employee);
        // localStorage.setItem('employees', JSON.stringify(employees));
        db.collection("employees").doc(employee.id.toString()).withConverter(employeeConverter).set(employee);
    }

    static removeEmployee(emailAddress) {
        // const employees = Store.getEmployees();

        // employees.forEach((employee, index) => {
        //     if (employee.emailAddress === emailAddress) {
        //         employees.splice(index, 1);
        //     }
        // });

        // localStorage.setItem('employees', JSON.stringify(employees));
    }
}

// Event: Display employees
document.addEventListener('DOMContentLoaded', UI.displayEmployees);

// Event: Add an employee
document.querySelector('#employee-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // get form inputs
    var docRef = db.collection('employees').doc();
    const id = docRef.id;
    const profileImage = document.querySelector('#imgPreview').src;
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const gender = document.querySelector('#gender').value;
    const birthday = document.querySelector('#birthday').value;
    const emailAddress = document.querySelector('#emailAddress').value;

    // Input validation
    if (firstName === '' || lastName === '' || emailAddress === '' || gender === 'Select one' || birthday === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instatiate employee
        const employee = new Employee(id, profileImage, firstName, lastName, gender, birthday, emailAddress);
        
        // Add Employee to UI
        UI.addEmployeeToList(employee);

        // Add Employee to localStorage
        Store.addEmployee(employee);
        
        UI.showAlert('Employee added!', 'success');
        
            
        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove an employee
document.querySelector('#employee-list').addEventListener('click', (e) => {
    UI.deleteEmployee(e.target);
    Store.removeEmployee(e.target.parentElement.previousElementSibling.textContent);
    console.log(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
    UI.showAlert('Employee Removed', 'success');
});

// Event: Image upload
document.querySelector('#profileImage').addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        localStorage.setItem("recent-image", reader.result);
        document.querySelector('#imgPreview').setAttribute("src", reader.result);
    });
    reader.readAsDataURL(this.files[0]);
});


 