import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, deleteTask, fetchTasks, toggleTask, clearError } from "./features/tasks/taskSlice";
import { selectError, selectLoading, selectTasks } from "./features/tasks/selectors";
import TaskForm from "./components/TaskForm";
import TaskFilter from "./components/TaskFilter";
import TaskList from "./components/TaskList";
import TaskStats from "./components/TaskStats";

export default function App() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  // State local : les filtres sont purement UI, inutile de les mettre dans Redux.
  const [filters, setFilters] = useState({ search: "", status: "ALL", priority: "ALL" });
  const searchRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAdd = useCallback((task) => dispatch(addTask(task)).unwrap().catch(() => {}), [dispatch]);
  const handleToggle = useCallback((task) => dispatch(toggleTask(task)), [dispatch]);
  const handleDelete = useCallback((id) => dispatch(deleteTask(id)), [dispatch]);

  return (
    <main>
      <h1>Task Manager</h1>
      <TaskStats tasks={tasks} />
      <TaskForm onAdd={handleAdd} />
      <TaskFilter filters={filters} onChange={setFilters} searchRef={searchRef} />

      {error && (
        <div role="alert" className="banner">
          <span>{error}</span>
          <button onClick={() => dispatch(fetchTasks())}>Réessayer</button>
          <button className="ghost" onClick={() => dispatch(clearError())}>Fermer</button>
        </div>
      )}
      {loading ? (
        <p className="muted">Chargement…</p>
      ) : (
        <TaskList tasks={tasks} filters={filters} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </main>
  );
}
