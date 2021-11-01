var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do")

var taskFormHandler = function(event) {
    event.preventDefault();
    //get task name from form input
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    //capitalize first letter
    var taskNameDisplay = taskNameInput.charAt(0).toUpperCase() + taskNameInput.slice(1);
    
    //get task language from form drop down
    var taskLangInput = document.querySelector("select[name='task-language']").value;

    //package form data into object
    var taskDataObj = {
        name: taskNameDisplay,
        type: taskLangInput
    }

    //call function to create task and pass in task object data
    createTaskEl(taskDataObj);

}

var createTaskEl = function(taskDataObj) {
    //create li
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
     //create div to hold task language
     var taskLangEl = document.createElement("div");
     taskLangEl.className = "task-info";
     //add HTML to div
     taskLangEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
     //append div to li
     listItemEl.appendChild(taskLangEl);
     
     //add li to list
     tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", taskFormHandler);