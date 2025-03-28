import { defineStore } from 'pinia'
import borrowingService from '@/services/borrowingService'
import { useToast } from 'vue-toastification'

export const useBorrowingStore = defineStore('borrowing', {
    state: () => ({
        borrowRequests: [],
        myBorrowings: [],
        loading: false
    }),
    actions: {
        async borrowBook(bookId, token) {
            try {
                this.loading = true
                const response = await borrowingService.borrowBook(bookId, token)
                return response
            } catch (error) {
                throw error.response?.data?.message || 'Failed to borrow book'
            } finally {
                this.loading = false
            }
        },
        async fetchBorrowRequests(token) {
            try {
                this.loading = true
                const response = await borrowingService.getBorrowRequests(token)
                this.borrowRequests = response.muonSachs
                return response
            } catch (error) {
                throw error.response?.data?.message || 'Failed to fetch borrow requests'
            } finally {
                this.loading = false
            }
        },
        async getMyBorrowings(userId, token) {
            try {
                this.loading = true
                const response = await borrowingService.getMyBorrowings(userId, token)
                this.myBorrowings = response.muonSachs
                return response
            } catch (error) {
                throw error.response?.data?.message || 'Failed to fetch your borrowings'
            } finally {
                this.loading = false
            }
        },
        async approveBorrowRequest(requestId, status, token) {
            try {
                this.loading = true
                const response = await borrowingService.approveBorrowRequest(
                    requestId,
                    status,
                    token
                )

                // Update the request in state
                const index = this.borrowRequests.findIndex((r) => r._id === requestId)
                if (index !== -1) {
                    this.borrowRequests[index] = response.muonSach
                }

                return response
            } catch (error) {
                throw error.response?.data?.message || 'Failed to approve request'
            } finally {
                this.loading = false
            }
        },
        async returnBook(requestId, token) {
            try {
                this.loading = true
                const response = await borrowingService.returnBook(requestId, token)

                // Update the request in state
                const index = this.borrowRequests.findIndex((r) => r._id === requestId)
                if (index !== -1) {
                    this.borrowRequests[index] = response.muonSach
                }

                // Also update in myBorrowings if exists
                const myIndex = this.myBorrowings.findIndex((r) => r._id === requestId)
                if (myIndex !== -1) {
                    this.myBorrowings[myIndex] = response.muonSach
                }

                return response
            } catch (error) {
                throw error.response?.data?.message || 'Failed to return book'
            } finally {
                this.loading = false
            }
        }
    }
})
