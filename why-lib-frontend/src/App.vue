<template>
    <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
    // Check authentication status when app loads
    if (authStore.token) {
        authStore.getMe()
    }
})
</script>
