import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void | Promise<void>;
  onClear?: () => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  autoFocus?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  placeholder = 'Buscar...',
  onChange,
  onSubmit,
  onClear,
  fullWidth = true,
  size = 'medium',
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const controlled = value !== undefined;
  const currentValue = controlled ? value : localValue;

  useEffect(() => {
    if (controlled) setLocalValue(value ?? '');
  }, [controlled, value]);

  const updateValue = (next: string) => {
    if (!controlled) setLocalValue(next);
    onChange?.(next);
  };

  const handleClear = () => {
    updateValue('');
    onClear?.();
  };

  return (
    <TextField
      fullWidth={fullWidth}
      value={currentValue}
      placeholder={placeholder}
      onChange={(event) => updateValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') void onSubmit?.(currentValue);
      }}
      autoFocus={autoFocus}
      size={size}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment>
        ),
        endAdornment: currentValue ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear} aria-label="Limpiar búsqueda"><ClearIcon fontSize="small" /></IconButton>
          </InputAdornment>
        ) : undefined,
        sx: {
          bgcolor: 'background.elevated',
          '&:hover': { bgcolor: 'background.highlight' },
        },
      }}
    />
  );
};

export default SearchInput;
