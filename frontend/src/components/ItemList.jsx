import { useState } from "react";

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

function Item({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);

  const save = async () => {
    await onUpdate(item.id, { title, description });
    setEditing(false);
  };

  return (
    <li className={`card item ${item.status}`}>
      {editing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row">
            <button onClick={save}>Save</button>
            <button className="secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3>{item.title}</h3>
          {item.description && <p>{item.description}</p>}
          <div className="row">
            <select value={item.status} onChange={(e) => onUpdate(item.id, { status: e.target.value })}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button className="secondary" onClick={() => setEditing(true)}>Edit</button>
            <button className="danger" onClick={() => onDelete(item.id)}>Delete</button>
          </div>
        </>
      )}
    </li>
  );
}

export default function ItemList({ items, onUpdate, onDelete }) {
  if (items.length === 0) return <p className="muted">No workflow items yet. Add one above.</p>;
  return (
    <ul className="list">
      {items.map((item) => (
        <Item key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
