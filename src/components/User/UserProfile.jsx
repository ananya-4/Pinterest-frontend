import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Avatar, 
  Typography, 
  Button, 
  Grid,
  Tab,
  Tabs
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PinGrid from '../PinGrid/PinGrid';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [pins, setPins] = useState([]);
  const [savedPins, setSavedPins] = useState([]);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();
        setUser(data);
        setIsFollowing(data.followers.includes(currentUser._id));
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    // Fetch user's pins
    const fetchPins = async () => {
      try {
        const response = await fetch(`/api/pins?user=${id}`);
        const data = await response.json();
        setPins(data);
      } catch (error) {
        console.error('Error fetching pins:', error);
      }
    };

    // Fetch user's saved pins
    const fetchSavedPins = async () => {
      try {
        const response = await fetch(`/api/pins?saved=${id}`);
        const data = await response.json();
        setSavedPins(data);
      } catch (error) {
        console.error('Error fetching saved pins:', error);
      }
    };

    fetchUser();
    fetchPins();
    fetchSavedPins();
  }, [id, currentUser._id]);

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${id}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setIsFollowing(data.followers.includes(currentUser._id));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (!user) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ pt: 8, px: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          src={user.avatar}
          sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
        />
        <Typography variant="h5" gutterBottom>
          {user.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          @{user.username}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {user.bio}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography component="span" sx={{ mr: 2 }}>
            {user.followers.length} followers
          </Typography>
          <Typography component="span">
            {user.following.length} following
          </Typography>
        </Box>
        {currentUser._id !== id && (
          <Button
            variant={isFollowing ? "outlined" : "contained"}
            onClick={handleFollow}
            sx={{ mt: 2 }}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}
      </Box>

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        centered
        sx={{ mb: 4 }}
      >
        <Tab label="Created" />
        <Tab label="Saved" />
      </Tabs>

      {tabValue === 0 ? (
        <PinGrid pins={pins} />
      ) : (
        <PinGrid pins={savedPins} />
      )}
    </Box>
  );
};

export default UserProfile;