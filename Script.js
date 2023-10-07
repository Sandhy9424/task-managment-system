let signUp=document.getElementById("signUp");
let signUpForDataInput;
let loginDiv=document.getElementById("loginDiv");
let addTaskBtn=document.getElementById("add-task-id");
let signUpDiv;
signUp.addEventListener("click",openSignUpPage);
let email;
let password;
let taskList;;

async function openSignUpPage(){
     let signUp=document.createElement("div");
     signUp.innerHTML=` <h1 >Signup</h1>
     <input required type="text" name="firstName" placeholder="First Name">
     <input type="text" name="middleName" placeholder="Middle Name">
     <input required type="text" name="LastName" placeholder="Last Name">
     <input required type="email" placeholder="E-Mail">
     <input id="pass" required type="password" placeholder="Password">
     <input onchange="check(event)" required type="password" placeholder="Confirm Password">
     <button disabled onclick="addUser()" id="signUpForDataInput">Signup</button>
     <button onclick="logCall()">Log In</button>`
     signUp.id="signUpDiv";
     signUp.className="sign-up";
    loginDiv.style.display="none";

    document.body.appendChild(signUp);
    // signUpDiv.style.display="block";
}
function logCall(){
    location.reload();
}
function check(event){
    if(event.target.value==document.getElementById("pass").value){
        document.getElementById("signUpForDataInput").disabled=false;
    }
}

function addUser(){
     signUpDiv=document.getElementById("signUpDiv");
    // signUpForDataInput=document.getElementById("signUpForDataInput");
    let childNodes=signUpDiv.children;
    let obj={
        firstName:childNodes[1].value,
        middleName:childNodes[2].value,
        lastName:childNodes[3].value,
        email:childNodes[4].value,
        password:childNodes[5].value,
        confirmPassword:childNodes[6].value
    }
    email=obj.email;
    password=obj.password;
     let name=obj.firstName+" "+obj.middleName+" "+obj.lastName;
     console.log(obj);
     fetch(`http://13.51.162.121:8080/user/add-user?name=${name}&email=${obj.email}&password=${obj.password}`,{method:"POST"}).then((response)=>{
        if(response.ok){
            alert("SignUp Successfull Please Log-In ");
        signUpDiv.remove();
        loginDiv.style.display="block";
        }   
     console.log(response.json())}).catch((err)=>{console.log(err)})
    // fetch(`http://localhost:8080/user/get-user?email=ravi23@gmail.com&password=12345678`).then((re)=>console.log(re.json())).catch((err)=>console.log(err));
    //api call 

}

function logIn(){
     email=document.getElementById("logEmail").value;
     password=document.getElementById("logPassword").value;
    
    fetch(`http://13.51.162.121:8080/user/get-user?email=${email}&password=${password}`,{method:"GET"}).then((response)=>response.json()).then((data)=>{
    taskList  =data.taskList;      
    addHome(data);
            loginDiv.style.display="none";
        // console.log(response.json());    
    console.log(data);
    }).catch((err)=>{console.log(err)})
}

function addHome(data){
    let pc=0;
    let ipc=0;
    let cc=0;
    data.taskList.forEach(element => {
        console.log(element.status,typeof element.status);
        if(element.status=="Pending"){
            pc++;
        }
        else if(element.status=="Completed"){
            cc++;
        }
        else{
            ipc++;
        }
    });
    let homeDiv=document.createElement("div");
    homeDiv.innerHTML=` <nav>
    <a href=""><img src="taskIcon.jpg" alt="Img.err"></a>
   <h1>Task Manager</h1>
   <h2>Welcome User : ${data.name} </h2>
   <div>
   <button onclick="logOut()" id="log-out">Log Out</button>
    <button onclick="deleteUser()" id="delete">Delete User</button>
    </div>
</nav>
<div id="div1">
<div id="div1_1" >
    <h1>Task Manager</h1>
    <h2 onclick="addTask()" id="add-task-id">Add Task</h2>
    <h2 onclick="viewTask()" id="view-task">View Task</h2>
</div>
<div id="div1_2">
    <h1>Task Report</h1>
    <div id="div2">
    <div id="pen" class="statusDiv">
       <h2>Pending</h2>
       <img src="pending.jpg" alt="">
      <h3>${pc}</h3>
    </div>
    <div id="dp" class="statusDiv">
      <h2>DeadLine Passed</h2>
      <img src="deadline.png" alt="">
      <h3>${ipc}</h3>
    </div>
    </div>
    <div id="CompletedDivId" class="statusDiv">
       <h2>Completed</h2>
       <img src="completed.png" alt="">
      <h3>${cc}</h3>
    </div>
     <div id="task-report">
        <h2>Task Report</h2>
        <select onchange="onChange()" id="status-selector">
        <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Passed_DeadLine">DeadLine Passed</option>
            <option value="Completed">Completed</option>
        </select>
        <div id ="task-report-list"></div>
     </div>
</div>`
homeDiv.id="taskDiv";
document.body.appendChild(homeDiv);
}
function onChange(){
    document.getElementById("task-report-list").innerHTML="";
     viewTask();
}
function deleteUser(){
    fetch(`http://13.51.162.121:8080/user/delete-user?email=${email}`,{method:"DELETE"}).then((response)=>response.json()).then((data)=>{
        alert(data.message);
    }).catch((err)=>console.log(err));
    location.reload();
}
function logOut(){
    location.reload();
}
function addTask(email,password){
    console.log("hi");
    let div=document.createElement("div");
    div.innerHTML=
        ` <img id="img1" src="cross.jpeg" alt="err">
        <label for="taskName">Task Title</label>
        <input required name="taskName" type="text" placeholder="Task Title">
        <label for="Description">Description</label>
        <input required name="Description" type="text" placeholder="Description">
        <label  for="DeadLine">DeadLine</label>
        <input required name="DeadLine" type="date" placeholder="DeadLine">
        <button onclick="addTaskToUser()">Add</button>
   `
    div.id="add-task";
    document.body.appendChild(div);
    document.getElementById("img1").addEventListener("click",()=>div.remove());
}

function addTaskToUser(){
    let div=document.getElementById("add-task");
    let arr=div.children;
    let temp={
        emailId:email,
        name:arr[2].value,
        description:arr[4].value,
        deadLine:arr[6].value.toString()
    } 
     console.log(temp , arr);
     fetch("http://13.51.162.121:8080/task/add-task",{method:"POST" , headers:{"Content-Type":"application/json"} , body:JSON.stringify(temp)}).then((response)=>response.json()).then((data)=>{ alert(data.message); div.remove(); reRender()}).catch((err)=>console.log(err));
    
}
function viewTask(){
    let select=document.getElementById("status-selector").value;
    let taskReportDiv=document.getElementById("task-report-list");
    taskReportDiv.innerHTML="";
    let c=4;
   taskList.forEach((element)=>{
    if(select=="All"||select==element.status){
    let img;
    if(element.status=="Pending"){
        img="pending.jpg";
    }
    else if(element.status=="Completed"){
        img="completed.png";
    }
    else{
        img="deadline.png";
    }
         let infodiv=document.createElement("div");
         infodiv.innerHTML=`<div>
         <img src="${img}" alt="err">
         <h3>Title :${element.name}</h3>
         </div>
         <h3>Status :${element.status}</h3>
         <p style ="display:none;">${element.id}</p>
         <img src="moreinfo.png" alt="err" id="img${c}">`;
         infodiv.className="info";
         taskReportDiv.append(infodiv);
         document.getElementById(`img${c}`).addEventListener("click",addDescription);
         c++;
   }});
}
function addDescription(event){
    console.log(event);
      let div =event.target.parentNode;
      console.log(div);
      let desDiv=document.createElement("div");
      let divp=document.getElementById("div1_1");
      taskList.forEach((element)=>{
        if(element.id==div.children[2].innerText){
            desDiv.innerHTML=`<p>Title :${element.name}</p><p>Assign-Date : ${element.assignDate}</p><p>DeadLine : ${element.deadLine}</p> <p>Description :${element.description}</p>
            <label>Change Status</label>
             <Select id="selectId">
             <option selected disabled >Select-Status</option>
                <option value="Pending">Pending</option>
                <option value="Passed_Deadline">DeadLine Passed</option>
                <option value="Completed">Completed</option>
             </Select>`;
             desDiv.className="des";
             console.log(divp.children[3]);
             if(divp.children[3]){
             divp.children[3].remove();
             }
         divp.append(desDiv);
         document.getElementById("selectId").addEventListener("change",()=>{
            fetch(`http://13.51.162.121:8080/task/update-status?id=${element.id}&status=${document.getElementById("selectId").value}`,{method:"PUT"}).then((response)=>response.json()).then((data)=>{    
            div.children[1].innerText=document.getElementById("selectId").value; 
            let img;
            if( div.children[1].innerText=="Pending"){
                img="pending.jpg";
            }
            else if( div.children[1].innerText=="Completed"){
                img="completed.png";
            }
            else{
                img="deadline.png";
            }
            console.log(div.children[0]);
            div.children[0].children[0].src=img;
                reRender();
                console.log(data)}).catch((err)=>console.log(err));
         });
        }
      })
}
function reRender(){
    fetch(`http://13.51.162.121:8080/user/get-user?email=${email}&password=${password}`,{method:"GET"}).then((response)=>response.json()).then((data)=>{
    taskList  =data.taskList;
    let pc=0;
    let ipc=0;
    let cc=0;
    data.taskList.forEach(element => {
        console.log(element.status,typeof element.status);
        if(element.status=="Pending"){
            pc++;
        }
        else if(element.status=="Completed"){
            cc++;
        }
        else{
            ipc++;
        }
        let pen=document.getElementById("pen").children[2];
        let com=document.getElementById("CompletedDivId").children[2];
        let id=document.getElementById("dp").children[2];
        pen.innerText=pc;
        id.innerText=ipc;
        com.innerText=cc;
    });}).catch((err)=>{alert("Some Err Occured"); console.log(err)});
}
