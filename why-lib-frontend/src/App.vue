<template>
    <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
    // Check authentication status when app loads
    if (authStore.token) {
      try {
      await authStore.getMe();
    } catch (error) {
      authStore.logout();
    }
    }
})
</script>
