import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import type { Genre } from '@shared/types';
import React from 'react';

interface GenreListProps {
  genres?: Genre[];
  onGenreClick?: (genre: Genre) => void;
}

const GenreList: React.FC<GenreListProps> = ({ genres = [], onGenreClick }) => (
  <Grid container spacing={2}>
    {genres.map((genre) => (
      <Grid item xs={6} sm={4} md={3} key={genre.id}>
        <Card
          onClick={() => onGenreClick?.(genre)}
          sx={{
            bgcolor: 'background.elevated',
            border: '1px solid',
            borderColor: 'divider',
            cursor: onGenreClick ? 'pointer' : 'default',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              borderColor: 'primary.dark',
            },
          }}
        >
          <CardContent sx={{ py: 3, '&:last-child': { pb: 3 } }}>
            <MusicNoteIcon sx={{ color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{genre.name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{genre.trackCount} canciones</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default GenreList;
