import { defineStore } from 'pinia';
import authService from '@/services/authService';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await authService.login(credentials.email, credentials.password);
        this.user = response.user;
        this.token = response.token;
        this.isAuthenticated = true;

        // Save token to localStorage
        localStorage.setItem('token', response.token);

        return response;
      } catch (error) {
        throw error.response?.data?.message || 'Đăng nhập thất bại';
      }
    },
    async register(userData) {
      try {
        const response = await authService.register(userData);
        this.user = response.user;
        this.token = response.token;
        this.isAuthenticated = true;

        // Save token to localStorage
        localStorage.setItem('token', response.token);

        return response;
      } catch (error) {
        throw error.response?.data?.message || 'Đăng ký thất bại';
      }
    },
    async getMe() {
      try {
        if (!this.token) return;

        const response = await authService.getMe(this.token);
        this.user = response.user;
        return response;
      } catch (error) {
        this.logout();
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
});
