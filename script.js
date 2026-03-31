document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const taskCounter = document.getElementById('task-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const dateDisplay = document.getElementById('date-display');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme logic
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Fallback to system preference if no saved theme
        document.body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        let theme = 'light';
        if (document.body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
        }
        localStorage.setItem('theme', theme);
    });

    // State
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Set Date
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);

    // Render Initial Todos
    renderTodos();

    // Event Listeners
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            addTodo(text);
            input.value = '';
        }
    });

    todoList.addEventListener('click', (e) => {
        // Handle deletion
        if (e.target.closest('.delete-btn')) {
            const id = e.target.closest('.todo-item').dataset.id;
            deleteTodo(id);
        } 
        // Handle toggle completion
        else if (e.target.closest('.todo-content')) {
            const id = e.target.closest('.todo-item').dataset.id;
            toggleTodo(id);
        }
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Set filter and render
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Functions
    function addTodo(text) {
        const todo = {
            id: Date.now().toString(),
            text,
            completed: false
        };
        todos.push(todo);
        saveAndRender();
    }

    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveAndRender();
    }

    function deleteTodo(id) {
        const item = document.querySelector(`[data-id="${id}"]`);
        if(item) {
            item.style.animation = 'fadeIn 0.3s ease reverse forwards';
            
            setTimeout(() => {
                todos = todos.filter(todo => todo.id !== id);
                saveAndRender();
            }, 300);
        }
    }

    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    function renderTodos() {
        // Filter todos
        let filteredTodos = todos;
        if (currentFilter === 'pending') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        // Render DOM
        todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            const li = document.createElement('li');
            li.style.color = '#64748b';
            li.style.textAlign = 'center';
            li.style.padding = '20px 0';
            li.textContent = currentFilter === 'all' 
                ? "No tasks yet. Add one above!" 
                : `No ${currentFilter} tasks.`;
            todoList.appendChild(li);
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.dataset.id = todo.id;
                
                li.innerHTML = `
                    <div class="todo-content">
                        <div class="checkbox">
                            <i class="fas fa-check"></i>
                        </div>
                        <span class="todo-text">${escapeHTML(todo.text)}</span>
                    </div>
                    <button class="delete-btn" aria-label="Delete task">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                todoList.appendChild(li);
            });
        }

        // Update stats
        const activeTasks = todos.filter(t => !t.completed).length;
        taskCounter.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    // Utility to prevent XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
