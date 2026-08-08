import api from "./axios";

// Thin wrappers around the notes endpoints so pages/components never
// build request URLs or payloads by hand.
export const fetchNotes = async () => {
  const { data } = await api.get("/notes");
  return data.notes;
};

export const createNote = async ({ title, content }) => {
  const { data } = await api.post("/notes", { title, content });
  return data.note;
};

export const updateNote = async (id, { title, content }) => {
  const { data } = await api.put(`/notes/${id}`, { title, content });
  return data.note;
};

export const deleteNote = async (id) => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};
