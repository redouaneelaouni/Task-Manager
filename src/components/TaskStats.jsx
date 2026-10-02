import useTaskStats from "../hooks/useTaskStats";

export default function TaskStats({ tasks }) {
  const { total, completed, remaining, highPriority } = useTaskStats(tasks);
  return (
    <dl className="stats">
      <div><dt>Total</dt><dd>{total}</dd></div>
      <div><dt>Done</dt><dd>{completed}</dd></div>
      <div><dt>Remaining</dt><dd>{remaining}</dd></div>
      <div><dt>High Priority</dt><dd>{highPriority}</dd></div>
    </dl>
  );
}
