import {
  Grid,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch,
  Autocomplete
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

interface SearchAndFiltersProps {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (show: boolean) => void;
  availableCategories: string[];
  availableTags: string[];
  onClearFilters: () => void;
}

export default function SearchAndFilters({
  searchText,
  setSearchText,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  showOnlyFavorites,
  setShowOnlyFavorites,
  availableCategories,
  availableTags,
  onClearFilters
}: SearchAndFiltersProps) {
  return (
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
            onClick={onClearFilters}
          >
            Limpiar
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}