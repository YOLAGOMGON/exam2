const user = requireAuth("user");
if (!user) {
  throw new Error("Sin sesion");
}

setupLogout();

const taskForm = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const tasksBody = document.getElementById("tasksBody");
const emptyState = document.getElementById("emptyState");
const tasksCount = document.getElementById("tasksCount");

let tasks = [];

function updateCount() {
  tasksCount.textContent = `${tasks.length} tareas`;
}

function resetForm() {
  taskIdInput.value = "";
  taskForm.reset();
  cancelEditBtn.classList.add("d-none");
}

function renderTasks() {
  tasksBody.innerHTML = tasks
    .map((task) => {
      return `<tr>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>
          <select class="form-select form-select-sm status-select" data-id="${
            task.id
          }">
            <option value="pending" ${
              task.status === "pending" ? "selected" : ""
            }>pending</option>
            <option value="in progress" ${
              task.status === "in progress" ? "selected" : ""
            }>in progress</option>
            <option value="completed" ${
              task.status === "completed" ? "selected" : ""
            }>completed</option>
          </select>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${
            task.id
          }">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${
            task.id
          }">Eliminar</button>
        </td>
      </tr>`;
    })
    .join("");

  emptyState.classList.toggle("d-none", tasks.length > 0);
  updateCount();
}

async function loadTasks() {
  tasks = await apiGet(`/tasks?userId=${user.id}`);
  renderTasks();
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const status = statusInput.value;

  if (!title || !description) {
    return;
  }

  if (taskIdInput.value) {
    const updated = await apiPatch(`/tasks/${taskIdInput.value}`, {
      title,
      description,
      status,
    });
    tasks = tasks.map((task) => (task.id === updated.id ? updated : task));
  } else {
    const newTask = await apiPost("/tasks", {
      title,
      description,
      status,
      userId: user.id,
      createdAt: new Date().toISOString(),
    });
    tasks.push(newTask);
  }

  renderTasks();
  resetForm();
});

cancelEditBtn.addEventListener("click", () => {
  resetForm();
});

tasksBody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) {
    return;
  }

  const task = tasks.find((item) => String(item.id) === id);
  if (!task) {
    return;
  }

  if (action === "edit") {
    taskIdInput.value = task.id;
    titleInput.value = task.title;
    descriptionInput.value = task.description;
    statusInput.value = task.status;
    cancelEditBtn.classList.remove("d-none");
  }

  if (action === "delete") {
    const confirmDelete = confirm("Eliminar esta tarea?");
    if (!confirmDelete) {
      return;
    }
    await apiDelete(`/tasks/${task.id}`);
    tasks = tasks.filter((item) => item.id !== task.id);
    renderTasks();
    resetForm();
  }
});

tasksBody.addEventListener("change", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) {
    return;
  }
  if (!target.classList.contains("status-select")) {
    return;
  }
  const id = target.dataset.id;
  const task = tasks.find((item) => String(item.id) === id);
  if (!task) {
    return;
  }
  const updated = await apiPatch(`/tasks/${task.id}`, {
    status: target.value,
  });
  tasks = tasks.map((item) => (item.id === updated.id ? updated : item));
});

loadTasks();

