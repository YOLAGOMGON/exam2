const SESSION_KEY = "crudtask_session";

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function redirectByRole(user) {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  if (user.role === "admin") {
    clearSession();
    window.location.href = "index.html";
    return;
  }
  window.location.href = "tasks.html";
}

function requireAuth(role) {
  const user = getSession();
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  if (role && user.role !== role) {
    redirectByRole(user);
    return null;
  }
  return user;
}

function setupLogout(buttonId = "logoutBtn") {
  const btn = document.getElementById(buttonId);
  if (!btn) {
    return;
  }
  btn.addEventListener("click", () => {
    clearSession();
    window.location.href = "index.html";
  });
}

