<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Authentication check
const isLoggedIn = ref(false)
const user = ref<{
  id: number
  name: string
  email: string
  avatar: string
  phone?: string
  address?: string
  memberSince?: string
  totalTasks?: number
  completedTasks?: number
  rating?: number
  preferences?: {
    notifications: boolean
    emailUpdates: boolean
    smsUpdates: boolean
    marketingEmails: boolean
  }
} | null>(null)

// Check authentication status
onMounted(() => {
  const loggedIn = localStorage.getItem('isLoggedIn')
  const userData = localStorage.getItem('user')
  
  if (loggedIn === 'true' && userData) {
    isLoggedIn.value = true
    // Extend user data with profile information
    user.value = {
      ...JSON.parse(userData),
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      memberSince: 'January 2023',
      totalTasks: 24,
      completedTasks: 22,
      rating: 4.8,
      preferences: {
        notifications: true,
        emailUpdates: true,
        smsUpdates: false,
        marketingEmails: true
      }
    }
  } else {
    // Redirect to login if not authenticated
    navigateTo('/client/auth/login')
  }
})

// Form states
const isEditing = ref(false)
const isSaving = ref(false)
const activeTab = ref('personal')

// Editable form data
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: ''
})

// Preferences form
const preferencesForm = ref({
  notifications: false,
  emailUpdates: false,
  smsUpdates: false,
  marketingEmails: false
})

// Initialize form data when user is loaded
const initializeForm = () => {
  if (user.value) {
    editForm.value = {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone || '',
      address: user.value.address || '',
      avatar: user.value.avatar
    }
    preferencesForm.value = {
      notifications: user.value.preferences?.notifications || false,
      emailUpdates: user.value.preferences?.emailUpdates || false,
      smsUpdates: user.value.preferences?.smsUpdates || false,
      marketingEmails: user.value.preferences?.marketingEmails || false
    }
  }
}

// Start editing
const startEditing = () => {
  isEditing.value = true
  initializeForm()
}

// Cancel editing
const cancelEditing = () => {
  isEditing.value = false
  initializeForm()
}

// Save profile changes
const saveProfile = async () => {
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user data
    if (user.value) {
      user.value.name = editForm.value.name
      user.value.email = editForm.value.email
      user.value.phone = editForm.value.phone
      user.value.address = editForm.value.address
      user.value.avatar = editForm.value.avatar
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
    }
    
    isEditing.value = false
    
    // Show success message (in a real app, you'd use a toast notification)
    alert('Profile updated successfully!')
    
  } catch {
    alert('Error updating profile. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Mock task history data
const taskHistory = ref([
  {
    id: 1,
    title: 'إصلاح صنبور المطبخ',
    provider: 'Mike Johnson',
    date: '2024-01-15',
    status: 'completed',
    amount: 85,
    rating: 5
  },
  {
    id: 2,
    title: 'تركيب بلاط الحمام',
    provider: 'Sarah Wilson',
    date: '2024-01-10',
    status: 'completed',
    amount: 450,
    rating: 4
  },
  {
    id: 3,
    title: 'تركيب مقبس كهربائي',
    provider: 'David Brown',
    date: '2024-01-05',
    status: 'completed',
    amount: 120,
    rating: 5
  },
  {
    id: 4,
    title: 'إصلاح السياج',
    provider: 'Tom Davis',
    date: '2024-01-20',
    status: 'in_progress',
    amount: 200,
    rating: null
  },
  {
    id: 5,
    title: 'تنظيف المزاريب',
    provider: 'Alex Martinez',
    date: '2024-01-25',
    status: 'pending',
    amount: 75,
    rating: null
  }
])

// Computed properties
const completionRate = computed(() => {
  if (!user.value || !user.value.completedTasks || !user.value.totalTasks) return 0
  return Math.round((user.value.completedTasks / user.value.totalTasks) * 100)
})

const userInitials = computed(() => {
  if (!user.value) return ''
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

// Tab management
const tabs = [
  { id: 'personal', name: 'المعلومات الشخصية', icon: 'material-symbols:person' },
  { id: 'history', name: 'سجل المهام', icon: 'material-symbols:history' },
]

// Status badge styles
const getStatusBadge = (status: string) => {
  const badges = {
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
}

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/client/my-tasks" class="text-gray-600 hover:text-gray-900">
              <Icon name="material-symbols:arrow-back" class="w-6 h-6" />
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">ملفي الشخصي</h1>
          </div>
          <button
            @click="handleLogout"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
          >
            <Icon name="material-symbols:logout" class="w-4 h-4 ml-2" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Profile Card -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div class="text-center">
              <div class="relative inline-block">
                <img 
                  v-if="user?.avatar" 
                  :src="user.avatar" 
                  :alt="user.name"
                  class="w-24 h-24 rounded-full object-cover mx-auto"
                >
                <div 
                  v-else 
                  class="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto"
                >
                  <span class="text-white text-2xl font-medium">{{ userInitials }}</span>
                </div>
                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mt-4">{{ user?.name }}</h2>
              <p class="text-gray-600 text-sm">{{ user?.email }}</p>
              <p class="text-gray-500 text-xs mt-1">Member since {{ user?.memberSince }}</p>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ user?.totalTasks }}</div>
                <div class="text-xs text-gray-500">إجمالي المهام</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ completionRate }}%</div>
                <div class="text-xs text-gray-500">معدل الإنجاز</div>
              </div>
            </div>
            
            <!-- Rating -->
            <div class="mt-4 pt-4 border-t">
              <div class="flex items-center justify-center space-x-2">
                <div class="flex items-center">
                  <Icon name="material-symbols:star" class="w-5 h-5 text-yellow-400 fill-current" />
                  <span class="text-lg font-semibold text-gray-900 ml-1">{{ user?.rating }}</span>
                </div>
                <span class="text-gray-500 text-sm">تقييم العميل</span>
              </div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="bg-white rounded-2xl shadow-sm p-2">
            <nav class="space-y-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                ]"
              >
                <Icon :name="tab.icon" class="w-5 h-5 mr-3" />
                {{ tab.name }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Personal Information Tab -->
          <div v-if="activeTab === 'personal'" class="bg-white rounded-2xl shadow-sm">
            <div class="p-6 border-b">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">المعلومات الشخصية</h3>
                <button
                  v-if="!isEditing"
                  @click="startEditing"
                  class="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Icon name="material-symbols:edit" class="w-4 h-4 ml-2" />
                  تعديل
                </button>
              </div>
            </div>

            <div class="p-6">
              <form v-if="isEditing" @submit.prevent="saveProfile" class="space-y-6">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">الاسم الكامل</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  >
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">البريد الإلكتروني</label>
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  >
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">رقم الهاتف</label>
                  <input
                    v-model="editForm.phone"
                    type="tel"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                </div>

                <!-- Address -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">العنوان</label>
                  <textarea
                    v-model="editForm.address"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-4">
                  <button
                    type="submit"
                    :disabled="isSaving"
                    class="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon 
                      v-if="isSaving" 
                      name="material-symbols:progress-activity" 
                      class="animate-spin w-4 h-4 ml-2" 
                    />
                    {{ isSaving ? 'جارٍ الحفظ...' : 'حفظ التغييرات' }}
                  </button>
                  <button
                    type="button"
                    @click="cancelEditing"
                    class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>

              <!-- Display Mode -->
              <div v-else class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">الاسم الكامل</label>
                    <p class="text-gray-700">{{ user?.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">البريد الإلكتروني</label>
                    <p class="text-gray-700">{{ user?.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">رقم الهاتف</label>
                    <p class="text-gray-700">{{ user?.phone || 'غير متوفر' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">عضو منذ</label>
                    <p class="text-gray-700">{{ user?.memberSince }}</p>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">العنوان</label>
                  <p class="text-gray-700">{{ user?.address || 'غير متوفر' }}</p>
                </div>
              </div>
            </div>
          </div>

          
          <!-- Task History Tab -->
          <div v-if="activeTab === 'history'" class="bg-white rounded-2xl shadow-sm">
            <div class="p-6 border-b">
              <h3 class="text-lg font-semibold text-gray-900">سجل المهام</h3>
              <p class="text-gray-600 text-sm mt-1">عرض جميع المهام المكتملة والجارية</p>
            </div>

            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="task in taskHistory"
                  :key="task.id"
                  class="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <h4 class="font-semibold text-gray-900">{{ task.title }}</h4>
                        <span :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getStatusBadge(task.status)
                        ]">
                          {{ task.status === 'completed' ? 'مكتمل' : 
                             task.status === 'in_progress' ? 'قيد التنفيذ' :
                             task.status === 'pending' ? 'قيد الانتظار' :
                             task.status === 'cancelled' ? 'ملغي' : '' }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 mb-1">مقدم الخدمة: {{ task.provider }}</p>
                      <p class="text-sm text-gray-500">{{ task.date }}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-lg font-semibold text-gray-900">${{ task.amount }}</div>
                      <div v-if="task.rating" class="flex items-center mt-1">
                        <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current" />
                        <span class="text-sm text-gray-600 ml-1">{{ task.rating }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 