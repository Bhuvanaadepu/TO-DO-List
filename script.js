document.addEventListener('DOMContentLoaded', loadTasks);
let currentFilter = 'all';

function addTask() {
  const input = document.getElementById('taskInput');
  const dueInput = document.getElementById('dueDateInput');
  const text = input.value.trim();
  const dueDate = dueInput.value;

  if (!text) return;

  const task = {
    text,
    completed: false,
    dueDate
  };

  const tasks = getTasksFromStorage();
  tasks.push(task);
  saveTasksToStorage(tasks);

  input.value = '';
  dueInput.value = '';
  loadTasks();
}

function loadTasks() {
  const tasks = getTasksFromStorage();
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  let completed = 0;
  tasks.forEach((task, index) => {
    if (task.completed) completed++;

    if (
      currentFilter === 'completed' && !task.completed ||
      currentFilter === 'pending' && task.completed
    ) return;

    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const daysLeft = getDaysLeft(task.dueDate);
    const isOverdue = daysLeft < 0 && !task.completed;

    li.innerHTML = `
      <div class="task-top">
        <span ondblclick="editTask(${index})">${task.text}</span>
        ${task.dueDate ? `<div class="due-date ${isOverdue ? 'overdue' : ''}">
          ${isOverdue ? 'Overdue!' : daysLeft === 0 ? 'Due Today' : `${daysLeft} day(s) left`}
        </div>` : ''}
      </div>
      <div>
        <button onclick="toggleComplete(${index})">✔️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateProgressBar(completed, tasks.length);
}

function getDaysLeft(dueDate) {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function editTask(index) {
  const tasks = getTasksFromStorage();
  const newText = prompt('Edit task:', tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim();
    saveTasksToStorage(tasks);
    loadTasks();
  }
}

function toggleComplete(index) {
  const tasks = getTasksFromStorage();
  tasks[index].completed = !tasks[index].completed;
  saveTasksToStorage(tasks);
  loadTasks();
}

function deleteTask(index) {
  const tasks = getTasksFromStorage();
  tasks.splice(index, 1);
  saveTasksToStorage(tasks);
  loadTasks();
}

function filterTasks(type) {
  currentFilter = type;
  loadTasks();
}

function updateProgressBar(completed, total) {
  const bar = document.getElementById('progress-bar');
  const percent = total === 0 ? 0 : (completed / total) * 100;
  bar.style.width = percent + '%';
}

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
