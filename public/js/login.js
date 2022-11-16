const email = document.getElementById('email');
const password = document.getElementById('password');

const form = document.getElementById('form');
form.addEventListener('submit', async event => {
    event.preventDefault();

    //see if inputs match
    const result = inspectInputs();

    //if they do
    if (result === true) {
        
        //request login 
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
        
        //if it returns status 200 i.e successful redirect to calendar
        if(res.status == 200) {
            await res.json()
            window.location = "/calendar.html"
        } else { //if it returns any other status i.e unsuccessful redirect to login
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