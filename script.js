let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let searchQuery = "";

/* ---------- ADD TASK ---------- */
function addTask() {
    let input = document.getElementById("taskInput");
    let dateInput = document.getElementById("dueDateInput");

    let taskText = input.value.trim();
    let dueDate = dateInput.value;

    if (taskText === "") return;

    let task = {
        text: taskText,
        completed: false,
        dueDate: dueDate || null
    };

    tasks.push(task);

    input.value = "";
    dateInput.value = "";

    saveAndRender();
}

/* ---------- DISPLAY TASKS ---------- */
function displayTasks(filter = currentFilter) {
    currentFilter = filter;

    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const today = new Date().toISOString().split("T")[0];

    tasks.forEach((task, index) => {

        if (filter === "completed" && !task.completed) return;
        if (filter === "pending" && task.completed) return;

        if (
            searchQuery &&
            !task.text.toLowerCase().includes(searchQuery.toLowerCase())
        ) return;

        let li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // Overdue or Today Highlight
        if (task.dueDate && !task.completed) {
            if (task.dueDate < today) {
                li.classList.add("overdue");
            } else if (task.dueDate === today) {
                li.classList.add("today");
            }
        }

        li.innerHTML = `
            <div class="task-left">
                <label class="toggle">
                    <input type="checkbox"
                        ${task.completed ? "checked" : ""}
                        onchange="toggleTask(${index})">
                    <span class="slider"></span>
                </label>
                <span class="task-text">
                    ${task.text}
                    ${
                        task.dueDate
                            ? `<span class="due-date">(Due: ${task.dueDate})</span>`
                            : ""
                    }
                </span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });
}

/* ---------- TOGGLE ---------- */
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

/* ---------- DELETE ---------- */
function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

/* ---------- FILTER ---------- */
function filterTasks(type) {
    currentFilter = type;
    displayTasks(type);
}

/* ---------- SEARCH ---------- */
function handleSearch() {
    const input = document.getElementById("searchInput");
    searchQuery = input.value;
    displayTasks();
}

/* ---------- PROGRESS ---------- */
function updateProgress() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");

    progressText.textContent = `${completedTasks} / ${totalTasks} tasks completed`;

    const percentage = totalTasks === 0
        ? 0
        : (completedTasks / totalTasks) * 100;

    progressFill.style.width = percentage + "%";
}

/* ---------- SAVE & RENDER ---------- */
function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    updateProgress();
}

/* ---------- INITIAL LOAD ---------- */
displayTasks();
updateProgress();

/* ---------- CONNECT ADD BUTTON ---------- */
document.getElementById("addBtn")
        .addEventListener("click", addTask);