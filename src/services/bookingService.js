import axiosInstance from '../config/axios';

export const bookingService = {
  async getBookings(params = {}) {
    const response = await axiosInstance.get('/bookings', { params });
    return response.data;
  },

  async getBooking(id) {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },

  async createBooking(bookingData) {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  },

  async updateBooking(id, bookingData) {
    const response = await axiosInstance.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  async cancelBooking(id) {
    const response = await axiosInstance.put(`/bookings/${id}`, { status: 'cancelled' });
    return response.data;
  }
};