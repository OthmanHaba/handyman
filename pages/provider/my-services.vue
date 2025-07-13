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

// Tab state
const activeTab = ref('services')

// Service form state
const isAddingService = ref(false)
const isEditingService = ref(false)
const editingServiceId = ref<number | null>(null)
const isSaving = ref(false)

// Service form data
const serviceForm = ref({
  title: '',
  category: '',
  description: '',
  basePrice: '',
  priceType: 'fixed' as 'fixed' | 'hourly',
  duration: '',
  location: 'client_location' as 'client_location' | 'my_location' | 'both',
  availability: 'weekdays' as 'weekdays' | 'weekends' | 'both',
  skills: [] as string[],
  images: [] as string[]
})

// Available categories
const categories = ref([
  'السباكة',
  'الكهرباء',
  'النجارة',
  'الطلاء',
  'التنظيف',
  'التركيب',
  'النقل',
  'تنسيق الحدائق',
  'الإصلاحات',
  'التركيب',
  'الصيانة',
  'أخرى'
])

// Available skills
const availableSkills = ref([
  'السباكة', 'الكهرباء', 'النجارة', 'الطلاء', 'التنظيف', 'التركيب',
  'النقل', 'تنسيق الحدائق', 'الإصلاحات', 'التركيب', 'الصيانة',
  'تركيب البلاط', 'الجبس', 'الأرضيات', 'السقف', 'التكييف', 'إصلاح الأجهزة'
])

// My services
const myServices = ref<Service[]>([
  {
    id: 1,
    title: 'إصلاح وتركيب صنبور المطبخ',
    category: 'السباكة',
    description: 'خدمات احترافية لإصلاح وتركيب صنبور المطبخ. يمكنني إصلاح التسريبات واستبدال الصنابير القديمة وتركيب الجديدة.',
    basePrice: 85,
    priceType: 'fixed',
    duration: '2-3 ساعات',
    location: 'client_location',
    availability: 'weekdays',
    skills: ['السباكة', 'التركيب'],
    images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300&h=200&fit=crop'],
    isActive: true,
    completedJobs: 23,
    rating: 4.9
  },
  {
    id: 2,
    title: 'تركيب المنافذ الكهربائية',
    category: 'الكهرباء',
    description: 'تركيب آمن واحترافي للمنافذ الكهربائية للمنازل والمكاتب. كهربائي مرخص مع خبرة أكثر من 10 سنوات.',
    basePrice: 45,
    priceType: 'hourly',
    duration: '1-2 ساعات',
    location: 'client_location',
    availability: 'both',
    skills: ['الكهرباء', 'التركيب'],
    images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop'],
    isActive: true,
    completedJobs: 18,
    rating: 4.8
  },
  {
    id: 3,
    title: 'نجارة وأعمال خشبية مخصصة',
    category: 'النجارة',
    description: 'خدمات نجارة مخصصة تشمل الرفوف والخزائن وإصلاح الأثاث. جودة الحرفية مضمونة.',
    basePrice: 60,
    priceType: 'hourly',
    duration: 'متغير',
    location: 'both',
    availability: 'weekdays',
    skills: ['النجارة', 'الأعمال الخشبية', 'التركيب'],
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=200&fit=crop'],
    isActive: true,
    completedJobs: 31,
    rating: 5.0
  },
  {
    id: 4,
    title: 'طلاء داخلي وخارجي',
    category: 'الطلاء',
    description: 'خدمات طلاء احترافية للعقارات السكنية والتجارية. دهانات وتشطيبات عالية الجودة.',
    basePrice: 300,
    priceType: 'fixed',
    duration: '1-3 أيام',
    location: 'client_location',
    availability: 'both',
    skills: ['الطلاء', 'تحضير الأسطح'],
    images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=200&fit=crop'],
    isActive: false,
    completedJobs: 15,
    rating: 4.7
  }
])

// Work history
const workHistory = ref([
  {
    id: 1,
    title: 'إصلاح صنبور المطبخ',
    client: 'سارة ويلسون',
    date: '2024-01-15',
    status: 'completed',
    amount: 85,
    rating: 5,
    review: 'عمل ممتاز! أصلح التسريب بسرعة واحترافية.',
    category: 'السباكة'
  },
  {
    id: 2,
    title: 'تركيب بلاط الحمام',
    client: 'جون ديفيس',
    date: '2024-01-10',
    status: 'completed',
    amount: 450,
    rating: 4,
    review: 'عمل عالي الجودة، راضٍ جداً عن النتائج.',
    category: 'تركيب البلاط'
  },
  {
    id: 3,
    title: 'تركيب منفذ كهربائي',
    client: 'مايك براون',
    date: '2024-01-05',
    status: 'completed',
    amount: 120,
    rating: 5,
    review: 'خدمة احترافية وفعالة. أوصي به بشدة!',
    category: 'الكهرباء'
  },
  {
    id: 4,
    title: 'إصلاح السياج',
    client: 'ليزا جونسون',
    date: '2024-01-20',
    status: 'in_progress',
    amount: 200,
    rating: null,
    review: null,
    category: 'النجارة'
  },
  {
    id: 5,
    title: 'تركيب خزائن',
    client: 'توم ويلسون',
    date: '2024-01-25',
    status: 'scheduled',
    amount: 380,
    rating: null,
    review: null,
    category: 'النجارة'
  }
])

// Computed properties
const activeServices = computed(() => {
  return myServices.value.filter(service => service.isActive)
})

const inactiveServices = computed(() => {
  return myServices.value.filter(service => !service.isActive)
})

// Service interface
interface Service {
  id: number
  title: string
  category: string
  description: string
  basePrice: number
  priceType: 'fixed' | 'hourly'
  duration: string
  location: 'client_location' | 'my_location' | 'both'
  availability: 'weekdays' | 'weekends' | 'both'
  skills: string[]
  images: string[]
  isActive: boolean
  completedJobs: number
  rating: number
}

// Form methods
const startAddingService = () => {
  isAddingService.value = true
  resetForm()
}

const startEditingService = (service: Service) => {
  isEditingService.value = true
  editingServiceId.value = service.id
  serviceForm.value = {
    title: service.title,
    category: service.category,
    description: service.description,
    basePrice: service.basePrice.toString(),
    priceType: service.priceType,
    duration: service.duration,
    location: service.location,
    availability: service.availability,
    skills: [...service.skills],
    images: [...service.images]
  }
}

const cancelForm = () => {
  isAddingService.value = false
  isEditingService.value = false
  editingServiceId.value = null
  resetForm()
}

const resetForm = () => {
  serviceForm.value = {
    title: '',
    category: '',
    description: '',
    basePrice: '',
    priceType: 'fixed',
    duration: '',
    location: 'client_location',
    availability: 'weekdays',
    skills: [],
    images: []
  }
}

const saveService = async () => {
  isSaving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEditingService.value && editingServiceId.value) {
      // Update existing service
      const serviceIndex = myServices.value.findIndex(s => s.id === editingServiceId.value)
      if (serviceIndex !== -1) {
        myServices.value[serviceIndex] = {
          ...myServices.value[serviceIndex],
          title: serviceForm.value.title,
          category: serviceForm.value.category,
          description: serviceForm.value.description,
          basePrice: parseInt(serviceForm.value.basePrice),
          priceType: serviceForm.value.priceType,
          duration: serviceForm.value.duration,
          location: serviceForm.value.location,
          availability: serviceForm.value.availability,
          skills: [...serviceForm.value.skills],
          images: [...serviceForm.value.images]
        }
      }
    } else {
      // Add new service
      const newService = {
        id: Date.now(),
        title: serviceForm.value.title,
        category: serviceForm.value.category,
        description: serviceForm.value.description,
        basePrice: parseInt(serviceForm.value.basePrice),
        priceType: serviceForm.value.priceType,
        duration: serviceForm.value.duration,
        location: serviceForm.value.location,
        availability: serviceForm.value.availability,
        skills: [...serviceForm.value.skills],
        images: [...serviceForm.value.images],
        isActive: true,
        completedJobs: 0,
        rating: 0
      }
      myServices.value.unshift(newService)
    }
    
    cancelForm()
    alert('Service saved successfully!')
    
  } catch {
    alert('Error saving service. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const toggleServiceStatus = (serviceId: number) => {
  const service = myServices.value.find(s => s.id === serviceId)
  if (service) {
    service.isActive = !service.isActive
  }
}

const deleteService = (serviceId: number) => {
  if (confirm('Are you sure you want to delete this service?')) {
    myServices.value = myServices.value.filter(s => s.id !== serviceId)
  }
}

// Skill management
const addSkill = (skill: string) => {
  if (!serviceForm.value.skills.includes(skill)) {
    serviceForm.value.skills.push(skill)
  }
}

const removeSkill = (skill: string) => {
  serviceForm.value.skills = serviceForm.value.skills.filter(s => s !== skill)
}

// Status badge styles
const getStatusBadge = (status: string) => {
  const badges = {
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    scheduled: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
}

// Format status text
const formatStatus = (status: string) => {
  return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
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
            <NuxtLink to="/provider/dashboard" class="text-gray-600 hover:text-gray-900">
              <Icon name="material-symbols:arrow-back" class="w-6 h-6" />
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">My Services</h1>
          </div>
          <button
            @click="handleLogout"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
          >
            <Icon name="material-symbols:logout" class="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Tab Navigation -->
      <div class="mb-8">
        <div class="flex space-x-8 border-b">
          <button
            @click="activeTab = 'services'"
            :class="[
              'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'services'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            My Services ({{ myServices.length }})
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Work History ({{ workHistory.length }})
          </button>
        </div>
      </div>

      <!-- Services Tab -->
      <div v-if="activeTab === 'services'">
        <!-- Add Service Button -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Your Services</h2>
            <p class="text-gray-600 text-sm">Manage your service offerings and pricing</p>
          </div>
          <button
            @click="startAddingService"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Icon name="material-symbols:add" class="w-5 h-5 mr-2" />
            Add New Service
          </button>
        </div>

        <!-- Service Form -->
        <div v-if="isAddingService || isEditingService" class="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ isEditingService ? 'Edit Service' : 'Add New Service' }}
            </h3>
            <button @click="cancelForm" class="text-gray-400 hover:text-gray-600">
              <Icon name="material-symbols:close" class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="saveService" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Title -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Service Title</label>
                <input
                  v-model="serviceForm.title"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="e.g., Kitchen Faucet Repair"
                  required
                >
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <select
                  v-model="serviceForm.category"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                >
                  <option value="">Select a category</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <textarea
                v-model="serviceForm.description"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="Describe your service in detail..."
                required
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Base Price -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Base Price ($)</label>
                <input
                  v-model="serviceForm.basePrice"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="0"
                  required
                >
              </div>

              <!-- Price Type -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Price Type</label>
                <select
                  v-model="serviceForm.priceType"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Per Hour</option>
                </select>
              </div>

              <!-- Duration -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Duration</label>
                <input
                  v-model="serviceForm.duration"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="e.g., 2-3 hours"
                  required
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Location -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Service Location</label>
                <select
                  v-model="serviceForm.location"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="client_location">Client's Location</option>
                  <option value="my_location">My Location</option>
                  <option value="both">Both Locations</option>
                </select>
              </div>

              <!-- Availability -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">Availability</label>
                <select
                  v-model="serviceForm.availability"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                >
                  <option value="weekdays">Weekdays Only</option>
                  <option value="weekends">Weekends Only</option>
                  <option value="both">Weekdays & Weekends</option>
                </select>
              </div>
            </div>

            <!-- Skills -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">Required Skills</label>
              <div class="mb-3">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in serviceForm.skills"
                    :key="skill"
                    class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {{ skill }}
                    <button
                      type="button"
                      @click="removeSkill(skill)"
                      class="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <Icon name="material-symbols:close" class="w-3 h-3" />
                    </button>
                  </span>
                </div>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="skill in availableSkills"
                  :key="skill"
                  type="button"
                  @click="addSkill(skill)"
                  :disabled="serviceForm.skills.includes(skill)"
                  :class="[
                    'px-3 py-1 text-sm rounded-full border transition-colors',
                    serviceForm.skills.includes(skill)
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ skill }}
                </button>
              </div>
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
                  class="animate-spin w-4 h-4 mr-2" 
                />
                {{ isSaving ? 'Saving...' : (isEditingService ? 'Update Service' : 'Add Service') }}
              </button>
              <button
                type="button"
                @click="cancelForm"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Active Services -->
        <div v-if="activeServices.length > 0" class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Active Services ({{ activeServices.length }})</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="service in activeServices"
              :key="service.id"
              class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div v-if="service.images.length > 0" class="h-48 overflow-hidden">
                <img 
                  :src="service.images[0]" 
                  :alt="service.title"
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="p-6">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-gray-900">{{ service.title }}</h4>
                  <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">{{ service.description }}</p>
                
                <div class="space-y-2 mb-4">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Price:</span>
                    <span class="font-medium text-gray-900">
                      ${{ service.basePrice }}{{ service.priceType === 'hourly' ? '/hour' : '' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Jobs:</span>
                    <span class="font-medium text-gray-900">{{ service.completedJobs }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-500">Rating:</span>
                    <div class="flex items-center">
                      <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current" />
                      <span class="font-medium text-gray-900 ml-1">{{ service.rating }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-1 mb-4">
                  <span
                    v-for="skill in service.skills"
                    :key="skill"
                    class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {{ skill }}
                  </span>
                </div>

                <div class="flex space-x-2">
                  <button
                    @click="startEditingService(service)"
                    class="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Icon name="material-symbols:edit" class="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    @click="toggleServiceStatus(service.id)"
                    class="flex items-center px-3 py-2 text-sm text-yellow-600 hover:text-yellow-700 transition-colors"
                  >
                    <Icon name="material-symbols:pause" class="w-4 h-4 mr-1" />
                    Pause
                  </button>
                  <button
                    @click="deleteService(service.id)"
                    class="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Icon name="material-symbols:delete" class="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inactive Services -->
        <div v-if="inactiveServices.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Inactive Services ({{ inactiveServices.length }})</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="service in inactiveServices"
              :key="service.id"
              class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow opacity-75"
            >
              <div v-if="service.images.length > 0" class="h-48 overflow-hidden">
                <img 
                  :src="service.images[0]" 
                  :alt="service.title"
                  class="w-full h-full object-cover grayscale"
                >
              </div>
              <div class="p-6">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-gray-900">{{ service.title }}</h4>
                  <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    Inactive
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">{{ service.description }}</p>
                
                <div class="flex space-x-2">
                  <button
                    @click="toggleServiceStatus(service.id)"
                    class="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Icon name="material-symbols:play-arrow" class="w-4 h-4 mr-1" />
                    Activate
                  </button>
                  <button
                    @click="startEditingService(service)"
                    class="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Icon name="material-symbols:edit" class="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    @click="deleteService(service.id)"
                    class="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Icon name="material-symbols:delete" class="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Work History Tab -->
      <div v-if="activeTab === 'history'">
        <div class="bg-white rounded-2xl shadow-sm">
          <div class="p-6 border-b">
            <h2 class="text-xl font-semibold text-gray-900">Work History</h2>
            <p class="text-gray-600 text-sm mt-1">Your completed and ongoing projects</p>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="job in workHistory"
                :key="job.id"
                class="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h3 class="font-semibold text-gray-900">{{ job.title }}</h3>
                      <span :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        getStatusBadge(job.status)
                      ]">
                        {{ formatStatus(job.status) }}
                      </span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span class="flex items-center">
                        <Icon name="material-symbols:person" class="w-4 h-4 mr-1" />
                        {{ job.client }}
                      </span>
                      <span class="flex items-center">
                        <Icon name="material-symbols:calendar-today" class="w-4 h-4 mr-1" />
                        {{ job.date }}
                      </span>
                      <span class="flex items-center">
                        <Icon name="material-symbols:category" class="w-4 h-4 mr-1" />
                        {{ job.category }}
                      </span>
                    </div>
                    <div v-if="job.review" class="text-sm text-gray-600 italic">
                      "{{ job.review }}"
                    </div>
                  </div>
                  <div class="text-right ml-4">
                    <div class="text-lg font-semibold text-gray-900">${{ job.amount }}</div>
                    <div v-if="job.rating" class="flex items-center mt-1">
                      <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current" />
                      <span class="text-sm text-gray-600 ml-1">{{ job.rating }}</span>
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