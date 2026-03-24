function validateLogin() {
    // Load auth first
    if (typeof auth === 'undefined') {
        const script = document.createElement('script');
        script.src = 'auth.js';
        document.head.appendChild(script);
        script.onload = () => {
            auth.updateNavbar();
            performLogin();
        };
        return false;
    }
    auth.updateNavbar();
    performLogin();
    return false;
}

function performLogin() {
    // Clear any previous error messages
    clearErrors();

    let ssn = document.getElementById("ssn").value.trim();
    let password = document.getElementById("password").value;

    // SSN validation: exactly 9 digits
    if (!/^\d{9}$/.test(ssn)) {
        showError("SSN must be exactly 9 digits");
        return false;
    }

    // Password validation: basic check for login (since password was validated during registration)
    if (password.length < 8) {
        showError("Password must be at least 8 characters");
        return false;
    }

    try {
        const result = auth.login(ssn, password);
        // Show styled success message
        showSuccessMessage("Customer Login successful.");
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    } catch (error) {
        showError(error.message || "Login failed");
    }
}

function showSuccessMessage(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.display = 'flex';
    popup.innerHTML = `
        <div class="popup-content">
            <h2 style="color: #28a745;">✓ ${message}</h2>
        </div>
    `;
    document.body.appendChild(popup);
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
