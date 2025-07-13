<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Authentication check
const isLoggedIn = ref(false)
const user = ref<{
  id: number
  name: string
  email: string
  avatar: string
  type: string
  businessName: string
  rating: number
  completedJobs: number
  skills: string[]
} | null>(null)

// Check authentication status
onMounted(() => {
  const loggedIn = localStorage.getItem('isLoggedIn')
  const userType = localStorage.getItem('userType')
  const userData = localStorage.getItem('user')
  
  if (loggedIn === 'true' && userType === 'provider' && userData) {
    isLoggedIn.value = true
    user.value = JSON.parse(userData)
  } else {
    // Redirect to login if not authenticated as provider
    navigateTo('/client/auth/login')
  }
})

// Dashboard stats
const stats = ref({
  activeRequests: 8,
  completedThisMonth: 12,
  totalEarnings: 2840,
  avgRating: 4.9,
  responseTime: 'ساعتان'
})

// Active service requests
const serviceRequests = ref([
  {
    id: 1,
    title: 'إصلاح صنبور المطبخ',
    client: 'سارة ويلسون',
    location: 'بروكلين، نيويورك',
    budget: '80-120 د.ك',
    priority: 'high',
    postedTime: 'قبل ساعتين',
    description: 'صنبور المطبخ يسرب ويحتاج إلى إصلاح فوري. الماء يتقطر باستمرار.',
    category: 'السباكة',
    status: 'pending'
  },
  {
    id: 2,
    title: 'طلاء غرفة المعيشة',
    client: 'جون ديفيس',
    location: 'مانهاتن، نيويورك',
    budget: '300-500 د.ك',
    priority: 'medium',
    postedTime: 'قبل 4 ساعات',
    description: 'بحاجة إلى طلاء جدران غرفة المعيشة. الغرفة تقريباً 15×12 قدم.',
    category: 'الطلاء',
    status: 'pending'
  },
  {
    id: 3,
    title: 'تركيب منفذ كهربائي',
    client: 'مايك براون',
    location: 'كوينز، نيويورك',
    budget: '100-150 د.ك',
    priority: 'medium',
    postedTime: 'قبل 6 ساعات',
    description: 'بحاجة إلى تركيب 3 منافذ كهربائية جديدة في المكتب المنزلي.',
    category: 'الكهرباء',
    status: 'pending'
  },
  {
    id: 4,
    title: 'إصلاح السياج',
    client: 'ليزا جونسون',
    location: 'برونكس، نيويورك',
    budget: '200-300 د.ك',
    priority: 'low',
    postedTime: 'قبل يوم واحد',
    description: 'سياج خشبي تضرر من العاصفة. يحتاج إلى إصلاح حوالي 10 أقدام.',
    category: 'النجارة',
    status: 'pending'
  },
  {
    id: 5,
    title: 'استبدال بلاط الحمام',
    client: 'توم ويلسون',
    location: 'ستاتن آيلاند، نيويورك',
    budget: '400-600 د.ك',
    priority: 'high',
    postedTime: 'قبل 3 ساعات',
    description: 'عدة بلاطات في الحمام متشققة وتحتاج إلى استبدال.',
    category: 'تركيب البلاط',
    status: 'accepted'
  }
])

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    type: 'job_completed',
    title: 'تم الإنجاز: تركيب خزائن المطبخ',
    client: 'إيما ديفيس',
    time: 'قبل ساعتين',
    amount: '450 د.ك'
  },
  {
    id: 2,
    type: 'new_request',
    title: 'طلب جديد: إصلاح السباكة',
    client: 'روبرت سميث',
    time: 'قبل 4 ساعات',
    amount: '120 د.ك'
  },
  {
    id: 3,
    type: 'payment_received',
    title: 'تم استلام الدفعة',
    client: 'أليس جونسون',
    time: 'قبل يوم واحد',
    amount: '280 د.ك'
  },
  {
    id: 4,
    type: 'review_received',
    title: 'تقييم جديد 5 نجوم',
    client: 'ديفيد ويلسون',
    time: 'قبل يومين',
    rating: 5
  }
])

// Computed properties
const userInitials = computed(() => {
  if (!user.value) return ''
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

// Priority badge styles
const getPriorityBadge = (priority: string) => {
  const badges = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return badges[priority as keyof typeof badges] || 'bg-gray-100 text-gray-800'
}

// Status badge styles
const getStatusBadge = (status: string) => {
  const badges = {
    pending: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800'
  }
  return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
}

// Activity type icons
const getActivityIcon = (type: string) => {
  const icons = {
    job_completed: 'material-symbols:check-circle',
    new_request: 'material-symbols:notification-add',
    payment_received: 'material-symbols:payments',
    review_received: 'material-symbols:star'
  }
  return icons[type as keyof typeof icons] || 'material-symbols:info'
}

// Handle service request actions
const acceptRequest = (requestId: number) => {
  const request = serviceRequests.value.find(r => r.id === requestId)
  if (request) {
    request.status = 'accepted'
    // In real app, make API call
    console.log('Accepted request:', requestId)
  }
}

const declineRequest = (requestId: number) => {
  serviceRequests.value = serviceRequests.value.filter(r => r.id !== requestId)
  // In real app, make API call
  console.log('Declined request:', requestId)
}

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userType')
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
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <Icon name="material-symbols:handyman" class="w-5 h-5 text-white" />
              </div>
              <h1 class="text-xl font-medium text-gray-900">HandyIT</h1>
            </div>
            <div class="hidden md:flex items-center space-x-6">
              <NuxtLink to="/provider/dashboard" class="text-blue-600 font-medium">لوحة التحكم</NuxtLink>
              <NuxtLink to="/provider/my-services" class="text-gray-700 hover:text-gray-900">خدماتي</NuxtLink>
              <NuxtLink to="/provider/profile" class="text-gray-700 hover:text-gray-900">الملف الشخصي</NuxtLink>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Provider Info -->
            <div v-if="user" class="hidden md:flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-xs text-gray-500">{{ user.businessName }}</p>
              </div>
              <div class="relative">
                <img 
                  v-if="user.avatar" 
                  :src="user.avatar" 
                  :alt="user.name"
                  class="w-10 h-10 rounded-full object-cover"
                >
                <div 
                  v-else 
                  class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <span class="text-white text-sm font-medium">{{ userInitials }}</span>
                </div>
              </div>
            </div>
            
            <!-- Logout Button -->
            <button 
              @click="handleLogout"
              class="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <Icon name="material-symbols:logout" class="w-4 h-4 mr-1" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">مرحبا بك, {{ user?.name }}!</h1>
        <p class="text-gray-600">هذا ما يحدث مع طلبات خدماتك اليوم.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Icon name="material-symbols:pending-actions" class="w-6 h-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">طلبات نشطة</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeRequests }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Icon name="material-symbols:task-alt" class="w-6 h-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">منجزة</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.completedThisMonth }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Icon name="material-symbols:payments" class="w-6 h-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">الأرباح</p>
              <p class="text-2xl font-bold text-gray-900">${{ stats.totalEarnings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Icon name="material-symbols:star" class="w-6 h-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">التقييم</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.avgRating }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Icon name="material-symbols:schedule" class="w-6 h-6 text-orange-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">وقت الاستجابة</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.responseTime }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Active Service Requests -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm">
            <div class="p-6 border-b">
              <h2 class="text-xl font-semibold text-gray-900">طلبات الخدمة النشطة</h2>
              <p class="text-gray-600 text-sm mt-1">طلبات جديدة مطابقة لمهاراتك</p>
            </div>
            
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="request in serviceRequests"
                  :key="request.id"
                  class="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <h3 class="font-semibold text-gray-900">{{ request.title }}</h3>
                        <span :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getPriorityBadge(request.priority)
                        ]">
                          {{ request.priority.toUpperCase() }}
                        </span>
                        <span :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getStatusBadge(request.status)
                        ]">
                          {{ request.status.toUpperCase() }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 mb-2">{{ request.description }}</p>
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span class="flex items-center">
                          <Icon name="material-symbols:person" class="w-4 h-4 mr-1" />
                          {{ request.client }}
                        </span>
                        <span class="flex items-center">
                          <Icon name="material-symbols:location-on" class="w-4 h-4 mr-1" />
                          {{ request.location }}
                        </span>
                        <span class="flex items-center">
                          <Icon name="material-symbols:schedule" class="w-4 h-4 mr-1" />
                          {{ request.postedTime }}
                        </span>
                      </div>
                    </div>
                    <div class="text-right ml-4">
                      <div class="text-lg font-semibold text-gray-900">{{ request.budget }}</div>
                      <div class="text-sm text-gray-500">{{ request.category }}</div>
                    </div>
                  </div>
                  
                  <div v-if="request.status === 'pending'" class="flex space-x-3">
                    <button
                      @click="acceptRequest(request.id)"
                      class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Icon name="material-symbols:check" class="w-4 h-4 mr-1" />
                      قبول
                    </button>
                    <button
                      @click="declineRequest(request.id)"
                      class="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Icon name="material-symbols:close" class="w-4 h-4 mr-1" />
                      رفض
                    </button>
                    <button class="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors text-sm">
                      <Icon name="material-symbols:info" class="w-4 h-4 mr-1" />
                      عرض التفاصيل
                    </button>
                  </div>
                  
                  <div v-else-if="request.status === 'accepted'" class="flex space-x-3">
                    <button class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Icon name="material-symbols:message" class="w-4 h-4 mr-1" />
                      تواصل مع العميل
                    </button>
                    <button class="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Icon name="material-symbols:schedule" class="w-4 h-4 mr-1" />
                      الجدول
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Recent Activity -->
          <div class="bg-white rounded-2xl shadow-sm">
            <div class="p-6 border-b">
                <h3 class="text-lg font-semibold text-gray-900">النشاط المؤخر</h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  class="flex items-start space-x-3"
                >
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon :name="getActivityIcon(activity.type)" class="w-4 h-4 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-xs text-gray-500">{{ activity.client }}</p>
                    <p class="text-xs text-gray-400">{{ activity.time }}</p>
                  </div>
                  <div v-if="activity.amount" class="text-sm font-semibold text-green-600">
                    {{ activity.amount }}
                  </div>
                  <div v-else-if="activity.rating" class="flex items-center">
                    <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current" />
                    <span class="text-sm text-gray-600 ml-1">{{ activity.rating }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-sm">
            <div class="p-6 border-b">
              <h3 class="text-lg font-semibold text-gray-900">الإجراءات السريعة</h3>
            </div>
            <div class="p-6 space-y-3">
              <NuxtLink 
                to="/provider/my-services"
                class="flex items-center w-full p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Icon name="material-symbols:add-circle" class="w-5 h-5 text-blue-600 mr-3" />
                <span class="text-sm font-medium text-gray-900">إضافة خدمة جديدة</span>
              </NuxtLink>
              
              <NuxtLink 
                to="/provider/profile"
                class="flex items-center w-full p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Icon name="material-symbols:edit" class="w-5 h-5 text-blue-600 mr-3" />
                <span class="text-sm font-medium text-gray-900">تحديث الملف الشخصي</span>
              </NuxtLink>
              
              <button class="flex items-center w-full p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Icon name="material-symbols:schedule" class="w-5 h-5 text-blue-600 mr-3" />
                <span class="text-sm font-medium text-gray-900">إدارة الجدول</span>
              </button>
              
              <button class="flex items-center w-full p-3 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Icon name="material-symbols:analytics" class="w-5 h-5 text-blue-600 mr-3" />
                <span class="text-sm font-medium text-gray-900">عرض التحليلات</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style> 