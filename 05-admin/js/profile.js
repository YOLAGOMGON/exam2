const user = requireAuth("user");
if (!user) {
  throw new Error("Sin sesion");
}

setupLogout();

document.getElementById("profileName").textContent = user.name;
document.getElementById("profileEmail").textContent = user.email;
document.getElementById("profileRole").textContent = user.role;
document.getElementById("profileNameInfo").textContent = user.name;

async function loadTasksCount() {
  const tasks = await apiGet(`/tasks?userId=${user.id}`);
  document.getElementById("profileTasks").textContent = tasks.length;
}

loadTasksCount();

