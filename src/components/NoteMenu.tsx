import {
  Menu,
  MenuItem
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import type { Note } from '../types';

interface NoteMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  selectedNote: Note | null;
  onToggleFavorite: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export default function NoteMenu({
  anchorEl,
  open,
  onClose,
  selectedNote,
  onToggleFavorite,
  onEdit,
  onDelete
}: NoteMenuProps) {
  const handleToggleFavorite = () => {
    if (selectedNote) {
      onToggleFavorite(selectedNote);
    }
    onClose();
  };

  const handleEdit = () => {
    if (selectedNote) {
      onEdit(selectedNote);
    }
    onClose();
  };

  const handleDelete = () => {
    if (selectedNote) {
      onDelete(selectedNote.id);
    }
    onClose();
  };

  return (
    <Menu
      id="note-options-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': 'note-options-button',
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleToggleFavorite}>
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
      <MenuItem onClick={handleEdit}>
        <EditIcon fontSize="small" sx={{ mr: 1 }} />
        Editar
      </MenuItem>
      <MenuItem onClick={handleDelete}>
        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
        Eliminar
      </MenuItem>
    </Menu>
  );
}