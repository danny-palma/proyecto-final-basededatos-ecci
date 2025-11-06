import { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Alert,
  Menu,
  MenuItem,
  Chip,
  Autocomplete,
  FormControlLabel,
  Switch,
  InputAdornment,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExitToApp as LogoutIcon,
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Note } from '../types';

export default function NotesApp() {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  // Estados para filtros y búsqueda
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Listas para autocomplete
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    setLoadingNotes(true);
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', currentUser.uid),
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
      setLoadingNotes(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Efecto para filtrar notas
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleOpenDialog = (note?: Note) => {
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

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategories([]);
    setTags([]);
    setIsFavorite(false);
    setError('');
  };

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Por favor completa el título y el contenido');
      return;
    }

    if (!currentUser) return;

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
          userId: currentUser.uid
        });
      }
      
      handleCloseDialog();
    } catch (error: any) {
      setError('Error al guardar la nota: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      handleCloseMenu();
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
    }
  };

  const handleToggleFavorite = async (note: Note) => {
    try {
      await updateDoc(doc(db, 'notes', note.id), {
        isFavorite: !note.isFavorite,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedCategory('');
    setSelectedTag('');
    setShowOnlyFavorites(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, note: Note) => {
    setAnchorEl(event.currentTarget);
    setSelectedNote(note);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedNote(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📝 Mis Notas - {currentUser?.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Barra de filtros y búsqueda */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Buscar notas..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchText('')} size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <Autocomplete
                options={availableCategories}
                value={selectedCategory}
                onChange={(_, newValue) => setSelectedCategory(newValue || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Categoría"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <Autocomplete
                options={availableTags}
                value={selectedTag}
                onChange={(_, newValue) => setSelectedTag(newValue || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Etiqueta"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <TagIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyFavorites}
                    onChange={(e) => setShowOnlyFavorites(e.target.checked)}
                    color="error"
                  />
                }
                label="Solo favoritos"
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={handleClearFilters}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Loading circular */}
        {loadingNotes ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        ) : filteredNotes.length === 0 ? (
          <Box textAlign="center" sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              {notes.length === 0 ? 'No tienes notas todavía' : 'No se encontraron notas'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {notes.length === 0 
                ? '¡Crea tu primera nota haciendo clic en el botón +!' 
                : 'Prueba a cambiar los filtros de búsqueda'
              }
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredNotes.map((note) => (
              <Grid key={note.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: note.isFavorite ? '2px solid #f50057' : 'none',
                  position: 'relative'
                }}>
                  {note.isFavorite && (
                    <FavoriteIcon 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8, 
                        color: '#f50057',
                        zIndex: 1
                      }} 
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, pt: note.isFavorite ? 5 : 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" component="h2" gutterBottom>
                        {note.title}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleFavorite(note)}
                          sx={{ mr: 0.5 }}
                        >
                          {note.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, note)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {note.content.length > 100
                        ? note.content.substring(0, 100) + '...'
                        : note.content}
                    </Typography>
                    
                    {/* Categorías */}
                    {note.categories && note.categories.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        {note.categories.map((category, index) => (
                          <Chip
                            key={index}
                            label={category}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                            icon={<CategoryIcon />}
                          />
                        ))}
                      </Box>
                    )}
                    
                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        {note.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                            icon={<TagIcon />}
                          />
                        ))}
                      </Box>
                    )}
                    
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" color="textSecondary">
                      Actualizada: {formatDate(note.updatedAt)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Container>

      {/* Menu contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          if (selectedNote) {
            handleToggleFavorite(selectedNote);
          }
          handleCloseMenu();
        }}>
          {selectedNote?.isFavorite ? (
            <>
              <FavoriteBorderIcon fontSize="small" sx={{ mr: 1 }} />
              Quitar de favoritos
            </>
          ) : (
            <>
              <FavoriteIcon fontSize="small" sx={{ mr: 1 }} />
              Agregar a favoritos
            </>
          )}
        </MenuItem>
        <MenuItem onClick={() => {
          handleOpenDialog(selectedNote!);
          handleCloseMenu();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleDeleteNote(selectedNote!.id)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Dialog para crear/editar notas */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingNote ? 'Editar Nota' : 'Nueva Nota'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Contenido"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                freeSolo
                options={availableCategories}
                value={categories}
                onChange={(_, newValue) => setCategories(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      color="primary"
                      icon={<CategoryIcon />}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categorías"
                    placeholder="Agregar categoría..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <CategoryIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                multiple
                freeSolo
                options={availableTags}
                value={tags}
                onChange={(_, newValue) => setTags(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      color="secondary"
                      icon={<TagIcon />}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Etiquetas"
                    placeholder="Agregar etiqueta..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <TagIcon />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          
          <FormControlLabel
            control={
              <Switch
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                color="error"
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <FavoriteIcon color={isFavorite ? "error" : "disabled"} />
                Marcar como favorito
              </Box>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveNote} variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}