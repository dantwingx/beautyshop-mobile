import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  Fade,
  Skeleton,
  Avatar,
  Rating,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { shopService } from '../services/shopService';

const ShopList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [shops, setShops] = useState([]);
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState([]);

  const categoryNames = {
    hair_salon: '헤어샵',
    beauty_shop: '뷰티샵',
    gym: '헬스장',
    pilates: '필라테스'
  };

  const categoryColors = {
    hair_salon: '#667eea',
    beauty_shop: '#f093fb', 
    gym: '#4facfe',
    pilates: '#43e97b'
  };

  const seoulDistricts = [
    '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
    '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
    '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
  ];

  useEffect(() => {
    fetchShops();
  }, [searchParams]);

  // 지역 필터 적용을 위한 별도 useEffect
  useEffect(() => {
    if (allShops.length > 0) {
      applyDistrictFilter();
    }
  }, [selectedDistricts, allShops]);

  const fetchShops = async () => {
    setLoading(true);
    setError('');
    setSelectedDistricts([]); // 새로운 검색 시 필터 초기화
    
    try {
      const params = {};
      
      if (searchParams.get('category')) {
        params.category = searchParams.get('category');
      }
      
      if (searchParams.get('search')) {
        params.search = searchParams.get('search');
      }
      
      if (searchParams.get('latitude') && searchParams.get('longitude')) {
        params.latitude = searchParams.get('latitude');
        params.longitude = searchParams.get('longitude');
        params.distance = searchParams.get('distance') || 5;
      }
      
      const data = await shopService.getShops(params);
      setAllShops(data);
      setShops(data);
    } catch (err) {
      setError('매장 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (searchParams.get('category')) {
      return `${categoryNames[searchParams.get('category')]} 목록`;
    }
    if (searchParams.get('search')) {
      return `"${searchParams.get('search')}" 검색 결과`;
    }
    if (searchParams.get('latitude')) {
      return '내 주변 매장';
    }
    return '전체 매장';
  };

  const getShopImage = (shop) => {
    if (shop.image_urls && shop.image_urls.length > 0) {
      return shop.image_urls[0];
    }
    // 폴백 이미지
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#764ba2', '#f5576c'];
    const color = colors[shop.name.length % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=${color.slice(1)}&color=fff&size=200`;
  };

  const generateRandomRating = (shopId) => {
    // 일관된 랜덤 값을 위해 shop ID 기반으로 생성
    const seed = shopId;
    const rating = 3.5 + (seed % 1000) / 1000 * 1.5; // 3.5-5.0 범위
    return Number(rating.toFixed(1));
  };

  const generateRandomReviewCount = (shopId) => {
    return Math.floor(shopId * 7.3) % 500 + 10; // 10-509 범위
  };

  const handleDistrictChange = (district) => {
    setSelectedDistricts(prev => {
      if (prev.includes(district)) {
        return prev.filter(d => d !== district);
      } else {
        return [...prev, district];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedDistricts([]);
  };

  const applyDistrictFilter = () => {
    if (selectedDistricts.length === 0) {
      setShops(allShops);
    } else {
      const filteredShops = allShops.filter(shop => 
        selectedDistricts.some(district => shop.address && shop.address.includes(district))
      );
      setShops(filteredShops);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="60%" height={40} />
        </Box>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid size={12} key={index}>
              <Card>
                <Box sx={{ display: 'flex', p: 2 }}>
                  <Skeleton variant="circular" width={80} height={80} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={28} />
                    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="90%" height={20} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 3 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'error.dark' : 'error.light'
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container sx={{ py: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              mb: 1
            }}
          >
            {getTitle()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            총 {shops.length}개의 매장{selectedDistricts.length > 0 && ` (${selectedDistricts.join(', ')} 필터 적용됨)`}
          </Typography>
        </Box>

        {/* 지역 필터 (내 주변 매장일 때만 표시) */}
        {searchParams.get('latitude') && (
          <Box sx={{ mb: 3 }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    지역 필터
                  </Typography>
                  {selectedDistricts.length > 0 && (
                    <Chip 
                      label={`${selectedDistricts.length}개 선택`}
                      size="small"
                      color="primary"
                      sx={{ ml: 2 }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={clearAllFilters}
                    disabled={selectedDistricts.length === 0}
                  >
                    전체 해제
                  </Button>
                </Box>
                <FormGroup>
                  <Grid container spacing={1}>
                    {seoulDistricts.map((district) => (
                      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={district}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedDistricts.includes(district)}
                              onChange={() => handleDistrictChange(district)}
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2">
                              {district}
                            </Typography>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
        
        {shops.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              검색 결과가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              다른 검색어나 카테고리를 시도해보세요
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ borderRadius: 3 }}
            >
              홈으로 돌아가기
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {shops.map((shop, index) => (
              <Grid size={12} key={shop.id}>
                <Fade in timeout={300 + index * 100}>
                  <Card 
                    sx={{ 
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <CardActionArea onClick={() => navigate(`/shops/${shop.id}`)}>
                      <Box sx={{ display: 'flex', p: 3 }}>
                        <Avatar
                          src={getShopImage(shop)}
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            mr: 2,
                            bgcolor: categoryColors[shop.category] || 'primary.main'
                          }}
                        >
                          {shop.name.charAt(0)}
                        </Avatar>
                        
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                            <Typography 
                              variant="h6" 
                              component="h2"
                              sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                mr: 1
                              }}
                            >
                              {shop.name}
                            </Typography>
                            <Chip 
                              label={categoryNames[shop.category]} 
                              size="small" 
                              sx={{
                                bgcolor: categoryColors[shop.category] || 'primary.main',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          
                          <Box display="flex" alignItems="center" mb={1}>
                            <Rating 
                              value={generateRandomRating(shop.id)} 
                              precision={0.1} 
                              size="small" 
                              readOnly
                              icon={<StarIcon fontSize="inherit" />}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {generateRandomRating(shop.id)} ({generateRandomReviewCount(shop.id)}개 리뷰)
                            </Typography>
                          </Box>
                          
                          {shop.description && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                mb: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {shop.description}
                            </Typography>
                          )}
                          
                          <Box display="flex" alignItems="center" mb={1}>
                            <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {shop.address}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                              <PhoneIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary">
                                {shop.phone}
                              </Typography>
                            </Box>
                            
                            <Box display="flex" alignItems="center">
                              <AccessTimeIcon fontSize="small" color="success.main" sx={{ mr: 0.5 }} />
                              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                영업중
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ShopList;