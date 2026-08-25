import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

interface EqualizerPreset {
  name: string;
  values: number[];
}

interface EqualizerProps {
  enabled?: boolean;
  values?: number[];
  onChange?: (values: number[]) => void;
  onToggle?: () => void;
  onPresetChange?: (preset: string) => void;
}

const presets: EqualizerPreset[] = [
  { name: 'Personalizado', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Bass Boost', values: [80, 60, 40, 20, 0, 0, 0, 0, 0, 0] },
  { name: 'Vocal', values: [-20, -10, 0, 20, 30, 30, 20, 10, 0, -10] },
  { name: 'Rock', values: [40, 30, 20, 0, -20, -20, 0, 20, 30, 40] },
  { name: 'Jazz', values: [30, 20, -10, -20, 0, 0, -20, -10, 20, 30] },
  { name: 'Pop', values: [-10, 10, 30, 40, 30, 30, 40, 30, 10, -10] },
  { name: 'Classical', values: [0, 0, 0, 0, 0, 0, -10, -20, -30, -40] },
  { name: 'Hip-Hop', values: [60, 40, 20, 0, -10, -10, 0, 20, 40, 60] },
];

const frequencies = ['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'];

const Equalizer: React.FC<EqualizerProps> = ({
  enabled = false,
  values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  onChange,
  onToggle,
  onPresetChange,
}) => {
  const handleSliderChange = (index: number) => (_: Event, newValue: number | number[]) => {
    const newValues = [...values];
    newValues[index] = newValue as number;
    onChange?.(newValues);
  };

  const handleReset = () => onChange?.([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">Ecualizador</Typography>
          <Tooltip title={enabled ? 'Desactivar ecualizador' : 'Activar ecualizador'}>
            <IconButton onClick={onToggle} size="small" color={enabled ? 'primary' : 'default'}>
              <PowerSettingsNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={handleReset}>
          Restablecer
        </Button>
      </Box>

      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Preset</InputLabel>
        <Select label="Preset" defaultValue="Personalizado" onChange={(e) => onPresetChange?.(e.target.value as string)}>
          {presets.map((preset) => <MenuItem key={preset.name} value={preset.name}>{preset.name}</MenuItem>)}
        </Select>
      </FormControl>

      <Grid container spacing={1} alignItems="flex-end">
        {values.map((value, index) => (
          <Grid item key={frequencies[index]} xs={6} sm={1.2} sx={{ textAlign: 'center' }}>
            <Box sx={{ height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Slider
                value={value}
                onChange={handleSliderChange(index)}
                orientation="vertical"
                min={-20}
                max={20}
                step={1}
                disabled={!enabled}
                sx={{
                  height: '100%',
                  color: enabled ? 'primary.main' : 'grey.600',
                  '& .MuiSlider-thumb': { width: 16, height: 8, borderRadius: 1 },
                }}
              />
              <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>{frequencies[index]}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{value > 0 ? `+${value}` : value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Equalizer;
