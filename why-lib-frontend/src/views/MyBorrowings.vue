<template>
    <div class="min-h-screen bg-gray-50">
        <Header />

        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Sách đang mượn</h1>

            <div v-if="loading" class="flex justify-center py-8">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
                ></div>
            </div>

            <div v-else>
                <div v-if="borrowings.length === 0" class="text-center py-12">
                    <p class="text-gray-600 mb-4">Bạn chưa mượn sách nào</p>
                    <router-link
                        to="/books"
                        class="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Xem danh sách sách
                    </router-link>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="py-3 px-4 text-left">Sách</th>
                                <th class="py-3 px-4 text-left">Ngày mượn</th>
                                <th class="py-3 px-4 text-left">Ngày trả</th>
                                <th class="py-3 px-4 text-left">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="borrowing in borrowings" :key="borrowing._id">
                                <td class="py-3 px-4">
                                    <router-link
                                        :to="{
                                            name: 'book-detail',
                                            params: { id: borrowing.MASACH._id }
                                        }"
                                        class="text-primary-600 hover:text-primary-700"
                                    >
                                        {{ borrowing.MASACH.TENSACH }}
                                    </router-link>
                                </td>
                                <td class="py-3 px-4">
                                    {{ new Date(borrowing.NGAYMUON).toLocaleDateString() }}
                                </td>
                                <td class="py-3 px-4">
                                    {{
                                        borrowing.NGAYTRA
                                            ? new Date(borrowing.NGAYTRA).toLocaleDateString()
                                            : 'Chưa trả'
                                    }}
                                </td>
                                <td class="py-3 px-4">
                                    <span
                                        :class="{
                                            'bg-yellow-100 text-yellow-800':
                                                borrowing.TRANGTHAI === 'Chờ duyệt',
                                            'bg-green-100 text-green-800':
                                                borrowing.TRANGTHAI === 'Đã duyệt',
                                            'bg-red-100 text-red-800':
                                                borrowing.TRANGTHAI === 'Từ chối',
                                            'bg-blue-100 text-blue-800':
                                                borrowing.TRANGTHAI === 'Đã trả'
                                        }"
                                        class="px-2 py-1 rounded-full text-xs font-medium"
                                    >
                                        {{ borrowing.TRANGTHAI }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBorrowingStore } from '@/stores/borrowing'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const borrowingStore = useBorrowingStore()
const toast = useToast()
const authStore = useAuthStore()
const borrowings = ref([])
const loading = ref(false)

// Sử dụng computed để lấy userId
const userId = computed(() => authStore.user?._id);

const fetchBorrowings = async () => {
    if (!userId.value) {
      toast.error('Vui lòng đăng nhập để xem sách đang mượn');
      return;
    }

    try {
        loading.value = true
        await borrowingStore.getMyBorrowings(userId.value, authStore.token)
        borrowings.value = borrowingStore.myBorrowings
    } catch (error) {
        toast.error(error.message || 'Lỗi khi tải danh sách mượn sách');
        console.error(error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    if (authStore.isAuthenticated) {
        fetchBorrowings()
    }
})
</script>
