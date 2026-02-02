const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");

const sessionUser = getSession();
if (sessionUser) {
  redirectByRole(sessionUser);
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
    redirectByRole(users[0]);
  } catch (error) {
    message.textContent = "No se pudo conectar con la API";
    message.classList.remove("d-none");
    message.classList.remove("alert-info");
    message.classList.add("alert-danger");
  }
});

