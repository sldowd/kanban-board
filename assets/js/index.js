var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");


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
        alert("Oops! Looks like your task is missing some information.");
        formEl.reset();
        return false;
    }


    //package form data into object
    var taskDataObj = {
        name: taskNameDisplay,
        type: taskLangInput
    }

    formEl.reset();

    //call function to create task and pass in task object data
    createTaskEl(taskDataObj);

}

var createTaskEl = function(taskDataObj) {
    //create li
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

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
    } else if (targetEl.matches(".select-status")) {
        var taskId = event.target.getAttribute("data-task-id");
        changeTaskStatus(taskId);
    };
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
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

var changeTaskStatus = function(taskId) {
    
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);