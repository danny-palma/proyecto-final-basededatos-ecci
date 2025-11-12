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
  Box,
  Typography
} from '@mui/material';
import {
  Category as CategoryIcon,
  Tag as TagIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import type { Note } from '../types';

// Límites de caracteres
const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 5000;

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
      scroll="paper"
      PaperProps={{
        'aria-modal': 'true',
        role: 'dialog',
        sx: {
          maxHeight: '90vh',
          margin: '16px',
          width: 'calc(100% - 32px)',
          '@media (max-width: 600px)': {
            margin: '8px',
            width: 'calc(100% - 16px)'
          }
        }
      }}
    >
      <DialogTitle id="note-dialog-title">
        <Typography 
          variant="h6" 
          component="h2"
          sx={{
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.4
          }}
        >
          {editingNote ? 'Editar Nota' : 'Nueva Nota'}
        </Typography>
      </DialogTitle>
      <DialogContent 
        id="note-dialog-description"
        sx={{
          paddingTop: 2,
          paddingBottom: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '4px'
          }
        }}
      >
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              wordWrap: 'break-word',
              wordBreak: 'break-word'
            }}
          >
            {error}
          </Alert>
        )}
        
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{ 
            maxLength: TITLE_MAX_LENGTH,
            style: { 
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }
          }}
          helperText={`${title.length}/${TITLE_MAX_LENGTH} caracteres`}
          error={title.length > TITLE_MAX_LENGTH}
          sx={{ 
            mb: 2,
            '& .MuiInputBase-input': {
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5
            }
          }}
        />
        
        <TextField
          margin="dense"
          label="Contenido"
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          inputProps={{ 
            maxLength: CONTENT_MAX_LENGTH,
            style: { 
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6
            }
          }}
          helperText={`${content.length}/${CONTENT_MAX_LENGTH} caracteres`}
          error={content.length > CONTENT_MAX_LENGTH}
          sx={{ 
            mb: 2,
            '& .MuiInputBase-input': {
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              resize: 'vertical',
              minHeight: '120px'
            },
            '& .MuiInputBase-root': {
              alignItems: 'flex-start'
            }
          }}
        />
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              freeSolo
              options={availableCategories}
              value={categories}
              onChange={(_, newValue) => {
                // Limitar a máximo 15 categorías
                if (newValue.length <= 15) {
                  setCategories(newValue);
                }
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.length > 20 ? `${option.substring(0, 17)}...` : option}
                    color="primary"
                    icon={<CategoryIcon />}
                    title={option} // Tooltip con el texto completo
                    {...getTagProps({ index })}
                    key={index}
                    sx={{
                      maxWidth: '200px',
                      '& .MuiChip-label': {
                        wordWrap: 'break-word',
                        wordBreak: 'break-word',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categorías"
                  placeholder={categories.length >= 15 ? "Máximo 15 categorías" : "Agregar categoría..."}
                  helperText={`${categories.length}/15 categorías`}
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
              onChange={(_, newValue) => {
                // Limitar a máximo 15 etiquetas
                if (newValue.length <= 15) {
                  setTags(newValue);
                }
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.length > 20 ? `${option.substring(0, 17)}...` : option}
                    color="secondary"
                    icon={<TagIcon />}
                    title={option} // Tooltip con el texto completo
                    {...getTagProps({ index })}
                    key={index}
                    sx={{
                      maxWidth: '200px',
                      '& .MuiChip-label': {
                        wordWrap: 'break-word',
                        wordBreak: 'break-word',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Etiquetas"
                  placeholder={tags.length >= 15 ? "Máximo 15 etiquetas" : "Agregar etiqueta..."}
                  helperText={`${tags.length}/15 etiquetas`}
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
        <Button 
          onClick={onSave} 
          variant="contained" 
          disabled={
            loading || 
            title.length === 0 || 
            title.length > TITLE_MAX_LENGTH || 
            content.length > CONTENT_MAX_LENGTH
          }
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}