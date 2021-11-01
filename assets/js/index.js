var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do")

var createTaskHandler = function(event) {
    event.preventDefault();
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    //get task name from form input
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskNameDisplay = taskNameInput.charAt(0).toUpperCase() + taskNameInput.slice(1);
    
    //get task language from form drop down
    var taskLangInput = document.querySelector("select[name='task-language']").value;

    //create div to hold task language
    var taskLangEl = document.createElement("div");
    taskLangEl.className = "task-info";
    //add HTML to div
    taskLangEl.innerHTML = "<h3 class='task-name'>" + taskNameDisplay + "</h3><span class='task-type'>" + taskLangInput + "</span>";
    //append div to li
    listItemEl.appendChild(taskLangEl);
    
    //add li to list
    tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", createTaskHandler);