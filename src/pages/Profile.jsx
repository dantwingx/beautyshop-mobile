import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { authService } from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const roleLabels = {
    customer: '일반 회원',
    shop_owner: '매장 운영자',
    admin: '관리자'
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        내 프로필
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <PersonIcon sx={{ fontSize: 60, mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {roleLabels[user.role]}
              </Typography>
            </Box>
          </Box>
          
          <List>
            <ListItem>
              <EmailIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText 
                primary="이메일" 
                secondary={user.email}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <PhoneIcon sx={{ mr: 2, color: 'action.active' }} />
              <ListItemText 
                primary="전화번호" 
                secondary={user.phone}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Button 
        variant="outlined" 
        color="error" 
        fullWidth
        onClick={handleLogout}
      >
        로그아웃
      </Button>
    </Container>
  );
};

export default Profile;