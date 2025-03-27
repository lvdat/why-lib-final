<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Quản lý nhân viên</h1>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Thêm nhân viên mới
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-3 px-4 text-left">Mã NV</th>
              <th class="py-3 px-4 text-left">Họ tên</th>
              <th class="py-3 px-4 text-left">Email</th>
              <th class="py-3 px-4 text-left">Chức vụ</th>
              <th class="py-3 px-4 text-left">Điện thoại</th>
              <th class="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="staff in staffs" :key="staff._id">
              <td class="py-3 px-4">{{ staff.MSNV }}</td>
              <td class="py-3 px-4">{{ staff.HOTENNV }}</td>
              <td class="py-3 px-4">{{ staff.email }}</td>
              <td class="py-3 px-4">{{ staff.CHUCVU }}</td>
              <td class="py-3 px-4">{{ staff.SODIENTHOAI }}</td>
              <td class="py-3 px-4">
                <button
                  @click="editStaff(staff)"
                  class="mr-2 text-blue-600 hover:text-blue-800"
                >
                  Sửa
                </button>
                <button
                  @click="confirmDelete(staff._id)"
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

    <!-- Add/Edit Staff Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">
            {{ showAddModal ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên' }}
          </h2>

          <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên</label>
                <input
                  v-model="form.MSNV"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input
                  v-model="form.HOTENNV"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                <select
                  v-model="form.CHUCVU"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Quản lý">Quản lý</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  v-model="form.DIACHI"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                <input
                  v-model="form.SODIENTHOAI"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
              </div>

              <div v-if="showAddModal">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  v-model="form.password"
                  type="password"
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
                {{ showAddModal ? 'Thêm nhân viên' : 'Cập nhật' }}
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
          <h2 class="text-xl font-bold mb-4">Xác nhận xóa nhân viên</h2>
          <p class="mb-6">Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.</p>

          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              @click="deleteStaff"
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
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const authStore = useAuthStore();
const toast = useToast();

const staffs = ref([]);
const loading = ref(false);

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const form = ref({
  MSNV: '',
  HOTENNV: '',
  email: '',
  password: '',
  CHUCVU: 'Nhân viên',
  DIACHI: '',
  SODIENTHOAI: ''
});

const currentStaffId = ref(null);

const fetchStaffs = async () => {
  try {
    loading.value = true;
    // In a real app, you would call an API endpoint to get staff list
    // For demo, we'll simulate it
    staffs.value = [
      {
        _id: '1',
        MSNV: 'NV001',
        HOTENNV: 'Nguyễn Văn A',
        email: 'nva@example.com',
        CHUCVU: 'Quản lý',
        DIACHI: '123 Đường ABC',
        SODIENTHOAI: '0123456789'
      },
      {
        _id: '2',
        MSNV: 'NV002',
        HOTENNV: 'Trần Thị B',
        email: 'ttb@example.com',
        CHUCVU: 'Nhân viên',
        DIACHI: '456 Đường XYZ',
        SODIENTHOAI: '0987654321'
      }
    ];
  } catch (error) {
    toast.error('Lỗi khi tải danh sách nhân viên');
  } finally {
    loading.value = false;
  }
};

const editStaff = (staff) => {
  form.value = {
    MSNV: staff.MSNV,
    HOTENNV: staff.HOTENNV,
    email: staff.email,
    CHUCVU: staff.CHUCVU,
    DIACHI: staff.DIACHI,
    SODIENTHOAI: staff.SODIENTHOAI
  };
  currentStaffId.value = staff._id;
  showEditModal.value = true;
};

const confirmDelete = (id) => {
  currentStaffId.value = id;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = {
    MSNV: '',
    HOTENNV: '',
    email: '',
    password: '',
    CHUCVU: 'Nhân viên',
    DIACHI: '',
    SODIENTHOAI: ''
  };
  currentStaffId.value = null;
};

const submitForm = async () => {
  try {
    if (showAddModal.value) {
      // In a real app, you would call an API to add staff
      const newStaff = {
        _id: Math.random().toString(36).substr(2, 9),
        ...form.value
      };
      staffs.value.push(newStaff);
      toast.success('Thêm nhân viên thành công');
    } else {
      // In a real app, you would call an API to update staff
      const index = staffs.value.findIndex(s => s._id === currentStaffId.value);
      if (index !== -1) {
        staffs.value[index] = {
          ...staffs.value[index],
          ...form.value
        };
      }
      toast.success('Cập nhật nhân viên thành công');
    }
    closeModal();
  } catch (error) {
    toast.error(error.message || 'Có lỗi xảy ra');
  }
};

const deleteStaff = async () => {
  try {
    // In a real app, you would call an API to delete staff
    staffs.value = staffs.value.filter(s => s._id !== currentStaffId.value);
    toast.success('Xóa nhân viên thành công');
    showDeleteModal.value = false;
  } catch (error) {
    toast.error(error.message || 'Có lỗi xảy ra');
  }
};

onMounted(() => {
  if (authStore.isAuthenticated && authStore.user.role === 'quantri') {
    fetchStaffs();
  }
});
</script>
