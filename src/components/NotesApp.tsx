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
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExitToApp as LogoutIcon,
  MoreVert as MoreVertIcon
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
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'notes'),
      where('userId', '==', currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData: Note[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notesData.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          userId: data.userId
        });
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [currentUser]);

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
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
    }
    setOpen(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
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
      
      if (editingNote) {
        // Actualizar nota existente
        await updateDoc(doc(db, 'notes', editingNote.id), {
          title,
          content,
          updatedAt: now
        });
      } else {
        // Crear nueva nota
        await addDoc(collection(db, 'notes'), {
          title,
          content,
          createdAt: now,
          updatedAt: now,
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
        {notes.length === 0 ? (
          <Box textAlign="center" sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom color="textSecondary">
              No tienes notas todavía
            </Typography>
            <Typography variant="body1" color="textSecondary">
              ¡Crea tu primera nota haciendo clic en el botón +!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {notes.map((note) => (
              <Grid key={note.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" component="h2" gutterBottom>
                        {note.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, note)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {note.content.length > 150
                        ? note.content.substring(0, 150) + '...'
                        : note.content}
                    </Typography>
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
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
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