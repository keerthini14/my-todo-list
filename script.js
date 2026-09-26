const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('app_tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));
}

function renderTasks() {
    todoList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        if (currentFilter === 'active' && task.completed) return;
        if (currentFilter === 'completed' && !task.completed) return;

        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="todo-content" onclick="toggleTask(${index})">
                <span class="todo-text">${task.text}</span>
                <span class="todo-time">Added: ${task.createdAt}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(event, ${index})">&times;</button>
        `;
        
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const taskText = todoInput.value.trim();
    if (taskText === '') return;
    
    const timeStamp = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
                      ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    tasks.push({ text: taskText, completed: false, createdAt: timeStamp });
    todoInput.value = '';
    
    saveTasks();
    renderTasks();
});

window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
};

window.deleteTask = function(event, index) {
    event.stopPropagation();
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

window.filterTasks = function(filterType) {
    currentFilter = filterType;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTasks();
};

window.clearAllTasks = function() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
};

renderTasks();