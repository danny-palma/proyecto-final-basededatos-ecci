import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  hasNotes: boolean;
}

export default function EmptyState({ hasNotes }: EmptyStateProps) {
  return (
    <Box textAlign="center" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom color="textSecondary">
        {!hasNotes ? 'No tienes notas todavía' : 'No se encontraron notas'}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {!hasNotes 
          ? '¡Crea tu primera nota haciendo clic en el botón +!' 
          : 'Prueba a cambiar los filtros de búsqueda'
        }
      </Typography>
    </Box>
  );
}