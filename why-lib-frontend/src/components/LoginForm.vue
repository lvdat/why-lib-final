<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      />
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          v-model="form.remember"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="remember-me" class="ml-2 block text-sm text-gray-700">Ghi nhớ đăng nhập</label>
      </div>

      <div class="text-sm">
        <router-link to="/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
          Quên mật khẩu?
        </router-link>
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!loading">Đăng nhập</span>
        <span v-else>Đang đăng nhập...</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const form = ref({
  email: '',
  password: '',
  remember: false
});

const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    await authStore.login(form.value);
    toast.success('Đăng nhập thành công');

    // Redirect based on role
    const redirectPath = authStore.user.role === 'docgia' ? '/' :
                        authStore.user.role === 'nhanvien' ? '/borrow-requests' :
                        '/admin/books';
    router.push(redirectPath);
  } catch (error) {
    toast.error(error.message || 'Đăng nhập thất bại');
  } finally {
    loading.value = false;
  }
};
</script>
