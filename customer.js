function validateCustomer() {

    let name = document.getElementById("name").value.trim();
    let account = document.getElementById("account").value.trim();
    let ifsc = document.getElementById("ifsc").value.trim().toUpperCase();
    let balance = document.getElementById("balance").value.trim();
    let email = document.getElementById("email").value.trim();
    let contact = document.getElementById("contact").value.trim();

    // ---------- PATTERNS ----------
    let namePattern = /^[A-Za-z ]{3,50}$/;
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    let ifscPattern = /^[A-Z]{4}0\d{6}$/;
    let contactPattern = /^\d{10}$/;

    // ---------- VALIDATIONS ----------
    if (!namePattern.test(name)) {
        alert("Name must contain only alphabets (min 3 characters)");
        return false;
    }

    if (!/^\d{6,12}$/.test(account)) {
        alert("Account number must be 6-12 digits");
        return false;
    }

    if (!ifscPattern.test(ifsc)) {
        alert("Invalid IFSC (Example: SBIN0123456)");
        return false;
    }

    if (balance === "" || isNaN(balance) || Number(balance) < 0) {
        alert("Balance must be a valid positive number");
        return false;
    }

    if (!emailPattern.test(email)) {
        alert("Invalid Email format (example@gmail.com)");
        return false;
    }

    if (!contactPattern.test(contact)) {
        alert("Contact must be exactly 10 digits");
        return false;
    }

    // ---------- DUPLICATE CHECK ----------
    let customers = JSON.parse(localStorage.getItem("customers")) || [];

    for (let i = 0; i < customers.length; i++) {

        if (customers[i].email === email) {
            alert("Email already registered");
            return false;
        }

        if (customers[i].contact === contact) {
            alert("Phone number already registered");
            return false;
        }

        if (customers[i].account === account) {
            alert("Account number already exists");
            return false;
        }
    }

    // ---------- SAVE DATA ----------
    let customerData = {
        name: name,
        account: account,
        ifsc: ifsc,
        balance: balance,
        email: email,
        contact: contact
    };

    customers.push(customerData);
    localStorage.setItem("customers", JSON.stringify(customers));

    // ---------- POPUP ----------
    document.getElementById("popupDetails").innerHTML =
        "👤 Name: " + name + "<br>" +
        "🏦 Account No: " + account + "<br>" +
        "🔐 IFSC: " + ifsc;

    document.getElementById("successPopup").style.display = "flex";

    // ---------- REDIRECT ----------
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);

    return false;
}