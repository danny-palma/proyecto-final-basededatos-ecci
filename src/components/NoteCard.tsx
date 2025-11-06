import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Category as CategoryIcon,
  Tag as TagIcon
} from '@mui/icons-material';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onToggleFavorite: (note: Note) => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>, note: Note) => void;
}

export default function NoteCard({
  note,
  onToggleFavorite,
  onMenuClick
}: NoteCardProps) {
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
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                onClick={() => onToggleFavorite(note)}
                sx={{ mr: 0.5 }}
                aria-label={note.isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                {note.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => onMenuClick(e, note)}
                aria-label="Opciones de la nota"
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
  );
}