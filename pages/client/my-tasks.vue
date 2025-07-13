<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Page metadata
useHead({
  title: 'مهامي | HandyIT.com',
  meta: [
    { name: 'description', content: 'إدارة مهامك وتتبع الطلبات من مقدمي الخدمات.' }
  ]
})

// User interface
interface User {
  id: number
  name: string
  email: string
  avatar: string
}

// Authentication state
const isLoggedIn = ref(false)
const user = ref<User | null>(null)
const isLoading = ref(true)

// Task filters
const selectedStatus = ref('all')
const searchQuery = ref('')

// Task statuses
const taskStatuses = [
  { id: 'all', name: 'جميع المهام', count: 0 },
  { id: 'pending', name: 'قيد الانتظار', count: 0 },
  { id: 'accepted', name: 'مقبولة', count: 0 },
  { id: 'in-progress', name: 'قيد التنفيذ', count: 0 },
  { id: 'completed', name: 'مكتملة', count: 0 },
  { id: 'cancelled', name: 'ملغاة', count: 0 }
]

// Mock tasks data
const allTasks = ref([
  {
    id: 1,
    title: 'تركيب أثاث - خزانة ملابس IKEA',
    description: 'بحاجة إلى مساعدة في تركيب خزانة ملابس IKEA كبيرة في غرفة النوم. سيتم توفير جميع الأدوات.',
    category: 'التركيب',
    subcategory: 'تركيب خزانة الملابس',
    status: 'in-progress',
    priority: 'medium',
    budget: 120,
    location: 'نيويورك، نيويورك',
    createdAt: '2024-01-15T10:30:00Z',
    scheduledDate: '2024-01-20T14:00:00Z',
    estimatedDuration: '3 ساعات',
    provider: {
      id: 1,
      name: 'Courtney Henry',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 4.98,
      phone: '+1 (555) 123-4567'
    },
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    ],
    messages: 3,
    lastUpdate: '2024-01-18T09:15:00Z'
  },
  {
    id: 2,
    title: 'إصلاح سباكة الحمام',
    description: 'صنبور مسرب في الحمام الرئيسي يحتاج إلى إصلاح. ضغط الماء منخفض أيضاً.',
    category: 'السباكة',
    subcategory: 'إصلاح',
    status: 'pending',
    priority: 'high',
    budget: 200,
    location: 'نيويورك، نيويورك',
    createdAt: '2024-01-18T16:45:00Z',
    scheduledDate: null,
    estimatedDuration: 'ساعتان',
    provider: null,
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop'
    ],
    messages: 0,
    lastUpdate: '2024-01-18T16:45:00Z'
  },
  {
    id: 3,
    title: 'تنظيف عميق للمنزل',
    description: 'تنظيف عميق كامل لمنزل من 3 غرف نوم يشمل المطبخ والحمامات ومناطق المعيشة.',
    category: 'التنظيف',
    subcategory: 'تنظيف عميق',
    status: 'completed',
    priority: 'low',
    budget: 300,
    location: 'نيويورك، نيويورك',
    createdAt: '2024-01-10T11:20:00Z',
    scheduledDate: '2024-01-15T09:00:00Z',
    estimatedDuration: '6 ساعات',
    provider: {
      id: 3,
      name: 'Arlene McCoy',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
      rating: 4.98,
      phone: '+1 (555) 987-6543'
    },
    images: [],
    messages: 5,
    lastUpdate: '2024-01-15T16:30:00Z'
  },
  {
    id: 4,
    title: 'تركيب مقابس كهربائية',
    description: 'تركيب 3 مقابس كهربائية جديدة في المكتب المنزلي. جميع المواد متوفرة.',
    category: 'الكهرباء',
    subcategory: 'تركيب',
    status: 'accepted',
    priority: 'medium',
    budget: 180,
    location: 'نيويورك، نيويورك',
    createdAt: '2024-01-19T14:15:00Z',
    scheduledDate: '2024-01-25T10:00:00Z',
    estimatedDuration: 'ساعتان',
    provider: {
      id: 4,
      name: 'Jerome Bell',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      rating: 4.97,
      phone: '+1 (555) 456-7890'
    },
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop'
    ],
    messages: 2,
    lastUpdate: '2024-01-19T15:30:00Z'
  },
  {
    id: 5,
    title: 'طلاء الجدران الداخلية',
    description: 'طلاء جدران غرفة المعيشة وغرفة الطعام. بحاجة إلى استشارة في اختيار الألوان وتشطيب احترافي.',
    category: 'الطلاء',
    subcategory: 'داخلي',
    status: 'cancelled',
    priority: 'low',
    budget: 450,
    location: 'نيويورك، نيويورك',
    createdAt: '2024-01-12T13:30:00Z',
    scheduledDate: null,
    estimatedDuration: 'يومان',
    provider: null,
    images: [],
    messages: 1,
    lastUpdate: '2024-01-14T10:00:00Z'
  }
])

// Check authentication on mount
onMounted(() => {
  checkAuth()
})

// Authentication check
const checkAuth = () => {
  try {
    if(! import.meta.client) {
      return
    }
    const loggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (loggedIn === 'true' && userData) {
      isLoggedIn.value = true
      user.value = JSON.parse(userData)
    } else {
      // Redirect to login with return URL
      const router = useRouter()
      router.push('/client/auth/login?redirect=/client/my-tasks')
    }
  } catch {
    // Redirect to login if there's an error
    const router = useRouter()
    router.push('/client/auth/login?redirect=/client/my-tasks')
  } finally {
    isLoading.value = false
  }
}

// Filtered tasks
const filteredTasks = computed(() => {
  let filtered = allTasks.value

  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(task => task.status === selectedStatus.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query) ||
      task.location.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Update task status counts
const updateStatusCounts = () => {
  taskStatuses.forEach(status => {
    if (status.id === 'all') {
      status.count = allTasks.value.length
    } else {
      status.count = allTasks.value.filter(task => task.status === status.id).length
    }
  })
}

// Update counts on mount
onMounted(() => {
  updateStatusCounts()
})

// Helper functions
const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600'
  }
  return colors[priority as keyof typeof colors] || 'text-gray-600'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Logout function (handled by Header component)
// const logout = () => {
//   localStorage.removeItem('isLoggedIn')
//   localStorage.removeItem('user')
//   const router = useRouter()
//   router.push('/client/auth/login')
// }
</script>

<template>
  <div class="min-h-screen bg-gray-50">
          <!-- Loading State -->
      <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <Icon name="material-symbols:progress-activity" class="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p class="text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>

      <!-- Authenticated Content -->
      <div v-else-if="isLoggedIn">
        <!-- Header -->
        <GuestHeader />

        <!-- Page Header -->
        <section class="bg-white border-b border-gray-200">
          <div class="container mx-auto px-4 py-8">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">مهامي</h1>
                <p class="text-lg text-gray-600 mt-2">إدارة وتتبع طلبات الخدمة الخاصة بك</p>
              </div>
              
            </div>
          </div>
        </section>

        <!-- Filters and Search -->
        <section class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
            <!-- Status Filter Tabs -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="status in taskStatuses"
                :key="status.id"
                @click="selectedStatus = status.id"
                :class="[
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                  selectedStatus === status.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                ]"
              >
                <span>{{ status.name }}</span>
                <span class="bg-white/20 text-xs px-2 py-1 rounded-full">{{ status.count }}</span>
              </button>
            </div>

            <!-- Search -->
            <div class="relative">
              <Icon name="material-symbols:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="البحث في المهام..."
                class="pr-10 pl-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
            </div>
          </div>
        </section>

      <!-- Tasks List -->
      <section class="container mx-auto px-4 pb-8">
        <div class="space-y-4">
          <!-- Task Card -->
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div class="p-6">
              <!-- Task Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">{{ task.title }}</h3>
                    <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusColor(task.status)]">
                      {{ task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                    </span>
                  </div>
                  <p class="text-gray-600 mb-3">{{ task.description }}</p>
                  
                  <!-- Task Meta -->
                  <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div class="flex items-center gap-1">
                      <Icon name="material-symbols:category" class="w-4 h-4" />
                      <span>{{ task.category }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Icon name="material-symbols:location-on" class="w-4 h-4" />
                      <span>{{ task.location }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Icon name="material-symbols:schedule" class="w-4 h-4" />
                      <span>{{ task.estimatedDuration }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Icon name="material-symbols:priority-high" :class="['w-4 h-4', getPriorityColor(task.priority)]" />
                      <span :class="getPriorityColor(task.priority)">
                        {{ task.priority === 'high' ? 'أولوية عالية' :
                           task.priority === 'medium' ? 'أولوية متوسطة' :
                           task.priority === 'low' ? 'أولوية منخفضة' : '' }}
                      </span>
                    </div>
                  </div>
                </div>
                
                <!-- Budget -->
                <div class="text-right">
                  <p class="text-2xl font-bold text-gray-900">${{ task.budget }}</p>
                  <p class="text-sm text-gray-600">الميزانية</p>
                </div>
              </div>

              <!-- Provider Info -->
              <div v-if="task.provider" class="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                <div class="flex items-center gap-3">
                  <img 
                    :src="task.provider.avatar" 
                    :alt="task.provider.name"
                    class="w-12 h-12 rounded-full"
                  >
                  <div>
                    <p class="font-semibold text-gray-900">{{ task.provider.name }}</p>
                    <div class="flex items-center gap-1">
                      <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current" />
                      <span class="text-sm text-gray-600">{{ task.provider.rating }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Icon name="material-symbols:phone" class="w-5 h-5" />
                  </button>
                  <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Icon name="material-symbols:chat" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Task Images -->
              <div v-if="task.images.length > 0" class="mb-4">
                <div class="flex gap-2 overflow-x-auto">
                  <img
                    v-for="(image, index) in task.images"
                    :key="index"
                    :src="image"
                    :alt="`صورة المهمة ${index + 1}`"
                    class="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  >
                </div>
              </div>

              <!-- Task Footer -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <div class="flex items-center gap-1">
                    <Icon name="material-symbols:calendar-today" class="w-4 h-4" />
                    <span>تم الإنشاء {{ formatDate(task.createdAt) }}</span>
                  </div>
                  <div v-if="task.scheduledDate" class="flex items-center gap-1">
                    <Icon name="material-symbols:event" class="w-4 h-4" />
                    <span>مجدول {{ formatDateTime(task.scheduledDate) }}</span>
                  </div>
                  <div v-if="task.messages > 0" class="flex items-center gap-1">
                    <Icon name="material-symbols:message" class="w-4 h-4" />
                    <span>{{ task.messages }} رسائل</span>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex items-center gap-2">
                  <NuxtLink 
                    :to="`/client/service-detail?id=${task.id}&provider=${task.provider?.id || 1}`"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    عرض التفاصيل
                  </NuxtLink>
                  <button v-if="task.status === 'pending'" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    تعديل المهمة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTasks.length === 0" class="text-center py-12">
          <Icon name="material-symbols:task-alt" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">لم يتم العثور على مهام</h3>
          <p class="text-gray-600 mb-6">
            {{ selectedStatus === 'all' ? 'لم تقم بإنشاء أي مهام حتى الآن.' : `لا توجد مهام ${selectedStatus}` }}
          </p>
          <button class="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            إنشاء مهمة جديدة
          </button>
        </div>
      </section>
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