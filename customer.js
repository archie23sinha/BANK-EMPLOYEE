function validateCustomer() {
    let ssn = document.getElementById("ssn").value.trim();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let address = document.getElementById("address").value.trim();
    let contact = document.getElementById("contact").value.trim();

    // SSN 9 digits
    if (!/^\d{9}$/.test(ssn)) {
        alert("SSN must be exactly 9 digits");
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

    // Address max 100
    if (address.length > 100) {
        alert("Address max 100 chars");
        return false;
    }

    // Contact 10 digits
    if (!/^\d{10}$/.test(contact)) {
        alert("Contact 10 digits");
        return false;
    }

    try {
        const newCustomer = auth.registerCustomer({
            name: name,
            email: ssn, // Use SSN as email for login
            password: password,
            address: address,
            contact: contact
        });
        document.getElementById("popupDetails").innerHTML = `
            Customer ID: ${newCustomer.id}<br>
            Customer Name: ${name}<br>
            Account Number: ${newCustomer.accountNumber}<br>
            Email/SSN: ${ssn}<br>
            Initial Balance: ₹${newCustomer.balance}
        `;
        document.getElementById("successPopup").style.display = "flex";
        setTimeout(() => {
            window.location.href = "customer-login.html";
        }, 4000);
    } catch (error) {
        alert(error.message);
    }
    return false;
}
