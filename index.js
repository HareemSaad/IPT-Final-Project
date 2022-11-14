/**
 * npm init //to initialize npm
 * npm install express body-parser mongoose nodemon //to install subsequent packages
 * nodemon refreshes page whenever we make changes to .js files automatically
 */
const express = require("express") //import express
const bodyParser = require("body-parser") //import body parser
const path = require('path')
const mongoose = require("mongoose") //import mongoose -- so express can talk to mongodb
// const reg = require("./public/js/register.js")

const app = express() //instantiate express object
app.use(express.json())

const port = 3000

//connect to mongoose
main().catch(err => console.log(err));

async function main() {
  const users = await mongoose.connect('mongodb://localhost:27017/Event_Calendar', {useNewUrlParser: true, useUnifiedTopology: true}); 
}

const userSchema = new mongoose.Schema({
    Username: {
        type: String, 
        required: true
    },
    Email: {
        type: String, 
        required: true, 
        unique: true
    },
    Password: {
        type: String, 
        required: true
    }
});

const users = mongoose.model('user', userSchema);


app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
/**
 * to render css
 * this tell where these files are located
 * then index files have rest of the links
 */
app.use(express.static(path.join(__dirname, '/public')));
// app.set('view engine', 'ejs');

/**
 * install nodemon as a dependency -> npm install --save-dev nodemon
 * add "dev": "nodemon index.js" to the package.json folder -> now to rum the command nmp run dev to start server
 * 
 * since this page is the entry point this function is run first
 * in this function we send user the home page
 * send status code 200 -- status cose 200 means successful
 * when uses presses login button is sends /login.html 
 * so we create what page we want to display when /login.html is called
 */
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/views/home.html");
    
    res.status(200);

    
});

app.get("/login.html", (req, res)=>{
    res.sendFile(__dirname + "/views/login.html");
    
    res.status(200);
});

app.get("/calendar.html", (req, res)=>{
    console.log("object");
    res.sendFile(__dirname + "/views/calendar.html");
    res.status(200);
});

app.get("/register.html", (req, res)=>{
    res.sendFile(__dirname + "/views/register.html");
    res.status(200);

});
    
app.get('/info/:dynamic', (req, res) => {
    const {dynamic} = req.params 
    const key = req.query 
    console.log (dynamic, key )
    res.status(200).json({ info: 'preset text id' })
});

/**
 * function in register.js finds this function and invokes it
 * req.body recieves input from the function
 * REMEMBER the variable in which you receive your inputs should have the same name and quantity
 *      if the quantity is not same it'll have the value undefined
 *      if the names are different it'll load the other two variables and db will have missing values
 * then we insert it into tables
 * if email already exists we do not add it to the database
 */
    
app.post("/register.html", async (req, res) => { 
    
    try { 
        console.log("erve")
        const {Username, Password, Email} = req.body 
        console.log(Username, Password, Email)

        // console.log(ifExistsByEmail(Email))
        // if (ifExistsByEmail(Email))  {
        //     return;
        // }
        const result = await users.insertMany({
            "Username": Username,
            "Email": Email,
            "Password": Password
        })
    
        console.log("happy");

        res.status(200).send()

    } catch (error) {
        console.log("hi = ", error)
        res.status(201).send(error) 
    }
    
});

app.post("/login.html", async (req, res) => { 
    console.log(1)
    const {Password, Email} = req.body 
    console.log(Password, Email)

    const verification = await verify(Email, Password)

    if (verification) {
        console.log(verification);
        res.status(200).send()
    }
});

/**
 * if user exists this function returns true
 * if user doesnot exists func returns false
 */

async function ifExistsByEmail(email) {
    const see = await users.find({"Email": email})
    console.log(!(JSON.stringify(see) === JSON.stringify([])))
    return (!(JSON.stringify(see) === JSON.stringify([])))
}

async function ifExistsByUsername(name) {
    const see = await users.find({"Username": name})
    console.log(!(JSON.stringify(see) === JSON.stringify([])))
    return (!(JSON.stringify(see) === JSON.stringify([])))
}

async function verify(email, password) {
    const record = (await users.findOne({"Email": email})).toJSON()
    const index = Object.values(record).indexOf(password)
    if (Object.values(record)[index] === password) {
        return true;
    }
    return false
}

/**
 * make it listen to port -- IMPORTANT
 */
app.listen(port, ()=>{
    console.log(`App started succesfully with Express ${port}`);
    console.log(__dirname);
})

console.log("hi")





