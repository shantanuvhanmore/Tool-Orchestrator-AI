document.getElementById('add-todo').addEventListener('click', function() {
    var input = document.getElementById('todo-input');
    var todoText = input.value;
    if (todoText) {
        var li = document.createElement('li');
        li.textContent = todoText;
        document.getElementById('todo-list').appendChild(li);
        input.value = '';
    }
});

document.getElementById('todo-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('add-todo').click();
    }
});

// Accessibility improvements
document.getElementById('add-todo').setAttribute('aria-label', 'Add Todo');
document.getElementById('todo-input').setAttribute('aria-label', 'Input for new todo');