const user = requireAuth("user");
if (!user) {
  throw new Error("Sin sesion");
}

setupLogout();

document.getElementById("profileName").textContent = user.name;
document.getElementById("profileEmail").textContent = user.email;
document.getElementById("profileRole").textContent = user.role;

