import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNotes, addNote, updateNote, deleteNote } from "../api/notes.api";
import { Trash2, Plus, Save } from "lucide-react";
import styles from "../styles/NotesPage.module.scss";

export default function NotesPage() {
  const { tripId } = useParams();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeNote, setActiveNote] = useState<any>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorType, setEditorType] = useState("TRIP");

  const fetchNotes = async () => {
    try {
      const res = await getNotes(tripId!);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [tripId]);

  const handleSelectNote = (note: any) => {
    setActiveNote(note);
    setEditorTitle(note.title || "");
    setEditorContent(note.content);
    setEditorType(note.type);
  };

  const handleNewNote = () => {
    setActiveNote(null);
    setEditorTitle("");
    setEditorContent("");
    setEditorType("TRIP");
  };

  const handleSave = async () => {
    if (!editorContent.trim()) return;
    try {
      if (activeNote) {
        await updateNote(tripId!, activeNote.id, {
          title: editorTitle,
          content: editorContent,
          type: editorType
        });
      } else {
        const res = await addNote(tripId!, {
          title: editorTitle,
          content: editorContent,
          type: editorType
        });
        setActiveNote(res.data);
      }
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteNote(tripId!, noteId);
      if (activeNote?.id === noteId) {
        handleNewNote();
      }
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading notes...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Trip Journal</h1>
        <button onClick={handleNewNote} className={styles.newBtn}>
          <Plus size={16} /> New Note
        </button>
      </header>

      <div className={styles.layout}>
        <div className={styles.listCol}>
          {notes.map((note) => (
            <div
              key={note.id}
              className={`${styles.noteCard} ${activeNote?.id === note.id ? styles.active : ""}`}
              onClick={() => handleSelectNote(note)}
            >
              <div className={styles.cardHeader}>
                <span className={`${styles.badge} ${styles[note.type]}`}>{note.type}</span>
                <button onClick={(e) => handleDelete(note.id, e)} className={styles.deleteBtn}>
                  <Trash2 size={14} />
                </button>
              </div>
              <h4>{note.title || (note.content.length > 30 ? note.content.substring(0, 30) + "..." : note.content)}</h4>
              <span className={styles.time}>{new Date(note.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {notes.length === 0 && (
            <div className={styles.emptyList}>
              <p>No notes yet.</p>
              <button onClick={handleNewNote}>Create one</button>
            </div>
          )}
        </div>

        <div className={styles.editorCol}>
          {(activeNote || editorContent || editorTitle) || notes.length === 0 ? (
            <div className={styles.editor}>
              <div className={styles.editorHeader}>
                <select value={editorType} onChange={(e) => setEditorType(e.target.value)}>
                  <option value="TRIP">Trip Note</option>
                  <option value="STOP">Stop Note</option>
                  <option value="DAY">Daily Journal</option>
                </select>
                <button onClick={handleSave} className={styles.saveBtn}>
                  <Save size={16} /> Save
                </button>
              </div>
              <input
                type="text"
                className={styles.titleInput}
                placeholder="Title (optional)"
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
              />
              <textarea
                className={styles.contentInput}
                placeholder="Start typing your note here..."
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
              />
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Select a note to read or edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
