<template>
    <div class="min-h-screen bg-gray-50">
        <Header />

        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">Yêu cầu mượn sách</h1>

            <div v-if="loading" class="flex justify-center py-8">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
                ></div>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="py-3 px-4 text-left">Đọc giả</th>
                            <th class="py-3 px-4 text-left">Sách</th>
                            <th class="py-3 px-4 text-left">Ngày mượn</th>
                            <th class="py-3 px-4 text-left">Trạng thái</th>
                            <th class="py-3 px-4 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="request in borrowRequests" :key="request._id">
                            <td class="py-3 px-4">
                                {{ request.MADOCGIA.HOLOT }} {{ request.MADOCGIA.TEN }}
                            </td>
                            <td class="py-3 px-4">
                                {{ request.MASACH.TENSACH }}
                            </td>
                            <td class="py-3 px-4">
                                {{ new Date(request.NGAYMUON).toLocaleDateString() }}
                            </td>
                            <td class="py-3 px-4">
                                <span
                                    :class="{
                                        'bg-yellow-100 text-yellow-800':
                                            request.TRANGTHAI === 'Chờ duyệt',
                                        'bg-green-100 text-green-800':
                                            request.TRANGTHAI === 'Đã duyệt',
                                        'bg-red-100 text-red-800': request.TRANGTHAI === 'Từ chối',
                                        'bg-blue-100 text-blue-800': request.TRANGTHAI === 'Đã trả'
                                    }"
                                    class="px-2 py-1 rounded-full text-xs font-medium"
                                >
                                    {{ request.TRANGTHAI }}
                                </span>
                            </td>
                            <td class="py-3 px-4">
                                <div
                                    v-if="request.TRANGTHAI === 'Chờ duyệt'"
                                    class="flex space-x-2"
                                >
                                    <button
                                        @click="approveRequest(request._id, 'Đã duyệt')"
                                        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Duyệt
                                    </button>
                                    <button
                                        @click="approveRequest(request._id, 'Từ chối')"
                                        class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Từ chối
                                    </button>
                                </div>
                                <button
                                    v-else-if="request.TRANGTHAI === 'Đã duyệt' && !request.NGAYTRA"
                                    @click="returnBook(request._id)"
                                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Xác nhận trả
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBorrowingStore } from '@/stores/borrowing'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const borrowingStore = useBorrowingStore()
const authStore = useAuthStore()
const toast = useToast()
const borrowRequests = ref([])
const loading = ref(false)

const fetchRequests = async () => {
    try {
        loading.value = true
        await borrowingStore.getBorrowRequests(authStore.token)
        borrowRequests.value = borrowingStore.borrowRequests
    } catch (error) {
        toast.error('Lỗi khi tải yêu cầu mượn sách')
    } finally {
        loading.value = false
    }
}

const approveRequest = async (id, status) => {
    try {
        await borrowingStore.approveBorrowRequest(id, status, authStore.token)
        toast.success(`Đã ${status === 'Đã duyệt' ? 'duyệt' : 'từ chối'} yêu cầu mượn sách`)
        fetchRequests()
    } catch (error) {
        toast.error(error.message || 'Lỗi khi xử lý yêu cầu')
    }
}

const returnBook = async (id) => {
    try {
        await borrowingStore.returnBook(id, authStore.token)
        toast.success('Đã xác nhận trả sách thành công')
        fetchRequests()
    } catch (error) {
        toast.error(error.message || 'Lỗi khi xác nhận trả sách')
    }
}

onMounted(() => {
    if (authStore.isAuthenticated) {
        fetchRequests()
    }
})
</script>
