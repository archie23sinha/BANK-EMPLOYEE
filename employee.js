function validateEmployee() {
    let empid = document.getElementById("empid").value.trim();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let department = document.getElementById("department").value.trim();
    let position = document.getElementById("position").value.trim();
    let contact = document.getElementById("contact").value.trim();

    // Clear any previous error messages
    clearErrors();

    // Employee ID 9 digits
    if (!/^\d{9}$/.test(empid)) {
        showError("Employee ID must be exactly 9 digits");
        return false;
    }

    // Name validation: max 50 chars, alphabets and spaces only
    if (!/^[A-Za-z\s]{1,50}$/.test(name)) {
        showError("Name must be 1-50 characters, alphabets and spaces only");
        return false;
    }

    // Email validation
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        showError("Please enter a valid email address");
        return false;
    }

    // Check for duplicate email across all users (customers and employees)
    const allUsers = [...auth.getCustomers(), ...auth.getEmployees()];
    const existingEmailUser = allUsers.find(u => u.email === email);
    if (existingEmailUser) {
        showError("Email already registered");
        return false;
    }

    // Password validation
    if (!validatePassword(password)) {
        return false;
    }

    if (password !== confirmPassword) {
        showError("Passwords do not match");
        return false;
    }

    // Department validation: max 50 chars, not empty
    if (department.length === 0 || department.length > 50) {
        showError("Department is required and must be maximum 50 characters");
        return false;
    }

    // Position validation: max 50 chars, not empty
    if (position.length === 0 || position.length > 50) {
        showError("Position is required and must be maximum 50 characters");
        return false;
    }

    // Contact validation: exactly 10 digits
    if (!/^\d{10}$/.test(contact)) {
        showError("Contact number must be exactly 10 digits");
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
        showError(error.message);
    }
    return false;
}

function validatePassword(password) {
    // Password requirements:
    // - At least 8 characters
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character

    if (password.length < 8) {
        showError("Password must be at least 8 characters long");
        return false;
    }

    if (password.length > 30) {
        showError("Password must not exceed 30 characters");
        return false;
    }

    if (!/[A-Z]/.test(password)) {
        showError("Password must contain at least one uppercase letter");
        return false;
    }

    if (!/[a-z]/.test(password)) {
        showError("Password must contain at least one lowercase letter");
        return false;
    }

    if (!/\d/.test(password)) {
        showError("Password must contain at least one number");
        return false;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        showError("Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?/)");
        return false;
    }

    return true;
}

function showError(message) {
    // Remove any existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #fee;
        color: #c33;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #fcc;
        margin-bottom: 15px;
        font-size: 14px;
    `;
    errorDiv.textContent = message;

    // Insert at the top of the form
    const form = document.querySelector('form');
    form.insertBefore(errorDiv, form.firstChild);
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}

function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthDiv = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (password.length === 0) {
        strengthDiv.style.display = 'none';
        return;
    }

    strengthDiv.style.display = 'block';

    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
        score += 1;
    } else {
        feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('One uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('One lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
        score += 1;
    } else {
        feedback.push('One number');
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        score += 1;
    } else {
        feedback.push('One special character');
    }

    // Update UI based on score
    strengthDiv.className = 'password-strength';

    if (score <= 2) {
        strengthDiv.classList.add('strength-weak');
        strengthText.textContent = 'Weak: ' + feedback.join(', ');
    } else if (score <= 4) {
        strengthDiv.classList.add('strength-medium');
        strengthText.textContent = 'Medium: ' + (feedback.length > 0 ? feedback.join(', ') : 'Good, but can be stronger');
    } else {
        strengthDiv.classList.add('strength-strong');
        strengthText.textContent = 'Strong password!';
    }
}
