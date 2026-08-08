// Cycles a small set of accent colors across cards, like a real notebook
// where every page doesn't look identical. Purely visual, keyed off note id.
const ACCENTS = ["accent-pine", "accent-ochre", "accent-clay", "accent-indigo"];

function getAccent(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i)) % ACCENTS.length;
  }
  return ACCENTS[hash];
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function NoteCard({ note, onEdit, onDelete, deleting }) {
  return (
    <article className={`note-card ${getAccent(note._id)}`} style={deleting ? { opacity: 0.5 } : undefined}>
      <div className="note-card-body">
        <h3 className="note-title">{note.title}</h3>
        <p className="note-content">{note.content}</p>
      </div>

      <div className="note-card-footer">
        <span className="note-date">{formatDate(note.updatedAt || note.createdAt)}</span>
        <div className="note-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(note)}
            aria-label="Edit note"
            disabled={deleting}
          >
            Edit
          </button>
          <button
            type="button"
            className="icon-btn icon-btn-danger"
            onClick={() => onDelete(note)}
            aria-label="Delete note"
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default NoteCard;
