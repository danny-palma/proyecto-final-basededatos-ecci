import { useState, useEffect } from 'react';
import type { Note } from '../types';

interface UseNoteFiltersReturn {
  filteredNotes: Note[];
  searchText: string;
  setSearchText: (text: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (show: boolean) => void;
  clearFilters: () => void;
}

export const useNoteFilters = (notes: Note[]): UseNoteFiltersReturn => {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    let filtered = notes;

    // Filtro por texto de búsqueda
    if (searchText) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchText.toLowerCase()) ||
        note.content.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtro por categoría
    if (selectedCategory) {
      filtered = filtered.filter(note =>
        note.categories?.includes(selectedCategory)
      );
    }

    // Filtro por tag
    if (selectedTag) {
      filtered = filtered.filter(note =>
        note.tags?.includes(selectedTag)
      );
    }

    // Filtro por favoritos
    if (showOnlyFavorites) {
      filtered = filtered.filter(note => note.isFavorite);
    }

    setFilteredNotes(filtered);
  }, [notes, searchText, selectedCategory, selectedTag, showOnlyFavorites]);

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory('');
    setSelectedTag('');
    setShowOnlyFavorites(false);
  };

  return {
    filteredNotes,
    searchText,
    setSearchText,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    showOnlyFavorites,
    setShowOnlyFavorites,
    clearFilters
  };
};