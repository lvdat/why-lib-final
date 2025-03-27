<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Quản lý sách</h1>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Thêm sách mới
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-3 px-4 text-left">Mã sách</th>
              <th class="py-3 px-4 text-left">Tên sách</th>
              <th class="py-3 px-4 text-left">Tác giả</th>
              <th class="py-3 px-4 text-left">NXB</th>
              <th class="py-3 px-4 text-left">Số lượng</th>
              <th class="py-3 px-4 text-left">Giá</th>
              <th class="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="book in books" :key="book._id">
              <td class="py-3 px-4">{{ book.MASACH }}</td>
              <td class="py-3 px-4">{{ book.TENSACH }}</td>
              <td class="py-3 px-4">{{ book.TACGIA }}</td>
              <td class="py-3 px-4">{{ book.MANXB?.TENNXB }}</td>
              <td class="py-3 px-4">{{ book.SOQUYEN }}</td>
              <td class="py-3 px-4">{{ book.DONGIA.toLocaleString() }} VNĐ</td>
              <td class="py-3 px-4">
                <button
                  @click="editBook(book)"
                  class="mr-2 text-blue-600 hover:text-blue-800"
                >
                  Sửa
                </button>
                <button
                  @click="confirmDelete(book._id)"
                  class="text-red-600 hover:text-red-800"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Book Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">
            {{ showAddModal ? 'Thêm sách mới' : 'Chỉnh sửa sách' }}
          </h2>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mã sách</label>
                <input
                  v-model="form.MASACH"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tên sách</label>
                <input
                  v-model="form.TENSACH"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input
                  v-model="form.TACGIA"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nhà xuất bản</label>
                <select
                  v-model="form.MANXB"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option v-for="publisher in publishers" :key="publisher._id" :value="publisher._id">
                    {{ publisher.TENNXB }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Năm xuất bản</label>
                <input
                  v-model="form.NAMXUATBAN"
                  type="number"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                <input
                  v-model="form.SOQUYEN"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VNĐ)</label>
                <input
                  v-model="form.DONGIA"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                {{ showAddModal ? 'Thêm sách' : 'Cập nhật' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">Xác nhận xóa sách</h2>
          <p class="mb-6">Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác.</p>

          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              @click="deleteBook"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBookStore } from '@/stores/books';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const bookStore = useBookStore();
const authStore = useAuthStore();
const toast = useToast();

const books = ref([]);
const publishers = ref([]);
const loading = ref(false);

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const form = ref({
  MASACH: '',
  TENSACH: '',
  TACGIA: '',
  MANXB: '',
  NAMXUATBAN: '',
  SOQUYEN: 0,
  DONGIA: 0
});

const currentBookId = ref(null);

const fetchData = async () => {
  try {
    loading.value = true;
    await bookStore.fetchBooks();
    books.value = bookStore.books;

    // Extract publishers from books
    const uniquePublishers = {};
    books.value.forEach(book => {
      if (book.MANXB && !uniquePublishers[book.MANXB._id]) {
        uniquePublishers[book.MANXB._id] = book.MANXB;
      }
    });
    publishers.value = Object.values(uniquePublishers);
  } catch (error) {
    toast.error('Lỗi khi tải dữ liệu sách');
  } finally {
    loading.value = false;
  }
};

const editBook = (book) => {
  form.value = {
    MASACH: book.MASACH,
    TENSACH: book.TENSACH,
    TACGIA: book.TACGIA,
    MANXB: book.MANXB._id,
    NAMXUATBAN: book.NAMXUATBAN,
    SOQUYEN: book.SOQUYEN,
    DONGIA: book.DONGIA
  };
  currentBookId.value = book._id;
  showEditModal.value = true;
};

const confirmDelete = (id) => {
  currentBookId.value = id;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    MASACH: '',
    TENSACH: '',
    TACGIA: '',
    MANXB: '',
    NAMXUATBAN: '',
    SOQUYEN: 0,
    DONGIA: 0
  };
  currentBookId.value = null;
};

const submitForm = async () => {
  try {
    if (showAddModal.value) {
      await bookStore.createBook(form.value);
      toast.success('Thêm sách thành công');
    } else {
      await bookStore.updateBook(currentBookId.value, form.value);
      toast.success('Cập nhật sách thành công');
    }
    closeModal();
    fetchData();
  } catch (error) {
    toast.error(error.message || 'Có lỗi xảy ra');
  }
};

const deleteBook = async () => {
  try {
    await bookStore.deleteBook(currentBookId.value);
    toast.success('Xóa sách thành công');
    showDeleteModal.value = false;
    fetchData();
  } catch (error) {
    toast.error(error.message || 'Có lỗi xảy ra');
  }
};

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchData();
  }
});
</script>
