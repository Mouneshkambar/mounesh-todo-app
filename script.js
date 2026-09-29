const STORAGE_KEY = "mounesh-todo-tasks";

let tasks = [];
let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter-btn");

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        tasks = storedTasks ? JSON.parse(storedTasks) : [];

        if (!Array.isArray(tasks)) {
            tasks = [];
        }
    } catch (error) {
        console.error("Could not load tasks:", error);
        tasks = [];
    }

    renderTasks();
}

function addTask(text) {
    const trimmedText = text.trim();

    if (!trimmedText) {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        text: trimmedText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    taskInput.value = "";
    taskInput.focus();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(item => item.id === id);

    if (!task) {
        return;
    }

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const trimmedText = newText.trim();

    if (!trimmedText) {
        alert("Task cannot be empty.");
        return;
    }

    task.text = trimmedText;
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    const task = tasks.find(item => item.id === id);

    if (!task) {
        return;
    }

    tasks = tasks.filter(item => item.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(item => item.id === id);

    if (!task) {
        return;
    }

    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

function getFilteredTasks() {
    if (currentFilter === "active") {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}

function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = `task${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark "${task.text}" as completed`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, text, editButton, deleteButton);

    return li;
}

function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = getFilteredTasks();

    filteredTasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });

    emptyMessage.classList.toggle("hidden", filteredTasks.length !== 0);

    const count = tasks.length;
    taskCount.textContent = `${count} ${count === 1 ? "task" : "tasks"}`;
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();
    addTask(taskInput.value);
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.toggle("active", btn === button);
        });

        renderTasks();
    });
});

loadTasks();
