import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Avatar, Box, Card, CardContent, Chip, IconButton, Typography } from '@mui/material';
import React from 'react';

export interface YouTubeVideo {
  id: string;
  title: string;
  channelName: string;
  channelAvatar?: string;
  thumbnail?: string;
  duration?: string;
  viewCount?: string;
  publishedAt?: string;
}

interface YouTubeVideoCardProps extends YouTubeVideo {
  onClick?: () => void;
  onPlay?: () => void;
}

const YouTubeVideoCard: React.FC<YouTubeVideoCardProps> = ({
  id,
  title,
  channelName,
  channelAvatar,
  thumbnail,
  duration,
  viewCount,
  publishedAt,
  onClick,
  onPlay,
}) => {
  return (
    <Card
      sx={{
        bgcolor: 'transparent',
        boxShadow: 'none',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'background.elevated',
          '& .video-play-button': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Avatar
          variant="rounded"
          src={thumbnail}
          sx={{
            width: '100%',
            aspectRatio: '16/9',
            bgcolor: 'background.elevated',
            fontSize: '2rem',
          }}
        >
          <YouTubeIcon sx={{ fontSize: 40, color: 'error.main' }} />
        </Avatar>

        {/* Duration Badge */}
        {duration && (
          <Chip
            label={duration}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              fontSize: '0.75rem',
            }}
          />
        )}

        {/* Play Button Overlay */}
        <IconButton
          className="video-play-button"
          onClick={onPlay}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.8)',
            bgcolor: 'primary.main',
            color: 'black',
            width: 56,
            height: 56,
            opacity: 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'primary.light',
              transform: 'translate(-50%, -50%) scale(1)',
            },
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>

      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={channelAvatar}
            sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
          >
            {channelName[0]}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {channelName}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          {viewCount && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {viewCount} vistas
            </Typography>
          )}
          {publishedAt && (
            <>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                •
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {publishedAt}
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default YouTubeVideoCard;
