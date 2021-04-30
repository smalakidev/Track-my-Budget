//Here we are creating a new db request
let db;
const request = indexedDB.open("budget", 1);
//function
request.onupgradeneeded = function(event) {
   const db = event.target.result;
   db.createObjectStore("pending", { autoIncrement: true });
 };