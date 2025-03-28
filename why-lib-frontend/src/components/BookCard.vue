<template>
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800">{{ book.TENSACH }}</h3>
            <p class="text-sm text-gray-600 mt-1">Tác giả: {{ book.TACGIA }}</p>
            <p class="text-sm text-gray-600">NXB: {{ book.MANXB?.TENNXB }}</p>
            <p class="text-sm text-gray-600">Năm XB: {{ book.NAMXUATBAN }}</p>

            <div class="mt-3 flex justify-between items-center">
                <span class="text-lg font-bold text-primary-600"
                    >{{ book.DONGIA.toLocaleString() }} VNĐ</span
                >
                <span
                    :class="[
                        'px-2 py-1 rounded-full text-xs font-medium',
                        book.SOQUYEN > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                >
                    {{ book.SOQUYEN > 0 ? 'Còn ' + book.SOQUYEN + ' quyển' : 'Hết sách' }}
                </span>
            </div>

            <button
                v-if="book.SOQUYEN > 0 && canBorrow"
                @click="borrowBook"
                class="mt-3 w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded transition-colors"
            >
                Mượn sách
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBorrowingStore } from '@/stores/borrowing'
import { useToast } from 'vue-toastification'

const props = defineProps({
    book: Object,
    canBorrow: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['borrowed'])

const toast = useToast()
const borrowingStore = useBorrowingStore()

const borrowBook = async () => {
    try {
        await borrowingStore.borrowBook(props.book._id)
        toast.success('Đã gửi yêu cầu mượn sách thành công!')
        emit('borrowed')
    } catch (error) {
      console.log(error)
        toast.error(error || 'Có lỗi khi gửi yêu cầu mượn sách')
    }
}
</script>
