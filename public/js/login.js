const email = document.getElementById('email');
const password = document.getElementById('password');

const form = document.getElementById('form');
form.addEventListener('submit', async event => {
    console.log(55);
    event.preventDefault();

    const result = inspectInputs();
    if (result === true) {
        
        const res = await fetch("http://localhost:3000/login.html", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Email: email.value,
                Password: password.value
            })
            //above variables should be same in const {Username, Password, Email} = req.body when loading this function (in express file)
        })
        console.log(res)
        if(res.status == 200) {
            window.location = "/calendar.html"
        } else {
            window.location = "/login.html"
        }
    }
});

const inspectInputs = () => {
    // removing the whitespaces
    const emailValue = email.value.trim();
    let bool = true;

    //email
    if (emailValue === '') {
        bool = false;
    }


    // password
    if (password.value === '') {
        bool = false;
    } 

    return bool
}