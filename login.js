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
    let ssn = document.getElementById("ssn").value.trim();
    let password = document.getElementById("password").value;

    // SSN as email (9 digits)
    if(!/^\d{9}$/.test(ssn)){
        alert("SSN must be exactly 9 digits");
        return false;
    }

    if(password.length < 6){
        alert("Password must be at least 6 characters");
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
        alert(error.message || "Login failed");
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
