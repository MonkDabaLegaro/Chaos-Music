import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import TrackItem, { TrackItemProps } from './TrackItem';

interface TrackListProps {
  tracks?: TrackItemProps[];
  headers?: string[];
  showHeaders?: boolean;
  showAlbum?: boolean;
  showDateAdded?: boolean;
  showDuration?: boolean;
  onTrackClick?: (trackId: string) => void;
  onTrackPlay?: (trackId: string) => void;
  onMoreClick?: (trackId: string) => void;
}

const defaultHeaders = ['#', 'Título', 'Álbum', 'Fecha', '⏱'];

const TrackList: React.FC<TrackListProps> = ({
  tracks = [],
  headers = defaultHeaders,
  showHeaders = true,
  showAlbum = true,
  showDateAdded = true,
  showDuration = true,
  onTrackClick,
  onTrackPlay,
  onMoreClick,
}) => {
  return (
    <TableContainer>
      <Table>
        {showHeaders && (
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox size="small" />
              </TableCell>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
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
                  {header === '⏱' ? (
                    <AccessTimeIcon fontSize="small" />
                  ) : (
                    header
                  )}
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
              {...track}
              index={index + 1}
              showAlbum={showAlbum}
              showDateAdded={showDateAdded}
              showDuration={showDuration}
              onClick={() => onTrackClick?.(track.id)}
              onPlay={() => onTrackPlay?.(track.id)}
              onMore={() => onMoreClick?.(track.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TrackList;
