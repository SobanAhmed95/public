import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_w7ib5QSe-HpTgvEUvywPsOfVBShj4Rc",
  authDomain: "todo-app-firebase-91ccb.firebaseapp.com",
  databaseURL: "https://todo-app-firebase-91ccb-default-rtdb.firebaseio.com",
  projectId: "todo-app-firebase-91ccb",
  storageBucket: "todo-app-firebase-91ccb.appspot.com", // Corrected URL
  messagingSenderId: "398089736822",
  appId: "1:398089736822:web:715e1bdf4dc52b28440557",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Login Function
window.loginFun = function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password!");
    return;
  }

  // Sign in with Email and Password
  signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
   
      const userRef = ref(database, `User/${res.user.uid}`);
      console.log(userRef);
       onValue(userRef, (snapshot) => {
        let data = snapshot.val();
        alert(`Login Successfully: ${data.email}`)
       
        if (data.email === res.user.email) {
            window.location.href = "todo.html";
          } else {
            alert("Not Found");
          }
          email = "";
          password = "";
      }); 
    })
    .catch((error) => {
      console.error(`Login Error: ${error.message}`);
      alert(`Login failed: ${error.message}`);
    });
};
