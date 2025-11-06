import { useState } from 'react';
import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Note } from '../types';

interface UseNoteActionsReturn {
  // Dialog state
  open: boolean;
  editingNote: Note | null;
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  isFavorite: boolean;
  error: string;
  loading: boolean;
  
  // Menu state
  anchorEl: HTMLElement | null;
  selectedNote: Note | null;
  
  // Actions
  openDialog: (note?: Note) => void;
  closeDialog: () => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setCategories: (categories: string[]) => void;
  setTags: (tags: string[]) => void;
  setIsFavorite: (favorite: boolean) => void;
  saveNote: (userId: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  toggleFavorite: (note: Note) => Promise<void>;
  openMenu: (event: React.MouseEvent<HTMLElement>, note: Note) => void;
  closeMenu: () => void;
}

export const useNoteActions = (): UseNoteActionsReturn => {
  // Dialog state
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const openDialog = (note?: Note) => {
    // Cerrar el menú antes de abrir el diálogo
    setAnchorEl(null);
    setSelectedNote(null);
    
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
      setCategories(note.categories || []);
      setTags(note.tags || []);
      setIsFavorite(note.isFavorite || false);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
      setCategories([]);
      setTags([]);
      setIsFavorite(false);
    }
    setOpen(true);
    setError('');
  };

  const closeDialog = () => {
    setOpen(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategories([]);
    setTags([]);
    setIsFavorite(false);
    setError('');
    // Cerrar el menú si está abierto
    setAnchorEl(null);
    setSelectedNote(null);
  };

  const saveNote = async (userId: string) => {
    if (!title.trim() || !content.trim()) {
      setError('Por favor completa el título y el contenido');
      return;
    }

    setLoading(true);
    try {
      const now = Timestamp.now();
      
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        categories,
        tags,
        isFavorite,
        updatedAt: now
      };
      
      if (editingNote) {
        // Actualizar nota existente
        await updateDoc(doc(db, 'notes', editingNote.id), noteData);
      } else {
        // Crear nueva nota
        await addDoc(collection(db, 'notes'), {
          ...noteData,
          createdAt: now,
          userId: userId
        });
      }
      
      closeDialog();
    } catch (error: any) {
      setError('Error al guardar la nota: ' + error.message);
    }
    setLoading(false);
  };

  const deleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      closeMenu();
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    }
  };

  const toggleFavorite = async (note: Note) => {
    try {
      await updateDoc(doc(db, 'notes', note.id), {
        isFavorite: !note.isFavorite,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, note: Note) => {
    setAnchorEl(event.currentTarget);
    setSelectedNote(note);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setSelectedNote(null);
  };

  return {
    // Dialog state
    open,
    editingNote,
    title,
    content,
    categories,
    tags,
    isFavorite,
    error,
    loading,
    
    // Menu state
    anchorEl,
    selectedNote,
    
    // Actions
    openDialog,
    closeDialog,
    setTitle,
    setContent,
    setCategories,
    setTags,
    setIsFavorite,
    saveNote,
    deleteNote,
    toggleFavorite,
    openMenu,
    closeMenu
  };
};