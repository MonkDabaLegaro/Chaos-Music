import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';

interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

const SearchInput: React.FC<SearchInputProps> = ({
  value: initialValue = '',
  placeholder = 'Buscar...',
  onChange,
  onClear,
  fullWidth = true,
  size = 'medium',
}) => {
  const [localValue, setLocalValue] = useState(initialValue);

  const value = initialValue !== undefined ? initialValue : localValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (initialValue === undefined) {
      setLocalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClear = () => {
    if (initialValue === undefined) {
      setLocalValue('');
    }
    onChange?.('');
    onClear?.();
  };

  return (
    <TextField
      fullWidth={fullWidth}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      size={size}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          bgcolor: 'background.elevated',
          '&:hover': {
            bgcolor: 'background.highlight',
          },
        },
      }}
    />
  );
};

export default SearchInput;
