const form = document.getElementById("registerForm");
const message = document.getElementById("registerMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const existing = await apiGet(`/users?email=${encodeURIComponent(email)}`);
    if (existing.length > 0) {
      message.textContent = "Ese correo ya esta registrado";
      message.classList.remove("d-none");
      message.classList.remove("alert-info");
      message.classList.add("alert-danger");
      return;
    }

    const user = await apiPost("/users", {
      name,
      email,
      password,
      role: "user",
    });

    saveSession(user);
    message.textContent = "Registro correcto. Sesion guardada.";
    message.classList.remove("d-none");
    message.classList.remove("alert-danger");
    message.classList.add("alert-info");
    form.reset();
  } catch (error) {
    message.textContent = "No se pudo conectar con la API";
    message.classList.remove("d-none");
    message.classList.remove("alert-info");
    message.classList.add("alert-danger");
  }
});

