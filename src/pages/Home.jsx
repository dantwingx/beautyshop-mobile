import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Alert,
  Chip,
  Avatar,
  useTheme,
  Fade,
  Slide
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationPermission, setLocationPermission] = useState(false);
  const [greeting, setGreeting] = useState('');

  const categories = [
    { 
      id: 'hair_salon', 
      name: '헤어샵', 
      icon: <ContentCutIcon sx={{ fontSize: 48 }} />, 
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: '트렌디한 헤어스타일'
    },
    { 
      id: 'beauty_shop', 
      name: '뷰티샵', 
      icon: <FaceRetouchingNaturalIcon sx={{ fontSize: 48 }} />, 
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: '네일 & 피부관리'
    },
    { 
      id: 'gym', 
      name: '헬스장', 
      icon: <FitnessCenterIcon sx={{ fontSize: 48 }} />, 
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: '운동 & 피트니스'
    },
    { 
      id: 'pilates', 
      name: '필라테스', 
      icon: <SelfImprovementIcon sx={{ fontSize: 48 }} />, 
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: '몸매관리 & 재활'
    },
  ];

  const popularServices = ['염색', '펌', '네일아트', '속눈썹연장', '왁싱', '클리닉', '여성 커트', '남성 커트'];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('좋은 아침이에요! ☀️');
    else if (hour < 18) setGreeting('좋은 오후에요! 🌤️');
    else setGreeting('좋은 저녁이에요! 🌙');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );
    }
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/shops?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleNearbySearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          navigate(`/shops?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Fade in timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 1
              }}
            >
              {greeting}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                mb: 3
              }}
            >
              어떤 서비스를 이용하고 싶으세요?
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              placeholder="매장명, 서비스, 지역명으로 검색해보세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LocationOnIcon />}
              onClick={handleNearbySearch}
              disabled={!locationPermission}
              sx={{ 
                mb: 2,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                }
              }}
            >
              내 주변 매장 찾기
            </Button>
            
            {!locationPermission && (
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'info.dark' : 'info.light'
                }}
              >
                위치 정보를 허용하면 주변 매장을 쉽게 찾을 수 있어요
              </Alert>
            )}
          </Box>
        </Fade>

        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                인기 서비스
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {popularServices.map((service, index) => (
                <Chip
                  key={service}
                  label={service}
                  onClick={() => navigate(`/shops?search=${encodeURIComponent(service)}`)}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    opacity: 0,
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s forwards`,
                    transition: 'all 0.2s ease',
                    '@keyframes fadeInUp': {
                      'from': {
                        opacity: 0,
                        transform: 'translateY(10px)'
                      },
                      'to': {
                        opacity: 1,
                        transform: 'translateY(0px)'
                      }
                    },
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                  icon={<StarIcon sx={{ color: 'white !important' }} />}
                />
              ))}
            </Box>
          </Box>
        </Fade>

        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          카테고리별 찾기
        </Typography>
        
        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid size={6} key={category.id}>
              <Fade in timeout={400 + index * 100}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transform: 'translateY(20px)',
                    animation: `slideUpIn 0.6s ease-out ${index * 0.1}s forwards`,
                    '@keyframes slideUpIn': {
                      'from': {
                        opacity: 0,
                        transform: 'translateY(20px)'
                      },
                      'to': {
                        opacity: 1,
                        transform: 'translateY(0px)'
                      }
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/shops?category=${category.id}`)}
                    sx={{ 
                      height: '100%',
                      p: 3, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      background: category.gradient,
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: theme.shadows[12]
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.1)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.4s ease',
                      },
                      '&:hover::before': {
                        transform: 'translateX(100%)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        mb: 2, 
                        transform: 'scale(1)', 
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1) rotate(5deg)'
                        }
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        textAlign: 'center',
                        mb: 1
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textAlign: 'center',
                        opacity: 0.9,
                        fontSize: '0.8rem'
                      }}
                    >
                      {category.description}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* 프로모션 배너 */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{
              fontWeight: 700,
              mb: 3
            }}
          >
            이벤트 & 프로모션
          </Typography>
          
          <Fade in timeout={1500}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  신규 회원 혜택
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  첫 예약 20% 할인
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Beauty Booking에서 첫 예약 시 모든 서비스 20% 할인!
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ 
                    mt: 3, 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                  onClick={() => navigate('/shops')}
                >
                  지금 예약하기
                </Button>
              </CardContent>
            </Card>
          </Fade>
        </Box>

        {/* 최근 오픈 샵 */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{
              fontWeight: 700,
              mb: 3
            }}
          >
            최근 오픈한 매장
          </Typography>
          
          <Grid container spacing={2}>
            {[
              { 
                name: '헤어살롱 루나', 
                category: 'hair_salon',
                address: '강남구 신사동',
                openDate: '2024년 12월 오픈',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              },
              { 
                name: '네일아트 블루밍', 
                category: 'beauty_shop',
                address: '서초구 반포동',
                openDate: '2024년 12월 오픈',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              }
            ].map((shop, index) => (
              <Grid size={12} key={index}>
                <Fade in timeout={1600 + index * 200}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => navigate('/shops')}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                      <Avatar
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          mr: 2,
                          background: shop.gradient
                        }}
                      >
                        {shop.name.charAt(0)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {shop.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shop.address} • {shop.openDate}
                        </Typography>
                      </Box>
                      <Chip 
                        label="NEW" 
                        size="small" 
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;