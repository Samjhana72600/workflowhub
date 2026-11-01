import { useState } from "react";

export default function ItemForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({ title: title.trim(), description });
    setTitle("");
    setDescription("");
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>New workflow item</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button type="submit">Add item</button>
    </form>
  );
}
