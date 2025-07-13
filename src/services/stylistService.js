import axiosInstance from '../config/axios';

export const stylistService = {
  async getStylists(shopId) {
    const response = await axiosInstance.get(`/shops/${shopId}/stylists`);
    return response.data;
  },

  async getStylist(shopId, stylistId) {
    const response = await axiosInstance.get(`/shops/${shopId}/stylists/${stylistId}`);
    return response.data;
  },

  async getAvailableTimes(shopId, stylistId, date) {
    const response = await axiosInstance.get(`/shops/${shopId}/stylists/${stylistId}/available_times`, {
      params: { date }
    });
    return response.data;
  }
};