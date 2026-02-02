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

function setupLogout(selector = ".logout-btn") {
  const buttons = document.querySelectorAll(selector);
  if (buttons.length === 0) {
    return;
  }
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      clearSession();
    });
  });
}

