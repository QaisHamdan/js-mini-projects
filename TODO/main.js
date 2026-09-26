/* 
    Student Tasks:
    [1] Use Sweet Alert If Input Is Empty
    [2] Check If Task Is Exist
    [3] Create Delete All Tasks Button
    [4] Create Finish All Tasks Button
    [5] Add To Tasks To The Local Storage
*/

// Setting Up Variables 
let theInput = document.querySelector(".add-task input");
let theAddButton = document.querySelector(".add-task .plus");
let tasksContainer = document.querySelector(".tasks-content");
let tasksCount = document.querySelector(".tasks-count span");
let tasksCompleted = document.querySelector(".tasks-completed span");

// Focus On Input Field
window.onload = function () {
    theInput.focus();
};

// Adding The Task 
theAddButton.onclick = function () {

    // [1] If Input Is Empty -> Sweet Alert
    if (theInput.value.trim() === '') {

        Swal.fire({
            title: 'خطأ!',
            text: 'برجاء كتابة عنوان المهمة أولاً',
            icon: 'warning',
            confirmButtonText: 'حسناً'
        });

    } else {

        // [2] Check If Task Is Exist
        let isExist = false;
        let allTasks = document.querySelectorAll(".tasks-content .task-box");

        allTasks.forEach(task => {
            // نتحقق من النص بدون كلمة Delete
            let taskText = task.childNodes[0].textContent.trim();
            if (taskText.toLowerCase() === theInput.value.trim().toLowerCase()) {
                isExist = true;
            }
        });

        if (isExist) {

            Swal.fire({
                title: 'مهمة مكررة!',
                text: 'هذه المهمة موجودة بالفعل في القائمة',
                icon: 'error',
                confirmButtonText: 'حسناً'
            });

        } else {

            // Remove No Tasks Message If Exists
            let noTasksMsg = document.querySelector(".no-tasks-message");
            if (noTasksMsg) {
                noTasksMsg.remove();
            }

            // Create Main Span Element
            let mainspan = document.createElement("span");

            // Create Delete Button
            let deleteElement = document.createElement("span");

            // Create The Main Span Text
            let text = document.createTextNode(theInput.value.trim());

            // Create The Delete Button Text
            let deleteText = document.createTextNode("Delete");

            // Add Text To Main Span
            mainspan.appendChild(text);

            // Add Class To Main Span
            mainspan.className = 'task-box';

            // Add Text To Delete Button
            deleteElement.appendChild(deleteText);

            // Add Class To Delete Button
            deleteElement.className = 'delete';

            // Add Delete Button To Main Span
            mainspan.appendChild(deleteElement);

            // Add The Task To The Container
            tasksContainer.appendChild(mainspan);

            // Empty The Input & Focus
            theInput.value = '';
            theInput.focus();

            // Calculate Tasks
            CalculateTasks();
        }
    }
};

document.addEventListener('click', function (e) {

    // Delete Task
    if (e.target.classList.contains('delete')) {

        // Remove Current Task
        e.target.parentNode.remove();

        // Check Number Of Tasks Inside The Container
        if (tasksContainer.childElementCount === 0) {
            createNoTasks();
        }

        // Update Calculation
        CalculateTasks();
    }

    // Finish Task
    if (e.target.classList.contains('task-box')) {

        // [تم التصحيح] Toggle Class 'finished'
        e.target.classList.toggle("finished");

        // Update Calculation
        CalculateTasks();
    }

    // [3] Delete All Tasks Button
    if (e.target.classList.contains('delete-all')) {
        
        let allTasks = document.querySelectorAll(".tasks-content .task-box");
        allTasks.forEach(task => task.remove());

        createNoTasks();
        CalculateTasks();
    }

    // [4] Finish All Tasks Button
    if (e.target.classList.contains('finish-all')) {

        let allTasks = document.querySelectorAll(".tasks-content .task-box");
        allTasks.forEach(task => task.classList.add("finished"));

        CalculateTasks();
    }
});

// Function To Create No Tasks Message
function createNoTasks() {

    let msgSpan = document.createElement("span");
    // [تم التصحيح] إضافة msgText بدلاً من msgSpan نفسه
    let msgText = document.createTextNode("No Tasks To Show");

    msgSpan.appendChild(msgText);
    // [تم التصحيح] تعديل اسم الكلاس
    msgSpan.className = 'no-tasks-message';

    tasksContainer.appendChild(msgSpan);
}

// Function To Calculate Tasks
function CalculateTasks() {

    // [تم التصحيح] استخدام querySelectorAll للحصول على العدد Correctly
    tasksCount.innerHTML = document.querySelectorAll('.tasks-content .task-box').length;

    tasksCompleted.innerHTML = document.querySelectorAll('.tasks-content .task-box.finished').length;
}