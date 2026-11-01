import { useCallback, useEffect, useState } from "react";
import { api } from "./api.js";
import AuthForm from "./components/AuthForm.jsx";
import ItemForm from "./components/ItemForm.jsx";
import ItemList from "./components/ItemList.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const saveSession = ({ token, username }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setToken(token);
    setUsername(username);
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername("");
    setItems([]);
  };

  const loadItems = useCallback(async () => {
    try {
      setItems(await api.listItems(token));
      setError("");
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes("token")) clearSession();
    }
  }, [token]);

  useEffect(() => {
    if (token) loadItems();
  }, [token, loadItems]);

  const handleLogout = async () => {
    try {
      await api.logout(token);
    } finally {
      clearSession();
    }
  };

  const wrap = (fn) => async (...args) => {
    try {
      await fn(...args);
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = wrap((item) => api.createItem(token, item));
  const handleUpdate = wrap((id, changes) => api.updateItem(token, id, changes));
  const handleDelete = wrap((id) => api.deleteItem(token, id));

  if (!token) {
    return (
      <main className="container">
        <h1>WorkFlowHub</h1>
        <AuthForm onAuth={saveSession} />
      </main>
    );
  }

  return (
    <main className="container">
      <header className="top-bar">
        <h1>WorkFlowHub</h1>
        <div>
          <span className="muted">Signed in as {username}</span>{" "}
          <button className="secondary" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      {error && <p className="error">{error}</p>}
      <ItemForm onCreate={handleCreate} />
      <ItemList items={items} onUpdate={handleUpdate} onDelete={handleDelete} />
    </main>
  );
}
