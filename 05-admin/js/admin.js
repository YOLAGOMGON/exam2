const admin = requireAuth("admin");
if (!admin) {
  throw new Error("Sin sesion");
}

setupLogout();

const metricTotal = document.getElementById("metricTotal");
const metricPending = document.getElementById("metricPending");
const metricProgress = document.getElementById("metricProgress");
const metricCompleted = document.getElementById("metricCompleted");

const adminForm = document.getElementById("adminForm");
const taskIdInput = document.getElementById("taskId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const tasksBody = document.getElementById("tasksBody");
const emptyState = document.getElementById("emptyState");

let tasks = [];
let users = [];

function getUserName(userId) {
  const user = users.find((item) => item.id === userId);
  return user ? user.name : `User ${userId}`;
}

function renderMetrics() {
  metricTotal.textContent = tasks.length;
  metricPending.textContent = tasks.filter(
    (task) => task.status === "pending"
  ).length;
  metricProgress.textContent = tasks.filter(
    (task) => task.status === "in progress"
  ).length;
  metricCompleted.textContent = tasks.filter(
    (task) => task.status === "completed"
  ).length;
}

function resetForm() {
  taskIdInput.value = "";
  adminForm.reset();
  cancelEditBtn.classList.add("d-none");
}

function renderTasks() {
  tasksBody.innerHTML = tasks
    .map((task) => {
      return `<tr>
        <td>${task.title}</td>
        <td>${getUserName(task.userId)}</td>
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
  renderMetrics();
}

async function loadData() {
  users = await apiGet("/users");
  tasks = await apiGet("/tasks");
  renderTasks();
}

adminForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!taskIdInput.value) {
    return;
  }

  const updated = await apiPatch(`/tasks/${taskIdInput.value}`, {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    status: statusInput.value,
  });

  tasks = tasks.map((task) => (task.id === updated.id ? updated : task));
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
  renderTasks();
});

loadData();

