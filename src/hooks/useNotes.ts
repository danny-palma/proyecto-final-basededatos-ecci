import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Note } from '../types';

interface UseNotesReturn {
  notes: Note[];
  availableCategories: string[];
  availableTags: string[];
  loading: boolean;
}

export const useNotes = (userId: string | undefined): UseNotesReturn => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData: Note[] = [];
      const categoriesSet = new Set<string>();
      const tagsSet = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const noteData: Note = {
          id: doc.id,
          title: data.title,
          content: data.content,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          userId: data.userId,
          categories: data.categories || [],
          tags: data.tags || [],
          isFavorite: data.isFavorite || false
        };
        
        notesData.push(noteData);
        
        // Recopilar categorías y tags únicos
        noteData.categories?.forEach(cat => categoriesSet.add(cat));
        noteData.tags?.forEach(tag => tagsSet.add(tag));
      });
      
      setNotes(notesData);
      setAvailableCategories(Array.from(categoriesSet));
      setAvailableTags(Array.from(tagsSet));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return {
    notes,
    availableCategories,
    availableTags,
    loading
  };
};