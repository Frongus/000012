console.log('register.js loaded');

const email = document.getElementById('indexEmailInput');
const name = document.getElementById('indexNameInput');
const password = document.getElementById('indexPasswordInput');
const repeatedPassword = document.getElementById('indexPasswordRepeatInput');
const username = document.getElementById('indexUsernameInput');
const alertNotice = document.getElementById('alertNotice');

function testFormInformation() {
    const emailDataStr = email.value.trim();
    const nameDataStr = name.value.trim();
    const passwordDataStr = password.value;
    const repeatedPasswordDataStr = repeatedPassword.value;
    const usernameStr = username.value.trim();

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailDataStr)) {
        console.error("Invalid email format.");
        alertNotice.innerHTML = "Please enter a valid email address."
        return false;
    }

    // Name format check (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(nameDataStr)) {
        console.error("Invalid name. Only letters and spaces are allowed.");
        alertNotice.innerHTML = "Name should contain only letters and spaces."
        return false;
    }

    // Password match check
    if (passwordDataStr !== repeatedPasswordDataStr) {
        console.error("Passwords do not match.");
        alertNotice.innerHTML = "Passwords do not match."
        return false;
    }

    // Password strength check
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordStrengthRegex.test(passwordDataStr)) {
        console.error("Password is too weak.");
        alertNotice.innerHTML = "Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters."
        return false;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(usernameStr)) {
        console.error("Invalid name. Only letters and spaces are allowed.");
        alertNotice.innerHTML = "Username should contain only letters."
        return false;
    }

    console.log("All inputs are valid!");
    sendToBackend(emailDataStr, nameDataStr, passwordDataStr, usernameStr);
}

function sendToBackend(email, name, password, username) {
    fetch('/auth/register/data/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "nameStr": name,
            "emailStr": email,
            "passwordStr": password,
            "usernameStr": username
        })
    }).then(response => response.json()).then((data) => {
        console.log(data);
        if(data.res === "UserAlreadyExists") {
            alertNotice.innerHTML = "Username already in use."
        } else {
            window.location.replace('/auth/login/');
        }
    })
}