<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label for="hoLot" class="block text-sm font-medium text-gray-700">Họ lót</label>
                <input
                    id="hoLot"
                    v-model="form.HOLOT"
                    type="text"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            <div>
                <label for="ten" class="block text-sm font-medium text-gray-700">Tên</label>
                <input
                    id="ten"
                    v-model="form.TEN"
                    type="text"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            <div>
                <label for="ngaySinh" class="block text-sm font-medium text-gray-700"
                    >Ngày sinh</label
                >
                <input
                    id="ngaySinh"
                    v-model="form.NGAYSINH"
                    type="date"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            <div>
                <label for="phai" class="block text-sm font-medium text-gray-700">Giới tính</label>
                <select
                    id="phai"
                    v-model="form.PHAI"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
            </div>

            <div>
                <label for="diaChi" class="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                    id="diaChi"
                    v-model="form.DIACHI"
                    type="text"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            <div>
                <label for="dienThoai" class="block text-sm font-medium text-gray-700"
                    >Điện thoại</label
                >
                <input
                    id="dienThoai"
                    v-model="form.DIENTHOAI"
                    type="tel"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700"
                    >Mật khẩu</label
                >
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
                    >Xác nhận mật khẩu</label
                >
                <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    type="password"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
            </div>
        </div>

        <div>
            <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span v-if="!loading">Đăng ký</span>
                <span v-else>Đang đăng ký...</span>
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const form = ref({
    MADOCGIA: '',
    email: '',
    HOLOT: '',
    TEN: '',
    NGAYSINH: '',
    PHAI: 'Nam',
    DIACHI: '',
    DIENTHOAI: '',
    password: '',
    confirmPassword: ''
})

const loading = ref(false)

const handleSubmit = async () => {
    if (form.value.password !== form.value.confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp')
        return
    }

    try {
        loading.value = true
        await authStore.register(form.value)
        toast.success('Đăng ký thành công')
        router.push('/')
    } catch (error) {
        toast.error(error.message || 'Đăng ký thất bại')
    } finally {
        loading.value = false
    }
}
</script>
