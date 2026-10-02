import { useMemo } from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, filters, onToggle, onDelete }) {
  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) &&
        (filters.status === "ALL" || t.status === filters.status) &&
        (filters.priority === "ALL" || t.priority === filters.priority)
    );
  }, [tasks, filters]);

  if (!visible.length) return <p className="muted">Aucune tâche à afficher.</p>;
  return (
    <ul className="list">
      {visible.map((t) => <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />)}
    </ul>
  );
}
