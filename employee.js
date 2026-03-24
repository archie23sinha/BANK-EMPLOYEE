function validateEmployee() {
    let empid = document.getElementById("empid").value.trim();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let department = document.getElementById("department").value.trim();
    let position = document.getElementById("position").value.trim();
    let contact = document.getElementById("contact").value.trim();

    // Employee ID 9 digits
    if (!/^\d{9}$/.test(empid)) {
        alert("Employee ID must be exactly 9 digits");
        return false;
    }

    // Name max 50 chars alphabets
    if (!/^[A-Za-z ]{1,50}$/.test(name)) {
        alert("Name max 50 chars, alphabets only");
        return false;
    }

    // Email
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("Invalid email");
        return false;
    }

    // Password max 30, min 6
    if (password.length < 6 || password.length > 30) {
        alert("Password 6-30 chars");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords don't match");
        return false;
    }

    // Department max 50
    if (department.length === 0 || department.length > 50) {
        alert("Department max 50 chars");
        return false;
    }

    // Position max 50
    if (position.length === 0 || position.length > 50) {
        alert("Position max 50 chars");
        return false;
    }

    // Contact 10 digits
    if (!/^\d{10}$/.test(contact)) {
        alert("Contact number must be 10 digits");
        return false;
    }

    try {
        const newEmployee = auth.registerEmployee({
            name: name,
            email: email,
            password: password,
            department: department,
            position: position,
            contact: contact
        });
        document.getElementById("popupDetails").innerHTML = `
            Employee ID: ${newEmployee.employeeId}<br>
            Employee Name: ${name}<br>
            Email: ${email}<br>
            Department: ${department}<br>
            Position: ${position}<br>
            Registration Date: ${new Date(newEmployee.createdAt).toLocaleDateString()}
        `;
        document.getElementById("successPopup").style.display = "flex";
        setTimeout(() => {
            window.location.href = "employee-login.html";
        }, 4000);
    } catch (error) {
        alert(error.message);
    }
    return false;
}
