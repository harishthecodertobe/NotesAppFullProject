import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import { createNote, deleteNote, fetchNotes, updateNote } from "../api/notes";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  // Starts true/empty already, so the initial-load effect below never needs
  // to set state synchronously before its first await.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetches notes on mount. State is only touched after the awaited call
  // resolves/rejects, and a cancelled flag guards against a late response
  // landing after unmount.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchNotes();
        if (!cancelled) setNotes(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Reusable manual refresh for the "Try again" retry button. This runs
  // from a click handler, never from an effect.
  const reloadNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const openCreateForm = () => {
    setEditingNote(null);
    setFormOpen(true);
  };

  const openEditForm = (note) => {
    setEditingNote(note);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingNote(null);
  };

  const handleSubmit = async (payload) => {
    if (editingNote) {
      const updated = await updateNote(editingNote._id, payload);
      setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
    } else {
      const created = await createNote(payload);
      setNotes((prev) => [created, ...prev]);
    }
    closeForm();
  };

  const handleDelete = async (note) => {
    const confirmed = window.confirm(`Delete "${note.title}"? This can't be undone.`);
    if (!confirmed) return;

    setDeletingId(note._id);
    try {
      await deleteNote(note._id);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Your notes</h1>
            <p className="dashboard-subtitle">
              {notes.length > 0
                ? `${notes.length} note${notes.length === 1 ? "" : "s"}`
                : "Nothing here yet"}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={openCreateForm}>
            + New note
          </button>
        </div>

        {error && (
          <div className="form-error banner-error banner-error-row">
            <span>{error}</span>
            <button type="button" className="icon-btn" onClick={reloadNotes}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="page-loader">
            <div className="spinner" />
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <h2>No notes yet</h2>
            <p>Capture your first thought — it takes seconds.</p>
            <button type="button" className="btn btn-primary" onClick={openCreateForm}>
              Create your first note
            </button>
          </div>
        ) : (
          <div className="note-grid">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={openEditForm}
                onDelete={handleDelete}
                deleting={deletingId === note._id}
              />
            ))}
          </div>
        )}
      </main>

      {formOpen && (
        <NoteForm
          key={editingNote?._id || "new"}
          initialNote={editingNote}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}

export default Dashboard;
