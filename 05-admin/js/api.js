const API_BASE = "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Error de API");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function apiGet(path) {
  return apiRequest(path);
}

function apiPost(path, data) {
  return apiRequest(path, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

function apiPatch(path, data) {
  return apiRequest(path, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

function apiDelete(path) {
  return apiRequest(path, { method: "DELETE" });
}

