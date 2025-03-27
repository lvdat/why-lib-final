import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/Home.vue';
import BookList from '@/views/BookList.vue';
import BookDetail from '@/views/BookDetail.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import MyBorrowings from '@/views/MyBorrowings.vue';
import BorrowRequests from '@/views/staff/BorrowRequests.vue';
import BookManagement from '@/views/admin/BookManagement.vue';
import StaffManagement from '@/views/admin/StaffManagement.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/books',
      name: 'books',
      component: BookList
    },
    {
      path: '/books/:id',
      name: 'book-detail',
      component: BookDetail
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { guestOnly: true }
    },
    {
      path: '/my-borrowings',
      name: 'my-borrowings',
      component: MyBorrowings,
      meta: { requiresAuth: true, role: 'docgia' }
    },
    {
      path: '/borrow-requests',
      name: 'borrow-requests',
      component: BorrowRequests,
      meta: { requiresAuth: true, role: ['nhanvien', 'quantri'] }
    },
    {
      path: '/admin/books',
      name: 'book-management',
      component: BookManagement,
      meta: { requiresAuth: true, role: 'quantri' }
    },
    {
      path: '/admin/staff',
      name: 'staff-management',
      component: StaffManagement,
      meta: { requiresAuth: true, role: 'quantri' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // Check if route is for guest only
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next('/');
  }

  // Check role permissions
  if (to.meta.role) {
    const requiredRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role];
    if (!requiredRoles.includes(authStore.user?.role)) {
      return next('/');
    }
  }

  next();
});

export default router;
