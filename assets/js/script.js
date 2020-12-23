
// create a save task variable called buttonEl, this will select the item "save-task" in html, within Button 
var buttonEl = document.querySelector("#save-task");
console.log(buttonEl);

// select the ID in button to perform the task
var buttonEl = document.querySelector("#save-task"); 
// variable for where the new element will be saved in "main"
var tasksToDoEl = document.querySelector("#tasks-to-do"); 

// create a function with a condition
//variable for where to create the element

var createTaskHandler = function() { 
  var listItemEl = document.createElement("li"); 
  listItemEl.className = "task-item"; 
  listItemEl.textContent = "This is a new task."; 
  tasksToDoEl.appendChild(listItemEl); 
  }; 

buttonEl.addEventListener("click", createTaskHandler);