const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");

const sessionUser = getSession();
if (sessionUser) {
  message.textContent = `Sesion activa: ${sessionUser.email}`;
  message.classList.remove("d-none");
  logoutBtn.classList.remove("d-none");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const users = await apiGet(
      `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(
        password
      )}`
    );

    if (users.length === 0) {
      message.textContent = "Credenciales invalidas";
      message.classList.remove("d-none");
      message.classList.remove("alert-info");
      message.classList.add("alert-danger");
      return;
    }

    saveSession(users[0]);
    message.textContent = "Login correcto. Sesion guardada.";
    message.classList.remove("d-none");
    message.classList.remove("alert-danger");
    message.classList.add("alert-info");
    logoutBtn.classList.remove("d-none");
  } catch (error) {
    message.textContent = "No se pudo conectar con la API";
    message.classList.remove("d-none");
    message.classList.remove("alert-info");
    message.classList.add("alert-danger");
  }
});

logoutBtn.addEventListener("click", () => {
  clearSession();
  message.textContent = "Sesion cerrada";
  message.classList.remove("d-none");
  logoutBtn.classList.add("d-none");
});

