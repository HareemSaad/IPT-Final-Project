// import { saveUser } from "../..";
// show/hide the password and changing the icon of password field
const showPassword = document.getElementById('showPassword');
const password = document.getElementById('password');

showPassword.addEventListener('click', (event) => {
    if (password.type === 'password') {
        showPassword.classList.replace('fa-eye', 'fa-eye-slash');

        password.type = 'text';
    }
    else {
        showPassword.classList.replace('fa-eye-slash', 'fa-eye');

        password.type = 'password';
    }
});



// show/hide the password and changing the icon of confirm password field
const showConfirmPassword = document.getElementById('showConfirmPassword');

const confirmPassword = document.getElementById('confirmPassword');

showConfirmPassword.addEventListener('click', (event) => {
    if (confirmPassword.type === 'password') {
        showConfirmPassword.classList.replace('fa-eye', 'fa-eye-slash');

        confirmPassword.type = 'text';
    }
    else {
        showConfirmPassword.classList.replace('fa-eye-slash', 'fa-eye');

        confirmPassword.type = 'password';
    }

});


// 
const username = document.getElementById('Username');
const email = document.getElementById('email');
const submmit = document.getElementById('reg');
// password - #password
// confirmPassword - #confirmPassword



/**
 * fires when register now button is clicked
 * if the all inputs are correct we return true an can send inputs to express
 * we wait for the function to connect to the local host page
 * method: POST means to send data 
 * haeders specify what type of data we are sending
 * body contains the stuff to send
 * 
 * since we called onto the /register page
 * this function will look for the app.post("/register.html") function in index.js
 */
const form = document.getElementById('form');
form.addEventListener('submit', async event => {
    event.preventDefault();

    const result = inspectInputs();
    if (result === true) {
        
        const res = await fetch("http://localhost:3000/register.html", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Username: username.value,
                Email: email.value,
                Password: password.value
            })
            //above variables should be same in const {Username, Password, Email} = req.body when loading this function (in express file)
        })
        console.log(res)
        if(res.status == 200) {
            window.location = "/calendar.html"
        } else {
            window.location = "/register.html"
        }
        
    }
});




const nameError = document.querySelector('.nameError');
const emailError = document.querySelector('.emailError');
const passwordError = document.querySelector('.passError');
const confirmPasswordError = document.querySelector('.confirmPassError');



// REs
const isValidName = (nameValue) => {
    const nameRE = /^[a-zA-Z0-9]{3,}$/;
    return (nameRE.test(nameValue));
}

const isValidEmail = (emailValue) => {
    const emailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (emailRE.test(emailValue));
}

//Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number.
const isValidPassword = (passValue) => {
    const passRE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,14}$/;
    return (passRE.test(passValue));
}




const showError = (element, text) => {
    const err = element.querySelector('.error');

    err.innerText = text;


    // changing the color of the border if the input is invalid
    if (element === nameError) {
        document.querySelector('.nameDiv').style.borderBottom = '2px solid rgb(187, 64, 64)';
        document.querySelector('#nameExcla').style.visibility = 'visible';
    }

    
    if (element === emailError) {
        document.querySelector('.emailDiv').style.borderBottom = '2px solid rgb(187, 64, 64)';
        document.querySelector('#emailExcla').style.visibility = 'visible';
    }

    
    if (element === passwordError) {
        document.querySelector('.passDiv').style.borderBottom = '2px solid rgb(187, 64, 64)';
        document.querySelector('#passExcla').style.visibility = 'visible';
    }

    
    if (element === confirmPasswordError) {
        document.querySelector('.confirmPassDiv').style.borderBottom = '2px solid rgb(187, 64, 64)';
        document.querySelector('#confirmPassExcla').style.visibility = 'visible';
    }
}



const showSuccess = (element) => {
    const success = element.querySelector('.error');

    success.innerText = '';

    // changing the color of the border when the input is valid
    if (element === nameError) {
        document.querySelector('.nameDiv').style.borderBottom = '2px solid green';
        document.querySelector('#nameExcla').style.visibility = 'hidden';
    }


    if (element === emailError) {
        document.querySelector('.emailDiv').style.borderBottom = '2px solid green';
        document.querySelector('#emailExcla').style.visibility = 'hidden';
    }


    if (element === passwordError) {
        document.querySelector('.passDiv').style.borderBottom = '2px solid green';
        document.querySelector('#passExcla').style.visibility = 'hidden';
    }


    if (element === confirmPasswordError) {
        document.querySelector('.confirmPassDiv').style.borderBottom = '2px solid green';
        document.querySelector('#confirmPassExcla').style.visibility = 'hidden';
    }

}


const inspectInputs = () => {
    // removing the whitespaces
    const nameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();
    let bool = true;

    // name
    if (nameValue === '') {
        showError(nameError, 'Invalid name');
        bool = false;
    }
    else if (!isValidName(nameValue)){
        showError(nameError, 'Name should not contain any special character, only lower case, upper case letters and numbers are allowed.');
        bool = false;
    }
    else {
        showSuccess(nameError);
    }


    //email
    if (emailValue === '') {
        showError(emailError, 'Invalid email');
        bool = false;
    } 
    else if (!isValidEmail(emailValue)){
        showError(emailError, 'Invalid email');
        bool = false;
    }
    else {
        showSuccess(emailError);
    }


    // password
    if (passwordValue === '') {
        showError(passwordError, 'Password is empty');
        bool = false;
    } 
    else if (!isValidPassword(passwordValue)){
        showError(passwordError, 'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number.');
        bool = false;
    }
    else {
        showSuccess(passwordError);
    }


    // confirm password
    if (confirmPasswordValue === '') {
        showError(confirmPasswordError, 'Invalid password');
        bool = false;
    }
    else if (confirmPasswordValue != passwordValue) {
        showError(confirmPasswordError, 'Password is different');
        bool = false;
    }
    else {
        showSuccess(confirmPasswordError);
    }


    // checking checkbox
    const checkboxValue = document.querySelector('#checkbox').checked;

    const checkboxError = document.querySelector('.checkboxError');
    
    const checkboxErr = checkboxError.querySelector('.error');
    
    if(!checkboxValue) {
        checkboxErr.innerText = 'You didnt accept the terms and conditions';
        bool = false;
    }
    else {
        checkboxErr.innerText = '';
    }
    if (bool) {
        return true;
    }
    return false
}



