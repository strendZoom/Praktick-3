
const input = document.querySelector('#title');

async function CreateTodos() {
  const response = await fetch("/api/db.json", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
          title: input.value,
          completed: false
      })
  });
  if (response.ok === true) {
        const todo = await response.json();
        todoToHtml(todo);
  }
}

const getAllTodos = async () => {
  const response = await fetch(`api/db.json`);
  const todos = await response.json();
  todos.forEach(todos => todoToHtml(todos));
}

window.addEventListener('DOMContentLoaded', getAllTodos);

function todoToHtml({id, completed, title}) {
  const todoList = document.getElementById('todos');
  todoList.insertAdjacentHTML('beforeend', `
  <div id="todo${id}" class="block">
    <input onchange='toggleCompleteTodo(${id})' class="form-check-input" type="checkbox" ${completed && 'checked'} role="switch"">
    <label name="title" class="form-check-label" for="flexSwitchCheckDefault">${title}</label>
    <button type="button" onclick='deleteTodo(${id})' class="btn-close" aria-label="Close"></button>
  </div>
  `)
};


const deleteTodo = async (id) => {
  const response = await fetch("/api/db.json/" + id, {
    method: "DELETE",
    headers: { "Accept": "application/json" }
    
});
if (response.ok === true) {
    const todos = await response.json();
    const remove = document.querySelector(`#todo${id}`).remove();
}};

async function toggleCompleteTodo(id) {
  const completed = document.querySelector(`#todo${id} input`).checked;
  const response = await fetch(`api/db.json/${id}`, {
    method: "PUT",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      completed
    })
});
const data = await response.json();
console.log(data)
}