import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, set , push ,onValue , update , remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword , onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_w7ib5QSe-HpTgvEUvywPsOfVBShj4Rc",
  authDomain: "todo-app-firebase-91ccb.firebaseapp.com",
  databaseURL: "https://todo-app-firebase-91ccb-default-rtdb.firebaseio.com",
  projectId: "todo-app-firebase-91ccb",
  storageBucket: "todo-app-firebase-91ccb.firebasestorage.app",
  messagingSenderId: "398089736822",
  appId: "1:398089736822:web:715e1bdf4dc52b28440557",
};

 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
const database = getDatabase(app);

// SignUp JS

window.signupFun = function() {
  let username = document.getElementById("username").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  if (username && email && password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const user = res.user;
        console.log(user.uid);
        
        // Save the user data (username and email) to Firebase Realtime Database
        set(ref(database, `User/${user.uid}`), {
          username: username,
          email: email,
        })
          .then(() => {
            window.location.href = "login.html"; // Redirect to login page
            username = "";
            email = "";
            password = "";
          })
          .catch((err) => {
            console.log("Error saving user data:", err);
          });

        alert(`User Created: ${user.email}`);
      })
      .catch((err) => {
        console.log(`SignUp Error: ${err.message}`);
      });
  } else {
    alert("Please Enter Username, Email, and Password");
  }
}

// todo js

onAuthStateChanged(auth , (user) => {
  if(user){
  let uid = user.uid;
  console.log(user.email);
   
  displayTodo(uid)
  window.add = function() {
    let input = document.getElementById('input').value.trim();
     
    if(input){
    let todoRef = ref(database , `User/${uid}/Todos`);

    push(todoRef , {input: input , complete: false})
    .then(() => {
      console.log("Todo Add Successfully");
    })
    .catch((err) => {
      console.error("Todo Adding Error:" , err)
    })
    document.getElementById('input').value = "";

  }
  else{
    alert('Please Enter Todo');
  }
    
  }
   

  } 
  else{
    console.log('No user is logged in.');
    
  } 
})

function displayTodo(uid){
   console.log(uid);

   let dataRef = ref(database , `User/${uid}/Todos`);
   let ol = document.getElementById('ol');
    
   onValue(dataRef , (snapShot) => {
    console.log(snapShot.val());
    let data = snapShot.val();
    ol.innerHTML= "";
    if(data){
      Object.keys(data).forEach((key) => {
        let li = document.createElement('li');
        let span = document.createElement('span');

        let editbtn = document.createElement('button');
        editbtn.setAttribute('class', 'edit')
        editbtn.textContent = "Edit";
        editbtn.onclick = () => editBtn(uid , key , data[key].input)
        let deletebtn = document.createElement('button');
        deletebtn.setAttribute('class', 'delete')
        deletebtn.innerHTML = "Delete";
        deletebtn.onclick = () => delBtn(uid , key)
       

        span.textContent = data[key].input
        li.appendChild(span);
        li.appendChild(editbtn);
        li.appendChild(deletebtn);
        ol.appendChild(li)
      })
    }
    else{
      let li = document.createElement('li');
      li.innerHTML = "No task available";
      ol.appendChild(li)
    }
   })
}

function editBtn(uid , key , todo){
  let newValue = prompt("Enter Update Value", todo);
  
  if(newValue !== null && newValue.trim() !== ""){
     let reff = ref(database , `User/${uid}/Todos/${key}`);

     update(reff , {input: newValue})
     .then(() => {
      alert("Todo Update Successfully");
     })
     .catch((err) => {
      console.log(`Todo Update Error: ${err}`);
     })
   }
}

function delBtn(uid , key){

  let reff = ref(database , `User/${uid}/Todos/${key}`)

  remove(reff)
  .then(() => {
    alert('Todo Delete Successfully')
  })
  .catch((err) => {
    console.log(`Todo Delete Error: ${err}`);
    
  })

}
