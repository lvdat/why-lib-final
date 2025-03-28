<template>
    <div class="min-h-screen bg-gray-50">
        <Header />

        <div class="container mx-auto px-4 py-8">
            <div v-if="loading" class="flex justify-center py-8">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
                ></div>
            </div>

            <div v-else-if="book" class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="p-6 md:p-8">
                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="md:w-1/3">
                            <div
                                class="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64"
                            >
                                <span class="text-gray-400 text-lg">Hình ảnh sách</span>
                            </div>
                        </div>

                        <div class="md:w-2/3">
                            <h1 class="text-3xl font-bold text-gray-800 mb-2">
                                {{ book.TENSACH }}
                            </h1>
                            <p class="text-lg text-gray-600 mb-4">Tác giả: {{ book.TACGIA }}</p>

                            <div class="flex items-center mb-4">
                                <span class="text-xl font-bold text-primary-600 mr-4"
                                    >{{ book.DONGIA.toLocaleString() }} VNĐ</span
                                >
                                <span
                                    :class="[
                                        'px-3 py-1 rounded-full text-sm font-medium',
                                        book.SOQUYEN > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    ]"
                                >
                                    {{
                                        book.SOQUYEN > 0
                                            ? 'Còn ' + book.SOQUYEN + ' quyển'
                                            : 'Hết sách'
                                    }}
                                </span>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p class="text-sm text-gray-500">Nhà xuất bản</p>
                                    <p class="font-medium">{{ book.MANXB?.TENNXB }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Năm xuất bản</p>
                                    <p class="font-medium">{{ book.NAMXUATBAN }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Địa chỉ NXB</p>
                                    <p class="font-medium">{{ book.MANXB?.DIACHI }}</p>
                                </div>
                            </div>

                            <button
                                v-if="book.SOQUYEN > 0 && authStore.user?.role === 'docgia'"
                                @click="borrowBook"
                                class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Mượn sách
                            </button>
                        </div>
                    </div>

                    <div class="mt-8 pt-6 border-t border-gray-200">
                        <h2 class="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
                        <p class="text-gray-600">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                            commodo consequat.
                        </p>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-12">
                <h2 class="text-2xl font-bold text-gray-700 mb-4">Không tìm thấy sách</h2>
                <router-link
                    to="/books"
                    class="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Quay lại danh sách sách
                </router-link>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { useBorrowingStore } from '@/stores/borrowing'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const borrowingStore = useBorrowingStore()
const authStore = useAuthStore()
const toast = useToast()

const book = ref(null)
const loading = ref(true)

const fetchBook = async () => {
    try {
        loading.value = true
        const bookId = route.params.id
        if (bookStore.books.length === 0) {
            await bookStore.fetchBooks()
        }
        book.value = bookStore.getBookById(bookId)
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
}

const borrowBook = async () => {
    if (!authStore.isAuthenticated) {
        router.push({ name: 'login', query: { redirect: route.fullPath } })
        return
    }

    try {
        await borrowingStore.borrowBook(book.value._id)
        toast.success('Đã gửi yêu cầu mượn sách thành công!')
        fetchBook() // Refresh book data
    } catch (error) {
        toast.error(error || 'Có lỗi khi gửi yêu cầu mượn sách')
    }
}

onMounted(() => {
    fetchBook()
})
</script>
