var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var completeEditTask = function(taskName, taskLang, taskId) {
    //find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskLang;

    //update name and type in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskLang;
        }
    }

    saveTasks();

    formEl.reset();
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    alert("Task Updated!");
}


var taskFormHandler = function(event) {
    event.preventDefault();
    //get task name from form input
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    //capitalize first letter
    var taskNameDisplay = taskNameInput.charAt(0).toUpperCase() + taskNameInput.slice(1);
    
    //get task language from form drop down
    var taskLangInput = document.querySelector("select[name='task-language']").value;

    //check if values are empty strings
    if (!taskNameInput || !taskLangInput) {
        alert("Oops! It looks like your task is missing some information.");
        formEl.reset();
        return false;
    }

    //check formEl for data task id
    var isEdit = formEl.hasAttribute("data-task-id");

    //if editing task pass data to completeEditTask()
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskLangInput, taskId);
    //no data attribute so package form data into object as normal
    } else { 
        var taskDataObj = {
        name: taskNameDisplay,
        type: taskLangInput,
        status: "to do"
    }

        formEl.reset();

        //call function to create task and pass in task object data
        createTaskEl(taskDataObj);
    }

}

var createTaskEl = function(taskDataObj) {
    //create li
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    //make task draggable
    listItemEl.setAttribute("draggable", "true");

    //create div to hold task language
    var taskLangEl = document.createElement("div");
    taskLangEl.className = "task-info";
    //add HTML to div
    taskLangEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    //append div to li
    listItemEl.appendChild(taskLangEl);
    
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    //add li to list
    tasksToDoEl.appendChild(listItemEl);

    //add id to taskDataObj
    taskDataObj.id = taskIdCounter;

    //push into tasks array
    tasks.push(taskDataObj);

    //save to local storage
    saveTasks();
    

    taskIdCounter++;
}

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //delete btn
    //create edit button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;

}

var taskButtonHandler = function(event) {
    event.preventDefault();
    var targetEl = event.target;
    
    if (targetEl.matches(".delete-btn")) {
        //get task-id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    } else if (targetEl.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    };
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    //create new array to hold updated task list
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if task id doesn't match task id passed into function--keep task and push into new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    //reassign tasks arr to updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var editTask = function(taskId) {
    //identify task
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //get task info (name)
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    //get task info (language)
    var taskLang = taskSelected.querySelector("span.task-type").textContent;
    //insert task info onto submit form
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-language']").value = taskLang;
    //change submtit button to save task for edit mode
    document.querySelector("#save-task").textContent = "Save Task";
    //add task id to form element
    formEl.setAttribute("data-task-id", taskId);
};

var taskStatusChangeHandler = function(event) {
    //get item taskid
    var taskId = event.target.getAttribute("data-task-id");
    //get status value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    //get parent task item based on task id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    
    //append li to different column based on status value
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    };

    //update task status in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var dragTaskHandler = function(event) {
    //get task id
    var taskId = event.target.getAttribute("data-task-id");
    //store task id in dataTransfer property of dragEvent with setData()
    event.dataTransfer.setData("text/plain", taskId);
}

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if(taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: #6D435A; border-style: dotted;");
    }
}

var dropTaskHandler = function(event) {
    //get id of dragged task from dataTransfer property of drag event
    var taskId = event.dataTransfer.getData("text/plain");
    //reference DOM element with taskId
    var draggableTask = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    //reference drop zone task list as DOM element
    taskListEl = event.target.closest(".task-list");
    //capture status affiliated with drop zone task list
    var statusType = taskListEl.id;
    //reference select element as a document object
    var statusSelectEl = draggableTask.querySelector("select[name='status-change']");
    //change value of select drop down based on new task list id by using selectedIndex property
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    } else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    } else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    
    //append li to new drop zone task list 
    taskListEl.appendChild(draggableTask);
    taskListEl.removeAttribute("style");

    // loop through tasks array to find and update the updated task's status
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    };

    saveTasks();
}

var dragLeaveHandler = function(event) {
    var exitedListEl = event.target.closest(".task-list");
    if (exitedListEl) {
        exitedListEl.removeAttribute("style");
    }
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);
