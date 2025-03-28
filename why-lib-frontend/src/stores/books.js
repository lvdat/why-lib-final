import { defineStore } from 'pinia'
import bookService from '@/services/bookService'
import { useToast } from 'vue-toastification'

export const useBookStore = defineStore('books', {
    state: () => ({
        books: [],
        publishers: [],
        loading: false
    }),
    actions: {
        async fetchBooks() {
            try {
                this.loading = true
                const response = await bookService.getAllBooks()
                this.books = response.sachs
                // Assuming we have a separate endpoint for publishers
                // For simplicity, we'll just extract from books
                const uniquePublishers = {}
                this.books.forEach((book) => {
                    if (book.MANXB && !uniquePublishers[book.MANXB._id]) {
                        uniquePublishers[book.MANXB._id] = book.MANXB
                    }
                })
                this.publishers = Object.values(uniquePublishers)
            } catch (error) {
                const toast = useToast()
                toast.error('Lỗi khi tải danh sách sách')
            } finally {
                this.loading = false
            }
        },
        async createBook(bookData) {
            try {
                const response = await bookService.createBook(bookData, this.token)
                this.books.push(response.sach)
                return response
            } catch (error) {
                throw error.response?.data?.message || 'Tạo sách thất bại'
            }
        },
        async updateBook(id, bookData) {
            try {
                const response = await bookService.updateBook(id, bookData, this.token)
                const index = this.books.findIndex((b) => b._id === id)
                if (index !== -1) {
                    this.books[index] = response.sach
                }
                return response
            } catch (error) {
                throw error.response?.data?.message || 'Cập nhật sách thất bại'
            }
        },
        async deleteBook(id) {
            try {
                await bookService.deleteBook(id, this.token)
                this.books = this.books.filter((b) => b._id !== id)
            } catch (error) {
                throw error.response?.data?.message || 'Xóa sách thất bại'
            }
        }
    },
    getters: {
        getBookById: (state) => (id) => {
            return state.books.find((book) => book._id === id)
        }
    }
})
