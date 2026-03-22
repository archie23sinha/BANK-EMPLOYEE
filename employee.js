// AUTO GENERATE EMPLOYEE ID
window.onload = function() {
    document.getElementById("empId").value = "EMP" + Math.floor(Math.random() * 1000000);
}

function validateEmployee() {

    let valid = true;

    let fname = document.getElementById("fname");
    let lname = document.getElementById("lname");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let cpassword = document.getElementById("cpassword");
    let address = document.getElementById("address");
    let contact = document.getElementById("contact");

    let namePattern = /^[A-Za-z ]{2,50}$/;
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

    // RESET ERRORS
    document.querySelectorAll(".error").forEach(e => e.innerText = "");
    document.querySelectorAll("input, textarea").forEach(e => {
        e.classList.remove("error-border", "success-border");
    });

    // FIRST NAME
    if(!namePattern.test(fname.value)){
        document.getElementById("fnameError").innerText = "Only alphabets (2–50 chars)";
        fname.classList.add("error-border");
        valid = false;
    } else {
        fname.classList.add("success-border");
    }

    // LAST NAME
    if(!namePattern.test(lname.value)){
        document.getElementById("lnameError").innerText = "Only alphabets (2–50 chars)";
        lname.classList.add("error-border");
        valid = false;
    } else {
        lname.classList.add("success-border");
    }

    // EMAIL
    if(!emailPattern.test(email.value)){
        document.getElementById("emailError").innerText = "Enter valid email (example@gmail.com)";
        email.classList.add("error-border");
        valid = false;
    } else {
        email.classList.add("success-border");
    }

    // PASSWORD
    if(!passwordPattern.test(password.value)){
        document.getElementById("passwordError").innerText =
        "Min 6 chars, 1 uppercase, 1 lowercase, 1 special char";
        password.classList.add("error-border");
        valid = false;
    } else {
        password.classList.add("success-border");
    }

    // CONFIRM PASSWORD
    if(password.value !== cpassword.value){
        document.getElementById("cpasswordError").innerText = "Passwords do not match";
        cpassword.classList.add("error-border");
        valid = false;
    } else {
        cpassword.classList.add("success-border");
    }

    // ADDRESS
    if(address.value.trim().length < 5){
        document.getElementById("addressError").innerText = "Enter valid address (min 5 chars)";
        address.classList.add("error-border");
        valid = false;
    } else {
        address.classList.add("success-border");
    }

    // CONTACT
    if(!/^\d{10}$/.test(contact.value)){
        document.getElementById("contactError").innerText = "Enter valid 10-digit number";
        contact.classList.add("error-border");
        valid = false;
    } else {
        contact.classList.add("success-border");
    }

    // 🔴 STOP if basic validation fails
    if(!valid){
        return false;
    }

    // 🔥 DUPLICATE CHECK (localStorage)
    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    let duplicate = false;

    for(let i = 0; i < employees.length; i++){

        if(employees[i].email === email.value){
            document.getElementById("emailError").innerText = "Email already registered";
            email.classList.add("error-border");
            duplicate = true;
        }

        if(employees[i].contact === contact.value){
            document.getElementById("contactError").innerText = "Phone already registered";
            contact.classList.add("error-border");
            duplicate = true;
        }
    }

    if(duplicate){
        return false;
    }

    // ✅ SAVE NEW EMPLOYEE
    let empData = {
        empId: document.getElementById("empId").value,
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        contact: contact.value
    };

    employees.push(empData);
    localStorage.setItem("employees", JSON.stringify(employees));

    // ✅ SUCCESS REDIRECT
    window.location.href = "employee-success.html";

    return false;
}