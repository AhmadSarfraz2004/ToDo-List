document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('.task-text').textContent,
                completed: item.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                createTaskElement(task.text, task.completed);
            });
        }
    }

    function createTaskElement(taskText, isCompleted = false) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        if (isCompleted) {
            taskItem.classList.add('completed');
        }

        const taskTextSpan = document.createElement('span');
        taskTextSpan.classList.add('task-text');
        taskTextSpan.textContent = taskText;

        taskTextSpan.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveTasks(); // Save after state change
        });

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');


        const editIcon = document.createElement('span');
        editIcon.classList.add('icon', 'edit-btn');
        editIcon.innerHTML = '<img src="../images/icons/pen.svg" alt="Edit">';
        editIcon.addEventListener('click', () => {

            if (taskItem.querySelector('input[type="text"]')) {
                return;
            }

            const currentText = taskTextSpan.textContent;
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = currentText;
            editInput.classList.add('edit-task-input');


            taskItem.insertBefore(editInput, taskTextSpan);
            taskItem.removeChild(taskTextSpan);
            editInput.focus();
            editInput.setSelectionRange(editInput.value.length, editInput.value.length);

            const saveEdit = () => {
                const newText = editInput.value.trim();
                if (newText !== '') {
                    taskTextSpan.textContent = newText;
                    taskItem.insertBefore(taskTextSpan, editInput);
                    taskItem.removeChild(editInput);
                    saveTasks();
                } else {

                    taskTextSpan.textContent = currentText;
                    taskItem.insertBefore(taskTextSpan, editInput);
                    taskItem.removeChild(editInput);
                }
            };

            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit();
                }
            });

            editInput.addEventListener('blur', saveEdit);
        });


        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('icon', 'delete-btn');
        deleteIcon.innerHTML = '<img src="../images/icons/trash.svg" alt="Delete">';

        deleteIcon.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            saveTasks();
        });

        taskActions.appendChild(editIcon);
        taskActions.appendChild(deleteIcon);

        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(taskActions);

        taskList.appendChild(taskItem);
    }


    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            createTaskElement(taskText);
            saveTasks();
            taskInput.value = '';
        } else {
            alert('Please enter a task!');
        }
    }

    // Add task on button click
    addTaskBtn.addEventListener('click', addTask);

    // Add task on Enter key press in the input field
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Load tasks when the page loads
    loadTasks();
});