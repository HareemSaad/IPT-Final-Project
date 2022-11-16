
const currentDate = document.querySelector(".current-date"),
days=document.querySelector(".days"),
twoIcons=document.querySelectorAll(".icons span");

//Getting current date, year and month
let date = new Date(),
currYear=date.getFullYear(),
//getMonth() shows current month from 0-11 so Nov is the 10th month
currMonth=date.getMonth();

var _date = '', month = '', year = ''

//check current date
//console.log(date,currYear,currMonth);
 
const months=["January","February","March","April","May","June","July","August","September","October","November","December"];

//returns currmonth and curryear
const calendar = () =>{
    //getDate()-> returns the day of the month (1 to 31) 
    
    //getting first day of month
    let firstDay = new Date(currYear, currMonth , 1).getDay(),    
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),    //getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),   //getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();   //getting last date of prev month
   

    let li="";
    //check total days of month
    //console.log(lastDateofMonth);

//Prev month last days
    for (let i = firstDay; i > 0; i--) {
        li += ` <li class="inactive">${lastDateofLastMonth - i + 1}</li>`;  
    }

    // days of curr month
    for (let i = 1; i <= lastDateofMonth; i++) {
        //adding active class to current date
        let today = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear()?"active":"";
        //console.log(i);     
        li +=` <li class="${today}">${i}</li>`;  
    }

    // days of next month first days

    for (let i = lastDayofMonth; i < 6; i++) {
        li += ` <li class="inactive">${i - lastDayofMonth + 1}</li>`;         
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    days.innerHTML = li;
}
calendar()
addOnClickToCalendarTiles()
//function for icons
const icons = twoIcons.forEach(icon =>{
    //click event for both icons
    icon.addEventListener("click",()=>{
     // console.log(icon);
     currMonth= icon.id === "prev" ? currMonth - 1 : currMonth + 1; //compare ? true:false

    //showing prev or next years
    if(currMonth < 0 || currMonth > 11)
    {
        date = new Date(currYear,currMonth);
        currYear=date.getFullYear();
        currMonth=date.getMonth();
    }
    else{
        date = new Date();
    }
     calendar();
     addOnClickToCalendarTiles()
    });
});

/**Hareem's area */

//add onclick listener's on callendar tiles
function addOnClickToCalendarTiles() {
    // Get all list items in days ul with querySelectorAll
    const elements = days.querySelectorAll('li');

    // Iterate over elements
    elements.forEach(element => 
        // Add click event to every node
        element.addEventListener('click', () => {
            if (element.classList[0] === "inactive") {
                // if tile is inactive set global variables to null
                _date = ''
                month = ''
                year = ''
                return
            }
            //fi not split inner text to get global variables
            const monthYear = currentDate.innerText.split(" ");
            _date = element.innerText
            month = monthYear[0]
            year = monthYear[1]

            //render that day's event list
            renderEventList()
            console.log(_date, month, year)
        })
    );
}

//Add event Modal
const addModal = document.getElementById("add-modal");
const showBtn = document.getElementById("new-event-submit"); //add Event
const addCloseBtn = document.getElementById("add-modal-close");
const addSaveBtn = document.getElementById("add-modal-save");

//open modal when add event is clicked
showBtn.addEventListener("click", (e) =>  {
    try {
        e.preventDefault()
    
        const addHead = document.getElementById("add-ev-heading");
        const addDes = document.getElementById("add-ev-des");

        //send input values to null
        addHead.value = ""
        addDes.value = ""
        
        //reveal modal
        addModal.style.display = "block";
    } catch (error) {
        console.log(error);
    }
    
})

//close modal when clicked
addCloseBtn.onclick = function(e) {
    e.preventDefault()

    //hide modal
    addModal.style.display = "none";
}

//save event
addSaveBtn.addEventListener("click", (e) =>  {
    try {
        e.preventDefault()
        const heading = document.getElementById("add-ev-heading");
        const description = document.getElementById("add-ev-des");

        //log event to db
        logEvent(heading.value, description.value, _date, month, year)

        //create event div
        createEvent(heading.value, description.value)

        //hide modal
        addModal.style.display = "none";
    } catch (error) {
        console.log(error);
    }
    
})

//edit event Modal
const editModal = document.getElementById("edit-modal");
const editevent = document.getElementById("edit-ev");
const editCloseBtn = document.getElementById("edit-modal-close");
const editSaveBtn = document.getElementById("edit-modal-save");


//TODO: closing modal saves the value changes to db and div because you have already changed the heading.value and des.val by the timw you click close
//close modal and recreate event
editCloseBtn.onclick = function(e) {
    e.preventDefault()
    const heading = document.getElementById("edit-ev-heading").value;
    const description = document.getElementById("edit-ev-des").value;

    // console.log(heading, description);

    //when edit is clicked event is deleated from the db to
    //this is to recreate it
    logEvent(heading, description, _date, month, year)
    createEvent(heading, description)

    //hide modal
    editModal.style.display = "none";
}

//close modal and "update" event
editSaveBtn.addEventListener("click", (e) =>  {
    e.preventDefault()
    const heading = document.getElementById("edit-ev-heading");
    const description = document.getElementById("edit-ev-des");

    //when edit is clicked event is deleated from the db to
    //this is to recreate it
    logEvent(heading.value, description.value, _date, month, year)
    createEvent(heading.value, description.value)

    //hide modal
    editModal.style.display = "none";
})

function createEvent (heading, des) {
    // if (heading === "" || des === "") {return}

    //get parent div
    const eventList = document.getElementById("event-List");

    //create heading 
    let head = document.createElement('h2')
    head.innerHTML = heading

    //create description
    let desc = document.createElement('p')
    desc.innerHTML = des

    //create del button
    let del = document.createElement('button')
    del.classList.add("event-btn")
    del.setAttribute('id','del-ev');
    del.innerHTML = '❌'
    

    //create edit button
    let edit = document.createElement('button')
    edit.classList.add("event-btn")
    edit.setAttribute('id','edit-ev');
    edit.innerHTML = '🖊️'

    //create btn div
    let btns = document.createElement('div')
    btns.classList.add("event-btns")
    btns.appendChild(del)
    btns.appendChild(edit)

    //append everything to form event
    let event = document.createElement('div')
    event.setAttribute('id','event-box');
    event.classList.add("event")
    event.appendChild(head)
    event.appendChild(desc)
    event.appendChild(btns)

    //append to parent div
    eventList.appendChild(event)

    //when del is clicked delete event from db and screen
    del.addEventListener("click", () => {
        delEvent(heading, des, _date, month, year)
        event.remove()
    })

    //when edit is clicked "update" event from db and screen
    edit.addEventListener("click", (e) => {
        e.preventDefault()
        
        //delete prev version
        delEvent(heading, des, _date, month, year)

        //remove from screen
        event.remove()
        
        //display edit modal
        editModal.style.display = "block";
        
        const editHead = document.getElementById("edit-ev-heading");
        const editDes = document.getElementById("edit-ev-des");

        //change field values to old values
        editHead.value = heading
        editDes.value = des
    })

}

async function logEvent(heading, description, day, month, year) {
    //fetch log event request
    try {
        const res = await fetch("http://localhost:3000/logEvent", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Heading: heading,
                Description: description,
                Day: day,
                Month: month,
                Year: year,
                //req.body reads from here
            })
        })
    } catch (error) {
        console.log(error)
    }
    
}

async function delEvent(heading, description, day, month, year) {
    try {
        const res = await fetch("http://localhost:3000/delEvent", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Heading: heading,
                Description: description,
                Day: day,
                Month: month,
                Year: year,

            })
        })
    } catch (error) {
        console.log(error)
    }
    
}

async function renderEventList() {
    try {
        //clear event list panel
        const eventList = document.getElementById("event-List");
    
        while (eventList.firstChild) {
            eventList.firstChild.remove()
        }
        
        //fetch json of events on that day of this user
        const res = await fetch("http://localhost:3000/getEvents", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Day: _date,
                Month: month,
                Year: year,

            })
        })

        //wait for json
        events = await res.json()

        //create event for each event
        events.forEach(element => {
            createEvent(element.EventHeading, element.EventDescription)
        });
    } catch (error) {
        console.log(error)
    }
    
}

