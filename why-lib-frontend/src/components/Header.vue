<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <router-link to="/" class="flex items-center">
        <span class="text-2xl font-bold text-primary-600">WHY Library</span>
      </router-link>

      <nav class="hidden md:flex space-x-6">
        <router-link
          to="/"
          class="text-gray-600 hover:text-primary-600 transition-colors"
          active-class="text-primary-600 font-medium"
        >
          Trang chủ
        </router-link>
        <router-link
          to="/books"
          class="text-gray-600 hover:text-primary-600 transition-colors"
          active-class="text-primary-600 font-medium"
        >
          Danh sách sách
        </router-link>
        <router-link
          v-if="authStore.isAuthenticated && authStore.user.role === 'docgia'"
          to="/my-borrowings"
          class="text-gray-600 hover:text-primary-600 transition-colors"
          active-class="text-primary-600 font-medium"
        >
          Sách đang mượn
        </router-link>
        <router-link
          v-if="authStore.isAuthenticated && (authStore.user.role === 'nhanvien' || authStore.user.role === 'quantri')"
          to="/borrow-requests"
          class="text-gray-600 hover:text-primary-600 transition-colors"
          active-class="text-primary-600 font-medium"
        >
          Yêu cầu mượn sách
        </router-link>
        <router-link
          v-if="authStore.isAuthenticated && authStore.user.role === 'quantri'"
          to="/admin/books"
          class="text-gray-600 hover:text-primary-600 transition-colors"
          active-class="text-primary-600 font-medium"
        >
          Quản lý sách
        </router-link>
      </nav>

      <div class="flex items-center space-x-4">
        <template v-if="!authStore.isAuthenticated">
          <router-link
            to="/login"
            class="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded transition-colors"
          >
            Đăng nhập
          </router-link>
          <router-link
            to="/register"
            class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Đăng ký
          </router-link>
        </template>
        <template v-else>
          <div class="relative group">
            <button class="flex items-center space-x-2 focus:outline-none">
              <span class="font-medium">{{ authStore.user.name }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Thông tin cá nhân
              </router-link>
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const logout = async () => {
  try {
    await authStore.logout();
    toast.success('Đăng xuất thành công');
    router.push('/login');
  } catch (error) {
    toast.error('Đăng xuất thất bại');
  }
};
</script>
