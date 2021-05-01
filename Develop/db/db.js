//Here we are creating a new db request
let db;
const request = indexedDB.open("budget", 1);
//function
request.onupgradeneeded = function(event) {
   const db = event.target.result;
   db.createObjectStore("pending", { autoIncrement: true });
 };

 //if and else statement 

 request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        
        checkDatabase();
    
    } 
       
};
//error function
request.onerror = function(event) {
    console.log("This is an Error! " + event.target.errorCode);
};

//this is a funciton for saving the record

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(["pending"], "readwrite");
                    const store = transaction.objectStore("pending");
                    store.clear();
                });
        }
    };
}
window.addEventListener("online", checkDatabase);