import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Avatar
} from '@mui/material';
import { bookingService } from '../services/bookingService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialog, setCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const statusColors = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'error',
    completed: 'info'
  };

  const statusLabels = {
    pending: '대기중',
    confirmed: '확정',
    cancelled: '취소됨',
    completed: '완료'
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      setError('예약 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOpen = (booking) => {
    setSelectedBooking(booking);
    setCancelDialog(true);
  };

  const handleCancelClose = () => {
    setCancelDialog(false);
    setSelectedBooking(null);
  };

  const handleCancelConfirm = async () => {
    setCancelLoading(true);
    
    try {
      await bookingService.cancelBooking(selectedBooking.id);
      await fetchBookings();
      handleCancelClose();
    } catch (err) {
      alert('예약 취소에 실패했습니다.');
      console.error('Cancel error:', err);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        내 예약
      </Typography>
      
      {bookings.length === 0 ? (
        <Alert severity="info">예약 내역이 없습니다.</Alert>
      ) : (
        <Box>
          {bookings.map((booking) => (
            <Card key={booking.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Typography variant="h6">
                    {booking.shop.name}
                  </Typography>
                  <Chip 
                    label={statusLabels[booking.status]} 
                    color={statusColors[booking.status]}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {booking.service.name}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    날짜: {formatDate(booking.booking_date)}
                  </Typography>
                  <Typography variant="body2">
                    시간: {booking.booking_time}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    결제 금액: {formatPrice(booking.total_price)}
                  </Typography>
                </Box>
                
                {booking.stylist && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      담당 디자이너
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Avatar 
                        src={booking.stylist.image_url} 
                        sx={{ width: 32, height: 32, mr: 1 }}
                      >
                        {booking.stylist.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {booking.stylist.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.stylist.specialty} · {booking.stylist.experience_years}년 경력
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {booking.shop.address}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    {booking.shop.phone}
                  </Typography>
                </Box>
                
                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => handleCancelOpen(booking)}
                    >
                      예약 취소
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={cancelDialog} onClose={handleCancelClose}>
        <DialogTitle>예약 취소</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 이 예약을 취소하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>아니오</Button>
          <Button 
            onClick={handleCancelConfirm} 
            color="error"
            disabled={cancelLoading}
          >
            {cancelLoading ? <CircularProgress size={24} /> : '예약 취소'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings;