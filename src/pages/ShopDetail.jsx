import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  Avatar,
  Grid,
  Rating,
  useTheme,
  Fade,
  IconButton,
  Paper,
  CardActionArea,
  Chip
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { shopService } from '../services/shopService';
import { stylistService } from '../services/stylistService';
import { authService } from '../services/authService';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [shop, setShop] = useState(null);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categoryNames = {
    hair_salon: '헤어샵',
    beauty_shop: '뷰티샵',
    gym: '헬스장',
    pilates: '필라테스'
  };

  // 매장 이미지들
  const shopImages = shop?.image_urls && shop.image_urls.length > 0 
    ? shop.image_urls 
    : [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
        'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800'
      ];

  useEffect(() => {
    fetchShopDetail();
    fetchStylists();
  }, [id]);

  // 자동 이미지 스와이프
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === shopImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 3초마다 변경

    return () => clearInterval(interval);
  }, [shopImages.length]);

  const fetchShopDetail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await shopService.getShop(id);
      setShop(data);
    } catch (err) {
      setError('매장 정보를 불러오는데 실패했습니다.');
      console.error('Error fetching shop:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStylists = async () => {
    try {
      const data = await stylistService.getStylists(id);
      setStylists(data);
    } catch (err) {
      console.error('Error fetching stylists:', err);
    }
  };

  const handleServiceBooking = (service) => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    navigate(`/booking`, { 
      state: { 
        shop, 
        service,
        step: 'service'
      } 
    });
  };

  const handleStylistBooking = (stylist) => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    navigate(`/booking`, { 
      state: { 
        shop, 
        stylist,
        step: 'stylist'
      } 
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const generateRandomRating = (itemId) => {
    const seed = itemId;
    const rating = 3.5 + (seed % 1000) / 1000 * 1.5;
    return Number(rating.toFixed(1));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !shop) {
    return (
      <Container sx={{ py: 2 }}>
        <Alert severity="error">{error || '매장을 찾을 수 없습니다.'}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* 헤더 이미지 슬라이드 영역 */}
      <Box
        sx={{
          height: 300,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 이미지 슬라이드 */}
        {shopImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentImageIndex === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}
        
        {/* 그라데이션 오버레이 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
          }}
        />
        
        {/* 이미지 인디케이터 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1
          }}
        >
          {shopImages.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: currentImageIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </Box>
        
        {/* 매장 정보 오버레이 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            color: 'white'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {shop.name}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Chip 
              label={categoryNames[shop.category]} 
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                mr: 1,
                backdropFilter: 'blur(10px)'
              }}
            />
            <Rating 
              value={generateRandomRating(shop.id)} 
              precision={0.1} 
              size="small" 
              readOnly
              sx={{ color: '#FFD700' }}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {generateRandomRating(shop.id)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 기본 정보 */}
      <Container sx={{ py: 0 }}>
        <Paper sx={{ mt: -4, mx: 2, p: 3, borderRadius: 3, position: 'relative', zIndex: 1 }}>
          {shop.description && (
            <Typography variant="body1" paragraph>
              {shop.description}
            </Typography>
          )}
          
          <Box display="flex" alignItems="center" mb={1}>
            <LocationOnIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {shop.address}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" mb={2}>
            <PhoneIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {shop.phone}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <AccessTimeIcon color="success.main" sx={{ mr: 1 }} />
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
              영업중 · 오늘 20:00에 영업 종료
            </Typography>
          </Box>
        </Paper>

        {/* 탭 네비게이션 */}
        <Box sx={{ mt: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.9rem'
              }
            }}
          >
            <Tab 
              label={`메뉴 (${shop.services?.length || 0})`} 
              icon={<ContentCutIcon />}
              iconPosition="start"
            />
            {(shop.category === 'hair_salon' || shop.category === 'beauty_shop') && (
              <Tab 
                label={`디자이너 (${stylists.length})`} 
                icon={<PersonIcon />}
                iconPosition="start"
              />
            )}
          </Tabs>
        </Box>

        {/* 메뉴 탭 */}
        {activeTab === 0 && (
          <Fade in timeout={300}>
            <Box sx={{ mt: 3, pb: 8 }}>
              <Grid container spacing={2}>
                {shop.services && shop.services.map((service) => (
                  <Grid size={12} key={service.id}>
                    <Card sx={{ '&:hover': { boxShadow: theme.shadows[4] } }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="start">
                          <Box flex={1}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {service.name}
                            </Typography>
                            {service.description && (
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {service.description}
                              </Typography>
                            )}
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                {formatPrice(service.price)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {service.duration}분
                              </Typography>
                            </Box>
                          </Box>
                          <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => handleServiceBooking(service)}
                            sx={{ 
                              ml: 2,
                              borderRadius: 3,
                              minWidth: 80
                            }}
                          >
                            예약
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {/* 디자이너 탭 */}
        {activeTab === 1 && (
          <Fade in timeout={300}>
            <Box sx={{ mt: 3, pb: 8 }}>
              <Grid container spacing={2}>
                {stylists.map((stylist) => (
                  <Grid size={12} key={stylist.id}>
                    <Card sx={{ '&:hover': { boxShadow: theme.shadows[4] } }}>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={stylist.image_url}
                            sx={{ 
                              width: 60, 
                              height: 60, 
                              mr: 2,
                              bgcolor: 'primary.main'
                            }}
                          >
                            {stylist.name.charAt(0)}
                          </Avatar>
                          
                          <Box flex={1}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {stylist.name}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" mb={1}>
                              <Chip 
                                label={stylist.specialty} 
                                size="small" 
                                color="primary"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {stylist.experience_years}년 경력
                              </Typography>
                            </Box>
                            
                            <Box display="flex" alignItems="center">
                              <Rating 
                                value={stylist.rating || 4.5} 
                                precision={0.1} 
                                size="small" 
                                readOnly
                              />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {stylist.rating || 4.5}
                              </Typography>
                            </Box>
                            
                            {stylist.bio && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {stylist.bio}
                              </Typography>
                            )}
                          </Box>
                          
                          <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => handleStylistBooking(stylist)}
                            sx={{ 
                              ml: 2,
                              borderRadius: 3,
                              minWidth: 80
                            }}
                          >
                            예약
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default ShopDetail;