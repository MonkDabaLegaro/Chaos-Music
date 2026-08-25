import { Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';

export interface GenreItem {
  id: string;
  name: string;
  color?: string;
  image?: string;
}

interface GenreListProps {
  genres?: GenreItem[];
  onGenreClick?: (genreId: string) => void;
}

const defaultGenres: GenreItem[] = [
  { id: '1', name: 'Rock', color: '#E91E63' },
  { id: '2', name: 'Pop', color: '#9C27B0' },
  { id: '3', name: 'Jazz', color: '#673AB7' },
  { id: '4', name: 'Electronic', color: '#3F51B5' },
  { id: '5', name: 'Hip-Hop', color: '#2196F3' },
  { id: '6', name: 'Classical', color: '#00BCD4' },
  { id: '7', name: 'Country', color: '#009688' },
  { id: '8', name: 'R&B', color: '#4CAF50' },
  { id: '9', name: 'Metal', color: '#FF5722' },
  { id: '10', name: 'Folk', color: '#795548' },
  { id: '11', name: 'Indie', color: '#607D8B' },
  { id: '12', name: 'Blues', color: '#9E9E9E' },
];

const GenreList: React.FC<GenreListProps> = ({
  genres = defaultGenres,
  onGenreClick,
}) => {
  return (
    <Grid container spacing={2}>
      {genres.map((genre) => (
        <Grid item xs={6} sm={4} md={3} key={genre.id}>
          <Card
            onClick={() => onGenreClick?.(genre.id)}
            sx={{
              bgcolor: genre.color || 'primary.main',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <CardContent
              sx={{
                py: 3,
                '&:last-child': { pb: 3 },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {genre.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default GenreList;
