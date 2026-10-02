import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../features/tasks/taskSlice";

export const createStore = () => configureStore({ reducer: { tasks: taskReducer } });
export default createStore();
