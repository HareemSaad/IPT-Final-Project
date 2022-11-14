const currentDate = document.querySelector(".current-date")
days=document.querySelector(".days");

twoIcons=document.querySelectorAll(".icons span");

//Getting current date, year and month
let date = new Date(),
currYear=date.getFullYear(),
//getMonth() shows current month from 0-11 so Nov is the 10th month
currMonth=date.getMonth();

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
calendar();

//function for icons
twoIcons.forEach(icon =>{
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
    });
});


/**Hareem's area */
//Add event Modal
const addModal = document.getElementById("add-modal");
const showBtn = document.getElementById("new-event-submit");
const addCloseBtn = document.getElementById("add-modal-close");
const addSaveBtn = document.getElementById("add-modal-save");

showBtn.addEventListener("click", (e) =>  {
    e.preventDefault()
    addModal.style.display = "block";
    console.log(1);
})

addCloseBtn.onclick = function(e) {
    e.preventDefault()
    addModal.style.display = "none";
}

addSaveBtn.addEventListener("click", (e) =>  {
    e.preventDefault()
    const heading = document.getElementById("add-ev-heading");
    const description = document.getElementById("add-ev-des");

    createEvent(heading.value, description.value)
    addModal.style.display = "none";
})

//edit event Modal
const editModal = document.getElementById("edit-modal");
const editevent = document.getElementById("edit-ev");
const editCloseBtn = document.getElementById("edit-modal-close");
const editSaveBtn = document.getElementById("edit-modal-save");


editCloseBtn.onclick = function(e) {
    e.preventDefault()
    editModal.style.display = "none";
}

editSaveBtn.addEventListener("click", (e) =>  {
    e.preventDefault()
    const heading = document.getElementById("edit-ev-heading");
    const description = document.getElementById("edit-ev-des");

    createEvent(heading.value, description.value)
    editModal.style.display = "none";
})

//create event
function createEvent (heading, des) {
    // if (heading === "" || des === "") {return}

    const eventList = document.getElementById("events");

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


    let event = document.createElement('div')
    event.setAttribute('id','event-box');
    event.classList.add("event")
    event.appendChild(head)
    event.appendChild(desc)
    event.appendChild(btns)

    eventList.appendChild(event)

    del.addEventListener("click", () => {
        event.remove()
    })

    edit.addEventListener("click", (e) => {
        e.preventDefault()
        event.remove()
        
        editModal.style.display = "block";
        

        const editHead = document.getElementById("edit-ev-heading");
        const editDes = document.getElementById("edit-ev-des");

        editHead.value = heading
        editDes.value = des
    })

}

const delEvent = document.getElementById("del-ev");
const editEvent = document.getElementById("edit-ev");

// delEvent.addEventListener("click", (e) =>  {
//     e.preventDefault()

//     createEvent(heading.value, description.value)
//     modal.style.display = "none";
// })
