const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");

setupLogout();

const sessionUser = getSession();
if (sessionUser) {
  message.textContent = `Sesion activa: ${sessionUser.email}`;
  message.classList.remove("d-none");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

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
  } catch (error) {
    message.textContent = "No se pudo conectar con la API";
    message.classList.remove("d-none");
    message.classList.remove("alert-info");
    message.classList.add("alert-danger");
  }
});

