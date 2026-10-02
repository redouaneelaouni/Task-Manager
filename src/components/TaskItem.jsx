import { memo } from "react";

// memo + callbacks stables (useCallback dans App) : un item ne re-render que si sa tâche change.
function TaskItem({ task, onToggle, onDelete }) {
  const done = task.status === "DONE";
  return (
    <li className={done ? "done" : ""}>
      <label>
        <input type="checkbox" checked={done} onChange={() => onToggle(task)} />
        <span>{task.title}</span>
      </label>
      <span className={`tag ${task.priority}`}>{task.priority}</span>
      <button className="ghost" onClick={() => onDelete(task.id)} aria-label={`Supprimer ${task.title}`}>Supprimer</button>
    </li>
  );
}

export default memo(TaskItem);
