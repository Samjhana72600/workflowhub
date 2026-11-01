// The API base URL comes from an environment variable (see .env.example)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Token ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data.detail ||
      Object.entries(data)
        .map(([field, msgs]) => `${field}: ${[].concat(msgs).join(" ")}`)
        .join(" | ") ||
      "Request failed";
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (username, email, password) =>
    request("/auth/register/", { method: "POST", body: { username, email, password } }),
  login: (username, password) =>
    request("/auth/login/", { method: "POST", body: { username, password } }),
  logout: (token) => request("/auth/logout/", { method: "POST", token }),
  listItems: (token) => request("/items/", { token }),
  createItem: (token, item) => request("/items/", { method: "POST", body: item, token }),
  updateItem: (token, id, changes) =>
    request(`/items/${id}/`, { method: "PATCH", body: changes, token }),
  deleteItem: (token, id) => request(`/items/${id}/`, { method: "DELETE", token }),
};
