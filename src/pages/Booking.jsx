import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  Grid,
  Rating,
  useTheme,
  Fade,
  Paper,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Divider,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { stylistService } from '../services/stylistService';
import { bookingService } from '../services/bookingService';

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const { shop, service, stylist: initialStylist, step: initialStep } = location.state || {};
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStylist, setSelectedStylist] = useState(initialStylist || null);
  const [selectedService, setSelectedService] = useState(service || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [stylists, setStylists] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateViewType, setDateViewType] = useState('calendar'); // 'calendar' or 'list'
  
  // Set locale for dayjs
  dayjs.locale('ko');

  const steps = ['디자이너 선택', '날짜 선택', '시간 선택', '예약 확인'];

  useEffect(() => {
    if (initialStep === 'service') {
      setCurrentStep(0);
      fetchStylists();
    } else if (initialStep === 'stylist') {
      setCurrentStep(1);
    }
  }, []);

  const fetchStylists = async () => {
    setLoading(true);
    try {
      const data = await stylistService.getStylists(shop.id);
      setStylists(data);
    } catch (err) {
      setError('디자이너 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 영업 시간 설정 (9:00 - 20:00)
  const BUSINESS_HOURS = {
    start: 9,
    end: 20
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const shouldDisableDate = (date) => {
    // 오늘 이전 날짜 비활성화
    if (date.isBefore(dayjs(), 'day')) return true;
    // 한 달 이후 날짜 비활성화
    if (date.isAfter(dayjs().add(1, 'month'), 'day')) return true;
    return false;
  };

  const generateDateList = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = dayjs().add(i, 'day');
      dates.push({
        date: date,
        isToday: i === 0,
        isTomorrow: i === 1,
        isWeekend: date.day() === 0 || date.day() === 6
      });
    }
    return dates;
  };

  const fetchAvailableTimes = async (date) => {
    if (!selectedStylist || !date) return;
    
    setLoading(true);
    try {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const data = await stylistService.getAvailableTimes(shop.id, selectedStylist.id, formattedDate);
      
      // 모든 시간대를 생성하고 예약 가능 여부를 표시
      const allSlots = generateTimeSlots();
      const slotsWithAvailability = allSlots.map(time => {
        const existingSlot = data.find(slot => slot.start_time === time);
        return {
          time,
          is_available: existingSlot ? existingSlot.is_available : true,
          id: existingSlot?.id || `temp-${time}`
        };
      });
      
      setAvailableTimes(slotsWithAvailability);
    } catch (err) {
      // 에러 시에도 모든 시간대를 표시 (모두 예약 가능으로)
      const allSlots = generateTimeSlots().map(time => ({
        time,
        is_available: true,
        id: `temp-${time}`
      }));
      setAvailableTimes(allSlots);
    } finally {
      setLoading(false);
    }
  };

  const handleStylistSelect = (stylist) => {
    setSelectedStylist(stylist);
    setCurrentStep(1);
  };

  const handleDateSelect = (newDate) => {
    setSelectedDate(newDate);
    setSelectedTime('');
    setCurrentStep(2);
    fetchAvailableTimes(newDate);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const handleBookingConfirm = async () => {
    if (!shop || !selectedService || !selectedStylist || !selectedDate || !selectedTime) {
      setError('모든 항목을 선택해주세요.');
      return;
    }
    
    setLoading(true);
    try {
      const bookingData = {
        shop_id: shop.id,
        service_id: selectedService.id,
        stylist_id: selectedStylist.id,
        booking_date: dayjs(selectedDate).format('YYYY-MM-DD'),
        booking_time: selectedTime
      };
      
      await bookingService.createBooking(bookingData);
      navigate('/bookings');
    } catch (err) {
      setError('예약에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  useEffect(() => {
    if (!shop) {
      navigate('/');
    }
  }, [shop, navigate]);

  if (!shop) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* 헤더 */}
      <Paper 
        elevation={1} 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          borderRadius: 0
        }}
      >
        <Container sx={{ py: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              예약하기
            </Typography>
          </Box>
          
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>
      </Paper>

      <Container sx={{ py: 3 }}>
        {/* 매장/서비스 정보 */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {shop.name}
          </Typography>
          {selectedService && (
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {selectedService.name}
              </Typography>
              <Box display="flex" gap={2} mt={1}>
                <Typography variant="h6" color="primary">
                  {formatPrice(selectedService.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedService.duration}분
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 디자이너 선택 */}
        {currentStep === 0 && (
          <Fade in timeout={300}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                디자이너를 선택해주세요
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {stylists.map((stylist) => (
                    <Grid size={12} key={stylist.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { boxShadow: theme.shadows[4] },
                          border: selectedStylist?.id === stylist.id ? `2px solid ${theme.palette.primary.main}` : 'none'
                        }}
                        onClick={() => handleStylistSelect(stylist)}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              src={stylist.image_url}
                              sx={{ width: 60, height: 60, mr: 2 }}
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
                              
                              <Rating 
                                value={stylist.rating || 4.5} 
                                precision={0.1} 
                                size="small" 
                                readOnly
                              />
                            </Box>
                            
                            {selectedStylist?.id === stylist.id && (
                              <CheckCircleIcon color="primary" />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>
        )}

        {/* 날짜 선택 */}
        {currentStep === 1 && (
          <Fade in timeout={300}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  날짜를 선택해주세요
                </Typography>
                <ToggleButtonGroup
                  value={dateViewType}
                  exclusive
                  onChange={(e, newView) => newView && setDateViewType(newView)}
                  size="small"
                >
                  <ToggleButton value="calendar">
                    <CalendarTodayIcon sx={{ fontSize: 20 }} />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <AccessTimeIcon sx={{ fontSize: 20 }} />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              {dateViewType === 'calendar' ? (
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                  <Paper sx={{ p: 3, borderRadius: 3, boxShadow: theme.shadows[2] }}>
                    <DateCalendar
                      value={selectedDate}
                      onChange={handleDateSelect}
                      shouldDisableDate={shouldDisableDate}
                      views={['day']}
                      sx={{
                        width: '100%',
                        '& .MuiPickersCalendarHeader-root': {
                          marginBottom: 3,
                          paddingX: 2
                        },
                        '& .MuiPickersCalendarHeader-label': {
                          fontSize: '1.2rem',
                          fontWeight: 600
                        },
                        '& .MuiDayCalendar-header': {
                          marginBottom: 1
                        },
                        '& .MuiDayCalendar-weekDayLabel': {
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: 'text.secondary'
                        },
                        '& .MuiDayCalendar-weekContainer': {
                          margin: '4px 0'
                        },
                        '& .MuiPickersDay-root': {
                          fontSize: '1rem',
                          fontWeight: 500,
                          width: 44,
                          height: 44,
                          margin: '2px',
                          borderRadius: 3,
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                            transform: 'scale(1.05)',
                            boxShadow: theme.shadows[4]
                          },
                          '&:not(.Mui-disabled)': {
                            border: `1px solid ${theme.palette.divider}`
                          }
                        },
                        '& .Mui-selected': {
                          backgroundColor: `${theme.palette.primary.main} !important`,
                          color: 'white !important',
                          fontWeight: 700,
                          transform: 'scale(1.1)',
                          boxShadow: theme.shadows[6],
                          '&:hover': {
                            backgroundColor: `${theme.palette.primary.dark} !important`,
                            transform: 'scale(1.1)'
                          }
                        },
                        '& .MuiPickersDay-today': {
                          backgroundColor: theme.palette.action.selected,
                          fontWeight: 600,
                          border: `2px solid ${theme.palette.primary.main}`,
                          '&:not(.Mui-selected)': {
                            color: theme.palette.primary.main
                          }
                        },
                        '& .Mui-disabled': {
                          opacity: 0.4,
                          backgroundColor: 'transparent'
                        }
                      }}
                    />
                  </Paper>
                </LocalizationProvider>
              ) : (
                <Grid container spacing={2}>
                  {generateDateList().map((dateItem) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={dateItem.date.format('YYYY-MM-DD')}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          textAlign: 'center',
                          minHeight: 90,
                          bgcolor: dateItem.isWeekend ? 'action.hover' : 'background.paper',
                          borderRadius: 3,
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': { 
                            boxShadow: theme.shadows[6],
                            transform: 'translateY(-4px) scale(1.02)'
                          },
                          border: selectedDate?.isSame(dateItem.date, 'day') 
                            ? `3px solid ${theme.palette.primary.main}` 
                            : `1px solid ${theme.palette.divider}`,
                          boxShadow: selectedDate?.isSame(dateItem.date, 'day') 
                            ? theme.shadows[8]
                            : theme.shadows[1]
                        }}
                        onClick={() => handleDateSelect(dateItem.date)}
                      >
                        <CardContent 
                          sx={{ 
                            py: 2.5, 
                            px: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '100%'
                          }}
                        >
                          <Typography
                            variant="caption"
                            color={dateItem.isWeekend ? 'error.main' : 'text.secondary'}
                            display="block"
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          >
                            {dateItem.date.format('MM월')}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: selectedDate?.isSame(dateItem.date, 'day') ? 800 : 600,
                              color: selectedDate?.isSame(dateItem.date, 'day') 
                                ? 'primary.main' 
                                : dateItem.isWeekend 
                                  ? 'error.main' 
                                  : 'text.primary',
                              my: 0.5,
                              lineHeight: 1
                            }}
                          >
                            {dateItem.date.format('DD')}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: selectedDate?.isSame(dateItem.date, 'day') ? 'primary.main' : 'text.secondary',
                              fontWeight: selectedDate?.isSame(dateItem.date, 'day') ? 600 : 500,
                              fontSize: '0.75rem'
                            }}
                          >
                            {dateItem.isToday ? '오늘' : dateItem.isTomorrow ? '내일' : dateItem.date.format('ddd')}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>
        )}

        {/* 시간 선택 */}
        {currentStep === 2 && (
          <Fade in timeout={300}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                시간을 선택해주세요
              </Typography>
              {selectedDate && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {dayjs(selectedDate).format('YYYY년 MM월 DD일 (ddd)')}
                </Typography>
              )}
              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    영업시간: {BUSINESS_HOURS.start}:00 - {BUSINESS_HOURS.end}:00
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {availableTimes.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedTime === slot.time ? "contained" : "outlined"}
                        disabled={!slot.is_available}
                        onClick={() => handleTimeSelect(slot.time)}
                        sx={{
                          minWidth: '80px',
                          borderRadius: 2,
                          opacity: slot.is_available ? 1 : 0.5,
                          '&:disabled': {
                            borderColor: 'divider',
                            color: 'text.disabled'
                          }
                        }}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </Box>
                  {availableTimes.some(slot => !slot.is_available) && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      * 회색으로 표시된 시간은 이미 예약되었습니다
                    </Typography>
                  )}
                </Paper>
              )}
            </Box>
          </Fade>
        )}

        {/* 예약 확인 */}
        {currentStep === 3 && (
          <Fade in timeout={300}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                예약 정보를 확인해주세요
              </Typography>
              
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  예약 정보
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">매장</Typography>
                  <Typography variant="body1">{shop.name}</Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">서비스</Typography>
                  <Typography variant="body1">{selectedService?.name || '선택되지 않음'}</Typography>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">디자이너</Typography>
                  <Box display="flex" alignItems="center">
                    <Avatar src={selectedStylist?.image_url} sx={{ width: 32, height: 32, mr: 1 }}>
                      {selectedStylist?.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body1">{selectedStylist?.name}</Typography>
                  </Box>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">예약 날짜</Typography>
                  <Typography variant="body1">
                    {dayjs(selectedDate).format('YYYY년 MM월 DD일 (dddd)')}
                  </Typography>
                </Box>
                
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary">예약 시간</Typography>
                  <Typography variant="body1">{selectedTime}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    총 결제 금액
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                    {selectedService?.price ? formatPrice(selectedService.price) : '가격 정보 없음'}
                  </Typography>
                </Box>
              </Paper>
              
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBookingConfirm}
                disabled={loading}
                sx={{ 
                  mt: 3, 
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : '예약하기'}
              </Button>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default Booking;