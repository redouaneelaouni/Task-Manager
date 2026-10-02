import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as service from "./taskService";

const wrap = (call) => async (arg, { rejectWithValue }) => {
  try {
    return (await call(arg)).data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", wrap(() => service.getTasks()));
export const addTask = createAsyncThunk(
  "tasks/addTask",
  wrap(({ title, priority }) => service.createTask({ title, priority, status: "TODO" }))
);
export const updateTask = createAsyncThunk("tasks/updateTask", wrap((task) => service.updateTask(task.id, task)));
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id, { rejectWithValue }) => {
  try {
    await service.deleteTask(id);
    return id;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const nextStatus = (s) => (s === "DONE" ? "TODO" : "DONE");

// Optimistic update : le statut change tout de suite (pending), rollback si l'API échoue (rejected).
export const toggleTask = createAsyncThunk("tasks/toggleTask", async (task, { rejectWithValue }) => {
  try {
    return (await service.updateTask(task.id, { ...task, status: nextStatus(task.status) })).data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const initialState = { tasks: [], loading: false, error: null };
const setError = (state, action) => {
  state.error = action.payload ?? action.error.message;
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        setError(state, action);
      })
      .addCase(addTask.fulfilled, (state, { payload }) => {
        state.tasks.push(payload);
      })
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        const i = state.tasks.findIndex((t) => t.id === payload.id);
        if (i !== -1) state.tasks[i] = payload;
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.tasks = state.tasks.filter((t) => t.id !== payload);
      })
      .addCase(toggleTask.pending, (state, { meta }) => {
        const t = state.tasks.find((x) => x.id === meta.arg.id);
        if (t) t.status = nextStatus(meta.arg.status);
      })
      .addCase(toggleTask.rejected, (state, action) => {
        const t = state.tasks.find((x) => x.id === action.meta.arg.id);
        if (t) t.status = action.meta.arg.status; // rollback
        setError(state, action);
      })
      .addMatcher(
        (a) => [addTask, updateTask, deleteTask].some((thunk) => thunk.rejected.match(a)),
        setError
      );
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
