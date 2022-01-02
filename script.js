const $categoryBtn = document.querySelector('.todo-category');
const $categoryTitle = document.querySelector('.chosen-category-name');
const $todoCount = document.querySelector('.list-count');
const $todoForm = document.querySelector('.todo-form');
const $inputField = document.querySelector('.input-field');
const $inputBtn = document.querySelector('.input-submit');
const $todoList = document.querySelector('.todo-list');

$todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
})

const store = {
    setLocalStorage(todo) {
        localStorage.setItem('todo', JSON.stringify(todo));
    },
    getLocalStorage() {
        return JSON.parse(localStorage.getItem('todo'));
    },
}

function App() {
    this.todo = {
        Event: [],
        Work: [],
        Shopping: [],
        Health: [],
        Personal: [],
    };

    this.currentCategory = 'Event';

    this.init = () => {
        if (store.getLocalStorage()) {
            this.todo = store.getLocalStorage();
        }
        render();
        initEventListeners();
    }

    const render = () => {
        const template = this.todo[this.currentCategory].map((item, index) => {
            return `
            <li data-todo-id="${index}" class="todo-list-item">
                <span class="${item.done ? "done" : ""} todo-name">${item.name}</span>
                <button type="button" class="todo-item-button done-button">done</button>
                <button type="button" class="todo-item-button edit-button">edit</button>
                <button type="button" class="todo-item-button delete-button">delete</button>
            </li>`;
        }).join('');
        $todoList.innerHTML = template;
        updateTodoCount();
    }

    const updateTodoCount = () => {
        let doneTodoCount = 0;
        this.todo[this.currentCategory].map((item) => {
            if (item.done) doneTodoCount++;
        });
        const todoCount = this.todo[this.currentCategory].length;
        $todoCount.innerHTML = `${doneTodoCount} / ${todoCount}`;
    }

    const addTodoName = () => {
        if ($inputField.value === '') return;
        const todoName = $inputField.value;
        this.todo[this.currentCategory].push({ name: todoName });
        store.setLocalStorage(this.todo);
        render();
        $inputField.value = '';
    }

    const editTodoName = (e) => {
        const todoId = e.target.closest('li').dataset.todoId;
        const $todoName = e.target.closest('li').querySelector('.todo-name');
        const todoName = $todoName.innerText;
        const updateTodoName = prompt('Please fill out the corrections.', todoName);
        if (updateTodoName === null || updateTodoName === '') return;
        this.todo[this.currentCategory][todoId].name = updateTodoName;
        store.setLocalStorage(this.todo);
        render();
    }

    const deleteTodoName = (e) => {
        if (confirm('Are you sure you want to delete it?')) {
            const todoId = e.target.closest('li').dataset.todoId;
            this.todo[this.currentCategory].splice(todoId, 1);
            store.setLocalStorage(this.todo);
            render();
        }
    }
    
    const doneTodo = (e) => {
        const todoId = e.target.closest('li').dataset.todoId;
        this.todo[this.currentCategory][todoId].done =
            !this.todo[this.currentCategory][todoId].done;
        store.setLocalStorage(this.todo);
        render();
    }

    const initEventListeners = () => {
        $inputBtn.addEventListener('click', addTodoName);

        $inputField.addEventListener('keypress', (e) => {
            if (e.key !== 'Enter') return;
            addTodoName();
        })

        $todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-button')) {
                editTodoName(e);
                return;
            }

            if (e.target.classList.contains('delete-button')) {
                deleteTodoName(e);
                return;
            }

            if (e.target.classList.contains('done-button')) {
                doneTodo(e);
                return;    
            }
        })

        $categoryBtn.addEventListener('click', (e) => {
            const isCategoryBtn = e.target.classList.contains('todo-category-name');
            if (isCategoryBtn) {
                const categoryName = e.target.innerText;
                this.currentCategory = categoryName;
                $categoryTitle.innerText = categoryName;
                render();
            }
        })
    }
}

const app = new App();
app.init();