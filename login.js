function validateLogin() {

    let ssn = document.getElementById("ssn").value.trim();
    let password = document.getElementById("password").value;

    // SSN (9 digits)
    if(!/^\d{9}$/.test(ssn)){
        alert("SSN must be exactly 9 digits");
        return false;
    }

    // Password
    if(password.length < 6){
        alert("Password must be at least 6 characters");
        return false;
    }

    // SUCCESS
    localStorage.setItem("user", "Customer");

    window.location.href = "dashboard.html";
    return false;
}