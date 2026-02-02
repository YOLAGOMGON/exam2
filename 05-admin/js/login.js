const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");

if (form) {
  const sessionUser = getSession();
  if (sessionUser) {
    if (typeof showView === "function") {
      showView(sessionUser.role === "admin" ? "admin" : "tasks");
    }
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
      if (typeof showView === "function") {
        showView(users[0].role === "admin" ? "admin" : "tasks");
      }
    } catch (error) {
      message.textContent = "No se pudo conectar con la API";
      message.classList.remove("d-none");
      message.classList.remove("alert-info");
      message.classList.add("alert-danger");
    }
  });
}

