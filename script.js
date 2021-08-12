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
var selectedRow = null

// Employee Class - represents an employee
class Employee {
    constructor(id, profileImage, firstName, lastName, gender, birthday, emailAddress, timeCreated) {
        this.id = id;
        this.profileImage = profileImage;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.birthday = birthday;
        this.emailAddress = emailAddress;
        this.timeCreated = timeCreated;
    }
    toString() {
        return this.id + ', ' + this.profileImage + ', ' + this.firstName + ', '
            + this.lastName + ', ' + this.gender + ', '
            + this.birthday + ', ' + this.emailAddress + ', ' + this.timeCreated;
    }
}

var employeeConverter = {
    toFirestore: function (employee) {
        return {
            id: employee.id,
            profileImage: employee.profileImage,
            firstName: employee.firstName,
            lastName: employee.lastName,
            gender: employee.gender,
            birthday: employee.birthday,
            emailAddress: employee.emailAddress,
            timeCreated: employee.timeCreated
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new Employee(data.id, data.profileImage, data.firstName, data.lastName,
            data.gender, data.birthday, data.emailAddress, data.timeCreated);
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
        <td><img class = "rounded-circle" src="${employee.profileImage}" style="width: 100px; height: 100px;"></td>
        <td>${employee.firstName}</td>
        <td>${employee.lastName}</td>
        <td>${employee.gender}</td>
        <td>${employee.birthday}</td>
        <td>${employee.emailAddress}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">DELETE</a></td>
        <td><a href="#" class="btn btn-primary btn-sm edit">EDIT</a></td>`

        list.appendChild(row);
    }

    static deleteEmployee(target) {
        target.parentElement.parentElement.remove();
    }

    static updateEmployee() {
        console.log(selectedRow.cells[1].innerHTML);
        selectedRow.cells[1].innerHTML = `<img class = "rounded-circle" src="${document.getElementById("imgPreview").src}" 
        style="width: 100px; height: 100px;">`
        selectedRow.cells[2].innerHTML = document.getElementById("firstName").value;
        selectedRow.cells[3].innerHTML = document.getElementById("lastName").value;
        selectedRow.cells[4].innerHTML = document.getElementById("gender").value;
        selectedRow.cells[5].innerHTML = document.getElementById("birthday").value;
        selectedRow.cells[6].innerHTML = document.getElementById("emailAddress").value;
        UI.clearFields();
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
        document.querySelector('#imgPreview').src = 'img/default_image.png';
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
        await db.collection('employees').orderBy("timeCreated", "desc").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
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

    static async updateEmployee() {
        var employeeRef = db.collection('employees').doc(selectedRow.cells[0].innerHTML);
        await employeeRef.set({
            firstName: document.querySelector('#firstName').value,
            lastName: document.querySelector('#lastName').value,
            gender: document.querySelector('#gender').value,
            birthday: document.querySelector('#birthday').value,
            profileImage: document.querySelector('#imgPreview').src,
            emailAddress: document.querySelector('#emailAddress').value
        }, { merge: true });
        document.querySelector('#submitBtn').value = "Add Employee";
        UI.showAlert('Edit successful!', 'success');
        UI.updateEmployee();
        selectedRow = null;
    }

    static removeEmployee(id) {
        // const employees = Store.getEmployees();

        // employees.forEach((employee, index) => {
        //     if (employee.emailAddress === emailAddress) {
        //         employees.splice(index, 1);
        //     }
        // });

        // localStorage.setItem('employees', JSON.stringify(employees));
        db.collection('employees').doc(id).delete();
    }
}

// Event: Display employees
// document.addEventListener('DOMContentLoaded', UI.displayEmployees);

// Event: Add or EDIT an employee
document.querySelector('#employee-form').addEventListener('submit', (e) => {
    e.preventDefault();

    if (selectedRow == null) {
            // get form inputs
        var docRef = db.collection('employees').doc();
        const id = docRef.id;
        const profileImage = document.querySelector('#imgPreview').src;
        const firstName = document.querySelector('#firstName').value;
        const lastName = document.querySelector('#lastName').value;
        const gender = document.querySelector('#gender').value;
        const birthday = document.querySelector('#birthday').value;
        const emailAddress = document.querySelector('#emailAddress').value;
        const timeCreated = Date.now();

        // Input validation
        if (firstName === '' || lastName === '' || emailAddress === '' || gender === 'Select one' || birthday === '') {
            UI.showAlert('Please fill in all fields', 'danger');
        } else {
            // Instatiate employee
            const employee = new Employee(id, profileImage, firstName, lastName, gender, birthday, emailAddress, timeCreated);
            
            // Add Employee to UI
            // UI.addEmployeeToList(employee);

            // Add Employee to localStorage
            Store.addEmployee(employee);
            
            UI.showAlert('Employee added!', 'success');
            
                
            // Clear fields
            UI.clearFields();
        }
    } else {
        Store.updateEmployee();
    }
    
});

// Event: Remove or edit an employee
document.querySelector('#employee-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
        // UI.deleteEmployee(e.target);
        Store.removeEmployee(e.target.parentElement.previousElementSibling.previousElementSibling.
            previousElementSibling.previousElementSibling.previousElementSibling.
            previousElementSibling.previousElementSibling.textContent);
        UI.showAlert('Employee Removed', 'success');
    } else if (e.target.classList.contains('edit')) {
        selectedRow = e.target.parentElement.parentElement;
        document.getElementById("firstName").value = selectedRow.cells[2].innerHTML;
        document.getElementById("lastName").value = selectedRow.cells[3].innerHTML;
        document.getElementById("gender").value = selectedRow.cells[4].innerHTML;
        document.getElementById("birthday").value = selectedRow.cells[5].innerHTML;
        document.getElementById("emailAddress").value = selectedRow.cells[6].innerHTML;
        db.collection('employees').doc(selectedRow.cells[0].innerHTML).get().then((doc) => {
            document.getElementById("imgPreview").src = doc.get("profileImage");
        });
        document.getElementById("submitBtn").value = "Edit Employee";
    }
});


// Event: refresh table after add / delete / edit

db.collection('employees').onSnapshot((snapshot) => {
    document.getElementById('employee-list').innerHTML = '';
    UI.displayEmployees();
});

// document.querySelector('#submitBtn').addEventListener('click', (e) => {
//     document.getElementById('employee-list').innerHTML = '';
//     UI.displayEmployees();
// });

   

// Event: Image upload
document.querySelector('#profileImage').addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        localStorage.setItem("recent-image", reader.result);
        document.querySelector('#imgPreview').setAttribute("src", reader.result);
    });
    reader.readAsDataURL(this.files[0]);
});

document.querySelector('#genderFemaleFilter').addEventListener("click", function () {
    console.log("female");
});

 