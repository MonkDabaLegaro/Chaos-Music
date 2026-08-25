import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { Track } from '@shared/types';
import React from 'react';
import TrackItem from './TrackItem';

interface TrackListProps {
  tracks?: Track[];
  headers?: string[];
  showHeaders?: boolean;
  showAlbum?: boolean;
  showArtist?: boolean;
  showDateAdded?: boolean;
  showDuration?: boolean;
  onTrackClick?: (track: Track) => void;
  onTrackPlay?: (track: Track) => void;
  onAddToQueue?: (track: Track) => void;
  onMoreClick?: (track: Track) => void;
}

const defaultHeaders = ['#', 'Título', 'Álbum', 'Fecha', 'Duración'];

const TrackList: React.FC<TrackListProps> = ({
  tracks = [],
  headers = defaultHeaders,
  showHeaders = true,
  showAlbum = true,
  showArtist = true,
  showDateAdded = true,
  showDuration = true,
  onTrackClick,
  onTrackPlay,
  onAddToQueue,
  onMoreClick,
}) => (
  <TableContainer>
    <Table>
      {showHeaders && (
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"><Checkbox size="small" /></TableCell>
            {headers.map((header) => (
              <TableCell
                key={header}
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: 'none',
                  py: 1,
                }}
              >
                {header === 'Duración' ? <AccessTimeIcon fontSize="small" /> : header}
              </TableCell>
            ))}
            <TableCell padding="checkbox" />
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {tracks.map((track, index) => (
          <TrackItem
            key={track.id}
            id={track.id}
            index={index + 1}
            title={track.title}
            artist={showArtist ? track.artist : ''}
            album={track.album}
            albumArt={track.coverPath}
            duration={track.duration}
            dateAdded={track.dateAdded}
            isFavorite={track.isFavorite}
            showAlbum={showAlbum}
            showDateAdded={showDateAdded}
            showDuration={showDuration}
            onClick={() => onTrackClick?.(track)}
            onPlay={() => onTrackPlay?.(track)}
            onAddToQueue={() => onAddToQueue?.(track)}
            onMore={() => onMoreClick?.(track)}
          />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default TrackList;
