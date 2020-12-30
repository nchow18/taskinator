var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

var taskFormHandler = function(event) {
	event.preventDefault();
	var taskNameInput = document.querySelector("input[name='task-name']").value;
	var taskTypeInput = document.querySelector("select[name='task-type']").value;

	if (!taskNameInput || !taskTypeInput) {
		alert("You need to fill out the task form!");
		return false;
	}

  	formEl.reset();

  	var isEdit = formEl.hasAttribute("data-task-id");

	// has data attribute, so get task id and call function to complete edit process
	if (isEdit) {
		var taskId = formEl.getAttribute("data-task-id");
		completeEditTask(taskNameInput, taskTypeInput, taskId);
	} 
	// no data attribute, so create object as normal and pass to createTaskEl function
	else {
	var taskDataObj = {
		name: taskNameInput,
		type: taskTypeInput
	};
	createTaskEl(taskDataObj);
  }	
};

var completeEditTask = function(taskName, taskType, taskId) {

	// find the matching task list item
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

	// set new values
	taskSelected.querySelector("h3.task-name").textContent = taskName;
	taskSelected.querySelector("span.task-type").textContent = taskType;

	alert("Task Updated!");

	formEl.removeAttribute("data-task-id");
	document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function(taskDataObj) {

  

  var listItemEl = document.createElement("li");
		listItemEl.className = "task-item";

  	// add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  listItemEl.setAttribute("draggable", "true");

  var taskInfoEl = document.createElement("div");
		taskInfoEl.className = "task-info";
		taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  tasksToDoEl.appendChild(listItemEl);

  // increase task counter for next unique id
  taskIdCounter++;
};

var createTaskActions = function(taskId) {
	var actionContainerEl = document.createElement("div");
		actionContainerEl.className = "task-actions";

	// create edit button
	var editButtonEl = document.createElement("button");
		editButtonEl.textContent = "Edit";
		editButtonEl.className = "btn edit-btn";
		editButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(editButtonEl);

	// create delete button
	var deleteButtonEl = document.createElement("button");
		deleteButtonEl.textContent = "Delete";
		deleteButtonEl.className = "btn delete-btn";
		deleteButtonEl.setAttribute("data-task-id", taskId);

	actionContainerEl.appendChild(deleteButtonEl);

	var statusSelectEl = document.createElement("select");
		statusSelectEl.className = "select-status";
		statusSelectEl.setAttribute("name", "status-change");
		statusSelectEl.setAttribute("data-task-id", taskId);

	var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
		statusOptionEl.textContent = statusChoices[i];
		statusOptionEl.setAttribute("value", statusChoices[i]);
  
    // append to select
    statusSelectEl.appendChild(statusOptionEl);
    }

actionContainerEl.appendChild(statusSelectEl);

return actionContainerEl;
};

var taskButtonHandler = function(event) {
	// get target element from event
	var targetEl = event.target;

	// edit button was clicked
	if (targetEl.matches(".edit-btn")) {
		var taskId = targetEl.getAttribute("data-task-id");
		editTask(taskId);
	} 
	// delete button was clicked
	else if (targetEl.matches(".delete-btn")) {
		var taskId = targetEl.getAttribute("data-task-id");
		deleteTask(taskId);
	}
};

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
};

var editTask = function(taskId) {

	document.querySelector("#save-task").textContent = "Save Task";

	formEl.setAttribute("data-task-id", taskId);

	// get task list item element
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

	// get content from task name and type
	var taskName = taskSelected.querySelector("h3.task-name").textContent;
	console.log(taskName);

	var taskType = taskSelected.querySelector("span.task-type").textContent;
	console.log(taskType);

	document.querySelector("input[name='task-name']").value = taskName;
	document.querySelector("select[name='task-type']").value = taskType;

};

var taskStatusChangeHandler = function(event) {
	// get the task item's id
	var taskId = event.target.getAttribute("data-task-id");
  
	// get the currently selected option's value and convert to lowercase
	var statusValue = event.target.value.toLowerCase();
  
	// find the parent task item element based on the id
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

	if (statusValue === "to do") {
		tasksToDoEl.appendChild(taskSelected);
	  } 
	  else if (statusValue === "in progress") {
		tasksInProgressEl.appendChild(taskSelected);
	  } 
	  else if (statusValue === "completed") {
		tasksCompletedEl.appendChild(taskSelected);
	  }
  };

// creating the drag action and also logging the dataId to console for reference
var dragTaskHandler = function(event) {
	var taskId = event.target.getAttribute("data-task-id");
	event.dataTransfer.setData("text/plain", taskId);

	var getId = event.dataTransfer.getData("text/plain");
	console.log("getId:", getId, typeof getId);
};

// This function determines the information provided when you drag the item over the event target
var dropZoneDragHandler = function(event) {
	// searches from the element: .task-list to apply the functions
	var taskListEl = event.target.closest(".task-list");
	// if statement, item will bounce back to the parent element by using event.preventDefault();, and if reaches the desired element (console.dir(taskListEl)), it will console.log the event
	if (taskListEl) {
		event.preventDefault();

	taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
	}
};

// function to drop the item into the new element
var dropTaskHandler = function(event) {
	var id = event.dataTransfer.getData("text/plain");
		console.log("Drop Event Target:", event.target, event.dataTransfer, id);

	var draggableElement = document.querySelector("[data-task-id='" + id + "']");
		console.log(draggableElement);
		console.dir(draggableElement);

	var dropZoneEl = event.target.closest(".task-list");

	var statusType = dropZoneEl.id;

	var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
		if (statusType === "tasks-to-do") {
			statusSelectEl.selectedIndex = 0;
		} 
		else if (statusType === "tasks-in-progress") {
			statusSelectEl.selectedIndex = 1;
		} 
		else if (statusType === "tasks-completed") {
			statusSelectEl.selectedIndex = 2;
		}
	
	dropZoneEl.removeAttribute("style");	
	dropZoneEl.appendChild(draggableElement);
};

var dragLeaveHandler = function(event) {
	var taskListEl = event.target.closest(".task-list");
		if (taskListEl) {
		taskListEl.removeAttribute("style");
		}
};

formEl.addEventListener("submit", taskFormHandler);  
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);