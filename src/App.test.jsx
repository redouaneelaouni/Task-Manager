import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { vi } from "vitest";
import App from "./App";
import { createStore } from "./app/store";
import * as service from "./features/tasks/taskService";

vi.mock("./features/tasks/taskService");

const data = [
  { id: 1, title: "Écrire le rapport", priority: "HIGH", status: "TODO" },
  { id: 2, title: "Relire le code", priority: "LOW", status: "DONE" },
];
const setup = () => render(<Provider store={createStore()}><App /></Provider>);

beforeEach(() => {
  vi.resetAllMocks();
  service.getTasks.mockResolvedValue({ data });
});

test("affiche le chargement puis les tâches et les stats", async () => {
  setup();
  expect(screen.getByText(/Chargement/)).toBeInTheDocument();
  expect(await screen.findByText("Écrire le rapport")).toBeInTheDocument();
  expect(screen.getByText("High Priority").nextSibling).toHaveTextContent("1");
});

test("refuse un titre composé d'espaces", async () => {
  setup();
  await screen.findByText("Écrire le rapport");
  await userEvent.type(screen.getByLabelText("Titre"), "   ");
  await userEvent.click(screen.getByText("Ajouter"));
  expect(screen.getByRole("alert")).toHaveTextContent("obligatoire");
  expect(service.createTask).not.toHaveBeenCalled();
});

test("ajoute une tâche, vide le champ et remet le focus", async () => {
  service.createTask.mockResolvedValue({ data: { id: 3, title: "Nouvelle", priority: "MEDIUM", status: "TODO" } });
  setup();
  await screen.findByText("Écrire le rapport");
  const input = screen.getByLabelText("Titre");
  await userEvent.type(input, "Nouvelle");
  await userEvent.click(screen.getByText("Ajouter"));
  expect(await screen.findByText("Nouvelle")).toBeInTheDocument();
  await waitFor(() => expect(input).toHaveValue(""));
  expect(input).toHaveFocus();
});

test("filtre par statut", async () => {
  setup();
  await screen.findByText("Écrire le rapport");
  await userEvent.selectOptions(screen.getByLabelText("Statut"), "DONE");
  expect(screen.queryByText("Écrire le rapport")).not.toBeInTheDocument();
  expect(screen.getByText("Relire le code")).toBeInTheDocument();
});

test("erreur API puis Retry", async () => {
  service.getTasks.mockRejectedValueOnce(Object.assign(new Error("Erreur serveur"), { status: 500 }));
  setup();
  expect(await screen.findByRole("alert")).toHaveTextContent("Erreur serveur");
  service.getTasks.mockResolvedValue({ data });
  await userEvent.click(screen.getByText("Réessayer"));
  expect(await screen.findByText("Écrire le rapport")).toBeInTheDocument();
});

test("rollback du toggle optimiste si l'API échoue", async () => {
  service.updateTask.mockRejectedValue(Object.assign(new Error("Erreur serveur"), { status: 500 }));
  setup();
  await screen.findByText("Écrire le rapport");
  const box = screen.getAllByRole("checkbox")[0];
  await userEvent.click(box);
  await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
  expect(box).not.toBeChecked();
});
