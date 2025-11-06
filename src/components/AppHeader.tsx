import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@mui/material';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface AppHeaderProps {
  userEmail?: string | null;
}

export default function AppHeader({ userEmail }: AppHeaderProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          📝 Mis Notas - {userEmail}
        </Typography>
        <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}