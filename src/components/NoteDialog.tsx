import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Grid,
  Autocomplete,
  Chip,
  FormControlLabel,
  Switch,
  InputAdornment,
  Box
} from '@mui/material';
import {
  Category as CategoryIcon,
  Tag as TagIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import type { Note } from '../types';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  editingNote: Note | null;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  isFavorite: boolean;
  setIsFavorite: (favorite: boolean) => void;
  availableCategories: string[];
  availableTags: string[];
  error: string;
  loading: boolean;
  onSave: () => void;
}

export default function NoteDialog({
  open,
  onClose,
  editingNote,
  title,
  setTitle,
  content,
  setContent,
  categories,
  setCategories,
  tags,
  setTags,
  isFavorite,
  setIsFavorite,
  availableCategories,
  availableTags,
  error,
  loading,
  onSave
}: NoteDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="note-dialog-title"
      aria-describedby="note-dialog-description"
      keepMounted={false}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      disableRestoreFocus={false}
      hideBackdrop={false}
      PaperProps={{
        'aria-modal': 'true',
        role: 'dialog'
      }}
    >
      <DialogTitle id="note-dialog-title">
        {editingNote ? 'Editar Nota' : 'Nueva Nota'}
      </DialogTitle>
      <DialogContent id="note-dialog-description">
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
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave} variant="contained" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}