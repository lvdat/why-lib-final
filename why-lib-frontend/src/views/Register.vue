<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Đăng ký tài khoản mới
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Đã có tài khoản?
                <router-link
                    to="/login"
                    class="font-medium text-primary-600 hover:text-primary-500"
                >
                    Đăng nhập ngay
                </router-link>
            </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <RegisterForm />
            </div>
        </div>
    </div>
</template>

<script setup>
import RegisterForm from '@/components/RegisterForm.vue'
</script>
