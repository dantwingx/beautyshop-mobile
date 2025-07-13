import axiosInstance from '../config/axios';

export const shopService = {
  async getShops(params = {}) {
    const response = await axiosInstance.get('/shops', { params });
    return response.data;
  },

  async getShop(id) {
    const response = await axiosInstance.get(`/shops/${id}`);
    return response.data;
  },

  async getShopServices(shopId) {
    const response = await axiosInstance.get(`/shops/${shopId}/services`);
    return response.data;
  },

  async getNearbyShops(latitude, longitude, distance = 5) {
    return this.getShops({ latitude, longitude, distance });
  },

  async searchShops(searchTerm) {
    return this.getShops({ search: searchTerm });
  },

  async getShopsByCategory(category) {
    return this.getShops({ category });
  }
};