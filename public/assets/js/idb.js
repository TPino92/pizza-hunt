// create var to hold DB connection
let db;

// establish connection to Indexdb database called 'pizza_hunt' and set to version 1
const request = indexedDB.open('pizza_hunt', 1);

// event to emit if the DB version changes 
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon success
request.onsuccess = function(event) {
    // when db is successfully createdwith its object store (from onupgradedneeded event above) or simply established a connection,
    // save reference to db in global variable
    db = event.target.result;

    // check if app is online
    // if yes run uploadPizza() function to send all local db data to api
    if (navigator.online) {
        // we haven't created this yet, but we will soon, so let's comment it out for now
        // uploadPizza();
    }
};

// request error
request.onerror = function(event) {
    // log here
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    const transaction = db.transaction(['new_pizza'], 'readwrite');
  
    // access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_pizza');
  
    // add record to your store with add method
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    // open transaction on DB
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a var
    const getAll = pizzaObjectStore.getAll();

    // on sucess
    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                throw new Error(serverResponse);
                }
                // open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                // access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                // clear all items in your store
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}

// listen for app coming back online
window.addEventListener('online', uploadPizza);