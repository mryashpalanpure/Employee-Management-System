const form = document.querySelector('#employeeForm')
const reset = document.querySelector('#reset')

let rowToDelete = null;
let editingRow = null;

function checkName() {
    const name = document.querySelector('#name')
    const para = document.querySelector('#name-para')
    const Namecheck = name.value.trim()

    para.textContent = ""

    if (Namecheck === "") {
        para.textContent = "Please enter your name";
        para.style.color = 'red';
        name.focus();
        return false;
    }
    if (!/^[a-zA-Z ]*$/.test(Namecheck)) {
        para.textContent = "Please enter valid name only letter or space allowed";
        para.style.color = 'red';
        name.focus();
        return false;
    }
    else {
        console.log(`Your name is ${Namecheck}`);
        return true;
    }
}

function checkMobileNumber() {
    const mobileNumber = document.querySelector('#mobile')
    const checkNumber = mobileNumber.value.trim()
    const para = document.querySelector('#number-para')

    para.textContent = ""

    if (checkNumber === "") {
        para.textContent = 'Please enter your mobile number';
        para.style.color = 'red';
        mobileNumber.focus();
        return false;
    }
    if (!/^\d{10}$/.test(checkNumber)) {
        para.textContent = 'Please enter only digits or 10 digit mobile number';
        para.style.color = 'red';
        mobileNumber.focus();
        return false;
    }
    console.log(`Your mobile number is ${checkNumber}`);
    return true;
}


function checkEmail() {
    const email = document.querySelector('#email');
    const para = document.querySelector('#email-para')
    const Emailcheck = email.value.trim();

    para.textContent = ""

    if (Emailcheck === "") {
        para.textContent = 'Please enter your email id';
        para.style.color = 'red';
        email.focus();
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Emailcheck)) {
        para.textContent = 'Please enter a valid email id';
        para.style.color = 'red';
        email.focus();
        return false;
    }

    console.log(`Your email is ${Emailcheck}`);
    return true;
}


function checkAddress() {
    const address = document.querySelector('#address')
    const para = document.querySelector('#addr-para')
    const checkadd = address.value.trim()

    para.textContent = ""

    if (checkadd === "") {
        para.textContent = 'Please enter your address';
        para.style.color = 'red';
        address.focus();
        return false;
    }
    console.log(`Your address is ${checkadd}`);
    return true;
}

function checkDesignation() {
    const design = document.querySelector('#designation')
    const para = document.querySelector('#designation-para')
    const checkDesign = design.value.trim();

    para.textContent = ""

    if (checkDesign === "") {
        para.textContent = 'Select your designation';
        para.style.color = 'red';
        design.focus();
        return false;
    }
    console.log(`Your designation is ${checkDesign}`);
    return true;
}

function checkGender() {
    const gender = document.querySelector('input[name="gender"]:checked');
    const para = document.querySelector('#gender-para')

    para.textContent = ""

    if (!gender) {
        para.textContent = 'Please select your gender';
        para.style.color = 'red';
        document.querySelector('input[name="gender"]').focus();
        return false;
    }
    console.log(`Your gender is ${gender.value}`);
    return true;
}

function checkHobby() {
    const hobby = document.querySelectorAll('input[name="hobby"]:checked')
    const para = document.querySelector('#hobby-para')

    para.textContent = ""

    let hobbies = []

    if (hobby.length === 0) {
        para.textContent = 'Please select your hobby';
        para.style.color = 'red';
        document.querySelector('input[name="hobby"]').focus();
        return false;
    }
    else {
        for (const element of hobby) {
            hobbies.push(element.value)
        }
        console.log(`Your hobbies is ${hobbies}`);
        return true;
    }
}

function getEmployeeData() {
    return {
        name: document.querySelector('#name').value,
        mobile: document.querySelector('#mobile').value,
        email: document.querySelector('#email').value,
        address: document.querySelector('#address').value,
        designation: document.querySelector('#designation').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        hobbies: Array.from(
            document.querySelectorAll('input[name="hobby"]:checked')
        ).map(h => h.value).join(', ')
    };
}


function addEmployeeToTable(employee) {
    const tbody = document.querySelector('#employeeTable tbody');
    const row = document.createElement('tr')

    row.innerHTML = `
    <td>${employee.name}</td>
    <td>${employee.mobile}</td>
    <td>${employee.email}</td>
    <td>${employee.address}</td>
    <td>${employee.designation}</td>
    <td>${employee.gender}</td>
    <td>${employee.hobbies}</td>
     <td>
            <button class="btn edit-btn" onclick="editDetail(this)">Edit</button>
            <button class="btn delete-btn" onclick="deleteDetail(this)">Delete</button>
        </td>
    `;

    tbody.appendChild(row)
}


function deleteDetail(btn) {
    rowToDelete = btn.closest('tr');
    document.getElementById('deleteModal').classList.remove('hidden');
}

document.getElementById('confirmDelete').addEventListener('click', function () {
    if (rowToDelete) {
        rowToDelete.remove();
        rowToDelete = null;
    }
    saveEmployeeToStorage();
    closeDeleteModal();
});

document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal)

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
}

function editDetail(btn) {
    editingRow = btn.closest('tr');
    const cells = editingRow.children;

    document.querySelector('#name').value = cells[0].innerText;
    document.querySelector('#mobile').value = cells[1].innerText;
    document.querySelector('#email').value = cells[2].innerText;
    document.querySelector('#address').value = cells[3].innerText;
    document.querySelector('#designation').value = cells[4].innerText;

    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.checked = radio.value === cells[5].innerText;
    });

    document.querySelectorAll('input[name="hobby"]').forEach(cb => cb.checked = false);
    const hobbyValues = cells[6].innerText.split(', ');
    hobbyValues.forEach(val => {
        const checkbox = document.querySelector(
            `input[name="hobby"][value="${val.trim()}"]`
        );
        if (checkbox) checkbox.checked = true;
    });

    document.querySelector('#name').focus();

    document.querySelector('.submit-btn').innerText = 'Update Employee';
}

function saveEmployeeToStorage(){
    const rows = document.querySelectorAll('#employeeTable tbody tr');
    const employee = [];

    rows.forEach(row => {
        const cells = row.children;
        employee.push({
            name:cells[0].innerText,
            mobile:cells[1].innerText,
            email:cells[2].innerText,
            address:cells[3].innerText,
            designation:cells[4].innerText,
            gender:cells[5].innerText,
            hobbies:cells[6].innerText,
        });
    });

    sessionStorage.setItem('employee',JSON.stringify(employee));
}

function loadEmployeesFromStorage(){
    const data = JSON.parse(sessionStorage.getItem('employee')) || [];

    data.forEach(emp => addEmployeeToTable(emp));
}

window.addEventListener('DOMContentLoaded',loadEmployeesFromStorage);


form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (
        checkName() &&
        checkMobileNumber() &&
        checkEmail() &&
        checkAddress() &&
        checkDesignation() &&
        checkGender() &&
        checkHobby()
    ) {
        const employee = getEmployeeData();

        if (editingRow) {
            editingRow.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.mobile}</td>
                <td>${employee.email}</td>
                <td>${employee.address}</td>
                <td>${employee.designation}</td>
                <td>${employee.gender}</td>
                <td>${employee.hobbies}</td>
                <td>
                    <button class="btn edit-btn" onclick="editDetail(this)">Edit</button>
                    <button class="btn delete-btn" onclick="deleteDetail(this)">Delete</button>
                </td>
            `;
            editingRow = null;
            saveEmployeeToStorage();
            document.querySelector('.submit-btn').innerText = 'Add Employee';
        } else {
            addEmployeeToTable(employee);
            saveEmployeeToStorage();
        }

        form.reset();
        clearMessages();
    }
});

function clearMessages() {
    document.querySelectorAll('p').forEach(p => p.textContent = '');
    document
        .querySelectorAll('input[type="radio"], input[type="checkbox"]')
        .forEach(el => el.checked = false);
}


reset.addEventListener('click', function () {
    form.reset();
    editingRow = null;
    document.querySelector('.submit-btn').innerText = 'Add Employee';

    document.querySelectorAll('p').forEach(p => p.textContent = '');
});
