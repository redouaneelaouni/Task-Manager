import { useMemo } from "react";

export default function useTaskStats(tasks) {
  return useMemo(() => {
    const completed = tasks.filter((t) => t.status === "DONE").length;
    return {
      total: tasks.length,
      completed,
      remaining: tasks.length - completed,
      highPriority: tasks.filter((t) => t.priority === "HIGH").length,
    };
  }, [tasks]);
}
