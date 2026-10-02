import { useRef, useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Le titre est obligatoire");
      titleRef.current.focus();
      return;
    }
    setError("");
    try {
      await onAdd({ title: title.trim(), priority });
      setTitle("");
    } finally {
      titleRef.current.focus();
    }
  };

  return (
    <form className="row" onSubmit={submit}>
      <input ref={titleRef} aria-label="Titre" placeholder="Nouvelle tâche" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select aria-label="Priorité" value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
      <button type="submit">Ajouter</button>
      {error && <p role="alert" className="error">{error}</p>}
    </form>
  );
}
