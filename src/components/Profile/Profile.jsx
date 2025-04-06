import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, Grid, Container, Tabs, Tab } from '@mui/material';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../../context/AuthContext';  // Changed from named to default import
import PinGrid from '../PinGrid/PinGrid';
import api from '../../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [userPins, setUserPins] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const { username } = useParams();
  const { user } = useAuth();  // Keep only one declaration of user
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      console.log('Auth user:', user);
      console.log('URL username:', username);

      if (!user) {
        navigate('/login');
        return;
      }

      if (!username) {
        console.error('No username in URL');
        navigate('/');
        return;
      }

      await fetchProfile();
      await fetchUserPins();  // Added this call
    };

    loadProfile();
  }, [username, user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/users/profile/${username}`);
      console.log('Profile data:', data);
      setProfile(data);
      if (user) {
        setIsFollowing(data.followers?.includes(user._id));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        console.error('User not found');
      }
    }
  };

  const fetchUserPins = async () => {
    try {
      const { data } = await api.get(`/users/profile/${username}/pins`);
      setUserPins(data);
    } catch (error) {
      console.error('Error fetching pins:', error);
      setUserPins([]);
    }
  };

  const handleFollow = async () => {
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const { data } = await api.post(`/users/${profile._id}/${endpoint}`); // Changed to use profile._id
      if (data) {
        setIsFollowing(!isFollowing);
        fetchProfile();
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  // Add isOwnProfile check
  const isOwnProfile = user?.name === username;

  if (!profile) return <Box sx={{ p: 3 }}>Loading...</Box>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 10, pb: 6 }}>
        {/* Profile Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            src={profile.profilePicture}
            alt={profile.name}
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 2,
              border: '2px solid #e9e9e9'
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            {profile.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {profile.email}
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {profile.bio || 'No bio yet'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Typography>
              <strong>{profile.followers?.length || 0}</strong> followers
            </Typography>
            <Typography>
              <strong>{profile.following?.length || 0}</strong> following
            </Typography>
          </Box>
          {!isOwnProfile && user && (
            <Button
              variant="contained"
              onClick={handleFollow}
              sx={{
                bgcolor: isFollowing ? '#e9e9e9' : '#e60023',
                color: isFollowing ? 'black' : 'white',
                borderRadius: '24px',
                px: 4,
                '&:hover': {
                  bgcolor: isFollowing ? '#e1e1e1' : '#ad081b'
                }
              }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
          sx={{
            mb: 4,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600
            }
          }}
        >
          <Tab label="Created" />
          <Tab label="Saved" />
        </Tabs>

        {/* Pins Grid */}
        {activeTab === 0 ? (
          userPins.length > 0 ? (
            <PinGrid pins={userPins} />
          ) : (
            <Typography textAlign="center" color="text.secondary">
              No pins created yet
            </Typography>
          )
        ) : (
          <Typography textAlign="center" color="text.secondary">
            No pins saved yet
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Profile;