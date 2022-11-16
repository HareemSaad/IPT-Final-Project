/**
 * npm init //to initialize npm
 * npm install express body-parser mongoose nodemon cookie-parser path//to install subsequent packages
 * nodemon refreshes page whenever we make changes to .js files automatically
 */
const express = require("express") //import express
const bodyParser = require("body-parser") //import body parser
const path = require('path')
const mongoose = require("mongoose") //import mongoose -- so express can talk to mongodb
const cookieParser = require("cookie-parser")

const port = 3000

const app = express() //instantiate express object

app.use(express.json())
/**
 * to render css
 * this tell where these files are located
 * then index files have rest of the links
 */
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser())

//connect to mongoose
main().catch(err => console.log(err));

async function main() {
  const calendar = await mongoose.connect('mongodb://localhost:27017/Event_Calendar', {useNewUrlParser: true, useUnifiedTopology: true}); 
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

const eventSchema = new mongoose.Schema({
    UserId: {
        type: String, 
        required: true,
    },
    EventHeading: {
        type: String, 
        required: true, 
    },
    EventDescription: {
        type: String, 
        required: true, 
    },
    Day: {
        type: String, 
        required: true
    },
    Month: {
        type: String, 
        required: true
    },
    Year: {
        type: String, 
        required: true
    }
});

const users = mongoose.model('user', userSchema);
const events = mongoose.model('events', eventSchema);

//get functions

/**
 * install nodemon as a dependency -> npm install --save-dev nodemon
 * add "dev": "nodemon index.js" to the package.json folder -> now to rum the command nmp run dev to start server
 * 
 * since this page is the entry point this function is ran first
 * "/" defines entry point or default
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
    res.sendFile(__dirname + "/views/calendar.html");
    res.status(200);
});

app.get("/register.html", (req, res)=>{
    res.sendFile(__dirname + "/views/register.html");
    res.status(200);

});

/**
 * function in register.js fetches this url and invokes the reques
 * req.body recieves input from the function (from the body of the json we sent)
 * REMEMBER the variable in which you receive your inputs should have the same name and quantity
 *      if the quantity is not same it'll have the value undefined
 *      if the names are different it'll load the other two variables and db will have missing values
 * then we insert it into tables
 * if email already exists we do not add it to the database
 * data base sends error since email is unique which leads to sending 201 status code
 */   
app.post("/register.html", async (req, res) => { 
    
    try { 
        const {Username, Password, Email} = req.body 
        console.log(Username, Password, Email)

        await users.insertMany({
            "Username": Username,
            "Email": Email,
            "Password": Password
        })

        res.status(200).send()

    } catch (error) {
        console.log(error)
        res.status(201).send(error) 
    }
    
});

app.post("/login.html", async (req, res) => { 
    
    try {
        //get data from body
        const {Password, Email} = req.body 
        console.log(Password, Email)

        //verify if email exists
        const verification = await verify(Email, Password)

        if (verification) { //if exists
            //find the user id from db and log it in cookie
            res.cookie("id", await findIdByEmail(Email), {
                maxAge: 3600000, //set max age to 1 day
                httpOnly: true, //cannot be accessed by client side
            })
            res.status(200).json({email: Email}) //send it as json
        }
    } 
    catch(error) {
        console.log(error)
        res.status(500).send()
    }
    
});

app.post("/logEvent", async (req, res) => { 
    
    //check cookie session for id
    //log event into db
    try {
        if ("id" in req.cookies) {
            // console.log(req.cookies.id, req.body.Heading, req.body.Description, req.body.Day, req.body.Month, req.body.Year)
            
            //TODO: check if id in cookie session is valid

            //insert events
            await events.insertMany({
                "UserId": req.cookies.id,
                "EventHeading": req.body.Heading,
                "EventDescription": req.body.Description,
                "Day": req.body.Day,
                "Month": req.body.Month,
                "Year": req.body.Year
            })
            //send 200 if succesfull
            res.status(200).send()
        }
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
});

app.post("/delEvent", async (req, res) => { 
    
    //check cookie session
    //log event into db
    try {
        if ("id" in req.cookies) {
            console.log(req.cookies.id)
            //TODO: check if id in cookie session is valid

            //find and delete
            await events.findOneAndDelete({
                "UserId": req.cookies.id,
                "EventHeading": req.body.Heading,
                "EventDescription": req.body.Description,
                "Day": req.body.Day,
                "Month": req.body.Month,
                "Year": req.body.Year
            })
            //send 200 if succesfull
            res.status(200).send()
        }
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
});

app.post("/getEvents", async (req, res) => { 
    try {
        if ("id" in req.cookies) {
            // console.log(66, req.cookies.id, req.body.Day, req.body.Month, req.body.Year)
        
            //find events of user on specific dates
            const result = await events.find({
                "UserId": req.cookies.id,
                "Day": req.body.Day,
                "Month": req.body.Month,
                "Year": req.body.Year
            })

            //create siolated json of events which only contains event heading and des
            let eventss = []

            result.forEach(element => {
                item = {}
                item ["EventHeading"] = element.EventHeading; //way to add element in object
                item ["EventDescription"] = element.EventDescription;
                eventss.push(item) //push item in array
            });
            //send 200, json if success
            res.status(200).json(eventss).send()
        }
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
});

async function findIdByEmail(email) {
    const see = await users.findOne({"Email": email})
    return see._id.toString()
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





