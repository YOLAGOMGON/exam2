function viewExists(view) {
  return document.querySelector(`[data-view="${view}"]`);
}

function getDefaultView(user) {
  if (!user) {
    return "login";
  }
  if (user.role === "admin" && viewExists("admin")) {
    return "admin";
  }
  if (viewExists("tasks")) {
    return "tasks";
  }
  return "login";
}

function showView(view) {
  const user = typeof getSession === "function" ? getSession() : null;
  let target = view;

  if (!user) {
    if (target !== "login" && target !== "register") {
      target = "login";
    }
  } else if (user.role === "admin") {
    if (target !== "admin") {
      target = viewExists("admin") ? "admin" : "login";
    }
  } else if (target === "admin") {
    target = "tasks";
  }

  const targetEl = viewExists(target) || viewExists("login");
  const views = document.querySelectorAll("[data-view]");
  views.forEach((item) => {
    item.classList.toggle("active", item === targetEl);
  });
  return Boolean(targetEl);
}

function initApp() {
  const user = typeof getSession === "function" ? getSession() : null;
  showView(getDefaultView(user));
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-go]");
  if (!link) {
    return;
  }
  event.preventDefault();
  const view = link.dataset.go;
  if (view) {
    showView(view);
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

