document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  document.getElementById("addBtn").addEventListener("click", addTask);
  document.getElementById("filterSelect").addEventListener("change", loadTasks);
});

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("categoryInput").value;
  const dueDate = document.getElementById("dueDateInput").value;

  if (text === "") return;

  const task = { text, category, dueDate, completed: false };
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  document.getElementById("taskInput").value = "";
  document.getElementById("dueDateInput").value = "";
  loadTasks();
}

function renderTask(task, index) {
  const li = document.createElement("li");
  li.className = "list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center";

  const infoDiv = document.createElement("div");
  infoDiv.className = "task-text" + (task.completed ? " completed" : "");
  infoDiv.textContent = task.text;
  infoDiv.onclick = () => toggleComplete(index);

  const metaDiv = document.createElement("div");
  metaDiv.className = "task-meta";
  metaDiv.innerHTML = `<strong>${task.category}</strong> | Due: ${task.dueDate || "N/A"}`;

  const buttonGroup = document.createElement("div");
  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.className = "btn btn-sm btn-outline-secondary me-1";
  editBtn.onclick = () => editTask(index);

  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.className = "btn btn-sm btn-outline-danger";
  delBtn.onclick = () => deleteTask(index);

  buttonGroup.append(editBtn, delBtn);

  const leftCol = document.createElement("div");
  leftCol.className = "d-flex flex-column flex-grow-1";
  leftCol.append(infoDiv, metaDiv);

  li.append(leftCol, buttonGroup);
  document.getElementById("taskList").appendChild(li);
}

function toggleComplete(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  loadTasks();
}

function editTask(index) {
  const tasks = getTasks();
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks(tasks);
    loadTasks();
  }
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  loadTasks();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const filter = document.getElementById("filterSelect").value;
  const tasks = getTasks();

  tasks.forEach((task, index) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    if (
      filter === "all" ||
      task.category === filter ||
      (filter === "completed" && task.completed) ||
      (filter === "overdue" && isOverdue)
    ) {
      renderTask(task, index);
    }
  });
}
