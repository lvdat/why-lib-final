<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Danh sách sách trong thư viện</h1>

      <div class="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div class="w-full md:w-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm sách..."
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
        </div>
        <div class="w-full md:w-auto">
          <select
            v-model="selectedPublisher"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tất cả NXB</option>
            <option v-for="publisher in publishers" :key="publisher._id" :value="publisher._id">
              {{ publisher.TENNXB }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <BookCard
          v-for="book in filteredBooks"
          :key="book._id"
          :book="book"
          :can-borrow="isReader"
          @borrowed="fetchBooks"
        />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBookStore } from '@/stores/books';
import { useAuthStore } from '@/stores/auth';
import BookCard from '@/components/BookCard.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const bookStore = useBookStore();
const authStore = useAuthStore();
const loading = ref(false);
const searchQuery = ref('');
const selectedPublisher = ref('');

const isReader = computed(() => authStore.user?.role === 'docgia');

const publishers = ref([]);
const books = ref([]);

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    const matchesSearch = book.TENSACH.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         book.TACGIA.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesPublisher = !selectedPublisher.value || book.MANXB?._id === selectedPublisher.value;
    return matchesSearch && matchesPublisher;
  });
});

const fetchBooks = async () => {
  try {
    loading.value = true;
    await bookStore.fetchBooks();
    books.value = bookStore.books;
    publishers.value = bookStore.publishers;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBooks();
});
</script>
