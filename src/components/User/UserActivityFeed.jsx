import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const UserActivityFeed = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/activities`);
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {activities.map((activity) => (
        <ListItem key={activity._id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={activity.user.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography component="span" variant="body1">
                <strong>{activity.user.name}</strong> {activity.action}
              </Typography>
            }
            secondary={
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default UserActivityFeed;