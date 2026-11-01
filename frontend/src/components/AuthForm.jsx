import { useState } from "react";
import { api } from "../api.js";

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data =
        mode === "login"
          ? await api.login(username, password)
          : await api.register(username, email, password);
      onAuth(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{mode === "login" ? "Log in" : "Create an account"}</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      {mode === "register" && (
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      )}
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">{mode === "login" ? "Log in" : "Register"}</button>
      <button
        type="button"
        className="link"
        onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
      >
        {mode === "login" ? "Need an account? Register" : "Have an account? Log in"}
      </button>
    </form>
  );
}
