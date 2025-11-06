import {
  Container,
  Box,
  Grid,
  Fab,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotes, useNoteFilters, useNoteActions } from '../hooks';
import {
  AppHeader,
  SearchAndFilters,
  NoteCard,
  EmptyState,
  NoteDialog,
  NoteMenu
} from './';

export default function NotesApp() {
  const { currentUser } = useAuth();
  
  // Hooks personalizados
  const { notes, availableCategories, availableTags, loading: loadingNotes } = useNotes(currentUser?.uid);
  const {
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
  } = useNoteFilters(notes);
  
  const {
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
  } = useNoteActions();

  // Handlers que necesitan el currentUser
  const handleSaveNote = async () => {
    if (!currentUser) return;
    await saveNote(currentUser.uid);
  };

  return (
    <>
      <AppHeader userEmail={currentUser?.email} />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <SearchAndFilters
          searchText={searchText}
          setSearchText={setSearchText}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          showOnlyFavorites={showOnlyFavorites}
          setShowOnlyFavorites={setShowOnlyFavorites}
          availableCategories={availableCategories}
          availableTags={availableTags}
          onClearFilters={clearFilters}
        />

        {loadingNotes ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        ) : filteredNotes.length === 0 ? (
          <EmptyState hasNotes={notes.length > 0} />
        ) : (
          <Grid container spacing={3}>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onToggleFavorite={toggleFavorite}
                onMenuClick={openMenu}
              />
            ))}
          </Grid>
        )}

        <Fab
          color="primary"
          aria-label="Crear nueva nota"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => openDialog()}
        >
          <AddIcon />
        </Fab>
      </Container>

      <NoteMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        selectedNote={selectedNote}
        onToggleFavorite={toggleFavorite}
        onEdit={openDialog}
        onDelete={deleteNote}
      />

      <NoteDialog
        open={open}
        onClose={closeDialog}
        editingNote={editingNote}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        categories={categories}
        setCategories={setCategories}
        tags={tags}
        setTags={setTags}
        isFavorite={isFavorite}
        setIsFavorite={setIsFavorite}
        availableCategories={availableCategories}
        availableTags={availableTags}
        error={error}
        loading={loading}
        onSave={handleSaveNote}
      />
    </>
  );
}