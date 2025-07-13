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
  phone?: string
  address?: string
  bio?: string
  experience?: string
  certifications?: string[]
  portfolio?: string[]
} | null>(null)

// Check authentication status
onMounted(() => {
  const loggedIn = localStorage.getItem('isLoggedIn')
  const userType = localStorage.getItem('userType')
  const userData = localStorage.getItem('user')
  
  if (loggedIn === 'true' && userType === 'provider' && userData) {
    isLoggedIn.value = true
    // Extend user data with profile information
    user.value = {
      ...JSON.parse(userData),
      phone: '+1 (555) 987-6543',
      address: '456 Service St, Brooklyn, NY 11201',
      bio: 'Professional handyman with over 10 years of experience in residential and commercial repairs. Specialized in plumbing, electrical work, and carpentry.',
      experience: '10+ years',
      certifications: ['Licensed Plumber', 'Certified Electrician', 'OSHA Safety Certified'],
      portfolio: [
        'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop'
      ]
    }
  } else {
    // Redirect to login if not authenticated as provider
    navigateTo('/client/auth/login')
  }
})

// Form states
const isEditing = ref(false)
const isSaving = ref(false)
const activeTab = ref('profile')

// Editable form data
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  businessName: '',
  bio: '',
  experience: '',
  avatar: '',
  skills: [] as string[],
  certifications: [] as string[]
})

// Available skills
const availableSkills = ref([
  'السباكة', 'الكهرباء', 'النجارة', 'الطلاء', 'التنظيف', 'التركيب',
  'النقل', 'تنسيق الحدائق', 'الإصلاحات', 'التركيب', 'الصيانة',
  'تركيب البلاط', 'الجبس', 'الأرضيات', 'السقف', 'التكييف', 'إصلاح الأجهزة',
  'أعمال الخرسانة', 'البناء', 'اللحام', 'تركيب الأثاث', 'الأمن المنزلي'
])

// Initialize form data when user is loaded
const initializeForm = () => {
  if (user.value) {
    editForm.value = {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone || '',
      address: user.value.address || '',
      businessName: user.value.businessName,
      bio: user.value.bio || '',
      experience: user.value.experience || '',
      avatar: user.value.avatar,
      skills: [...user.value.skills],
      certifications: [...(user.value.certifications || [])]
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
      user.value.businessName = editForm.value.businessName
      user.value.bio = editForm.value.bio
      user.value.experience = editForm.value.experience
      user.value.avatar = editForm.value.avatar
      user.value.skills = [...editForm.value.skills]
      user.value.certifications = [...editForm.value.certifications]
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
    }
    
    isEditing.value = false
    
    // Show success message
    alert('Profile updated successfully!')
    
  } catch {
    alert('Error updating profile. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// Skill management
const addSkill = (skill: string) => {
  if (!editForm.value.skills.includes(skill)) {
    editForm.value.skills.push(skill)
  }
}

const removeSkill = (skill: string) => {
  editForm.value.skills = editForm.value.skills.filter(s => s !== skill)
}

// Certification management
const addCertification = () => {
  const cert = prompt('Enter certification name:')
  if (cert && !editForm.value.certifications.includes(cert)) {
    editForm.value.certifications.push(cert)
  }
}

const removeCertification = (cert: string) => {
  editForm.value.certifications = editForm.value.certifications.filter(c => c !== cert)
}

// Reviews data
const reviews = ref([
  {
    id: 1,
    client: 'سارة ويلسون',
    rating: 5,
    date: '2024-01-15',
    comment: 'عمل ممتاز! قام مايك بإصلاح صنبور المطبخ بسرعة واحترافية. راضية جداً عن الخدمة.',
    service: 'إصلاح صنبور المطبخ'
  },
  {
    id: 2,
    client: 'جون ديفيس',
    rating: 4,
    date: '2024-01-10',
    comment: 'عمل عالي الجودة في بلاط الحمام. نظيف وفعال. سأتعامل معه مرة أخرى.',
    service: 'تركيب بلاط الحمام'
  },
  {
    id: 3,
    client: 'مايك براون',
    rating: 5,
    date: '2024-01-05',
    comment: 'عمل كهربائي احترافي وفعال. تم تركيب المنافذ بالضبط كما هو مطلوب. أوصي به بشدة!',
    service: 'تركيب منافذ كهربائية'
  },
  {
    id: 4,
    client: 'ليزا جونسون',
    rating: 5,
    date: '2024-01-01',
    comment: 'مهارات نجارة مذهلة. الرفوف المخصصة تبدو مثالية وتناسب بالضبط ما كنت أحتاجه.',
    service: 'نجارة مخصصة'
  },
  {
    id: 5,
    client: 'إيما ديفيس',
    rating: 4,
    date: '2023-12-28',
    comment: 'عمل طلاء جيد. تم الانتهاء في الوقت المحدد والتنظيف بشكل جيد. خدمة احترافية.',
    service: 'طلاء داخلي'
  }
])

// Computed properties
const userInitials = computed(() => {
  if (!user.value) return ''
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

const ratingDistribution = computed(() => {
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.value.forEach(review => {
    distribution[review.rating]++
  })
  return distribution
})

// Tab management
const tabs = [
  { id: 'profile', name: 'معلومات الملف الشخصي', icon: 'material-symbols:person' },
  { id: 'portfolio', name: 'معرض الأعمال', icon: 'material-symbols:photo-library' },
  { id: 'reviews', name: 'التقييمات', icon: 'material-symbols:star' },
  { id: 'settings', name: 'الإعدادات', icon: 'material-symbols:settings' }
]

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
    <header class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center ml-3">
              <Icon name="material-symbols:handyman" class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-2xl font-medium text-gray-900">HandyIT<span class="text-gray-500">.com</span></h1>
          </div>
          
          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <button
              @click="handleLogout"
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Icon name="material-symbols:logout" class="w-6 h-6" />
              <span class="sr-only">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-5xl mx-auto">
        <!-- Profile Header -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div class="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            <!-- Profile Image -->
            <div class="absolute -bottom-12 right-8">
              <div v-if="user?.avatar" class="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                <img :src="user.avatar" :alt="user?.name" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-24 h-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center">
                <span class="text-2xl font-semibold text-blue-600">{{ userInitials }}</span>
              </div>
            </div>
          </div>
          
          <div class="p-8 pt-16">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ user?.name }}</h1>
                <p class="text-gray-600">{{ user?.businessName }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <div class="flex items-center text-yellow-400">
                    <Icon name="material-symbols:star" class="w-5 h-5" />
                    <span class="text-gray-900 font-medium mr-1">{{ user?.rating }}</span>
                  </div>
                  <span class="text-gray-600">({{ user?.completedJobs }} مهمة مكتملة)</span>
                </div>
              </div>
              
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                تعديل الملف الشخصي
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div class="border-b border-gray-200">
            <nav class="flex">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                <Icon :name="tab.icon" class="w-5 h-5" />
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Profile Info Tab -->
          <div v-if="activeTab === 'profile'" class="p-8">
            <div v-if="!isEditing">
              <!-- View Mode -->
              <div class="space-y-8">
                <!-- Basic Info -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
                  <dl class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <dt class="text-sm font-medium text-gray-500">البريد الإلكتروني</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ user?.email }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">رقم الهاتف</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ user?.phone }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">العنوان</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ user?.address }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">سنوات الخبرة</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ user?.experience }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- Bio -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">نبذة عني</h3>
                  <p class="text-sm text-gray-600">{{ user?.bio }}</p>
                </div>

                <!-- Skills -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">المهارات</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="skill in user?.skills"
                      :key="skill"
                      class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>

                <!-- Certifications -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">الشهادات</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="cert in user?.certifications"
                      :key="cert"
                      class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {{ cert }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form v-else @submit.prevent="saveProfile" class="space-y-8">
              <!-- Edit Mode -->
              <div class="space-y-8">
                <!-- Basic Info -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                      <input
                        v-model="editForm.name"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">اسم العمل</label>
                      <input
                        v-model="editForm.businessName"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                      <input
                        v-model="editForm.email"
                        type="email"
                        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                      <input
                        v-model="editForm.phone"
                        type="tel"
                        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                      <input
                        v-model="editForm.address"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">سنوات الخبرة</label>
                      <input
                        v-model="editForm.experience"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                    </div>
                  </div>
                </div>

                <!-- Bio -->
                <div>
                  <label class="block text-lg font-semibold text-gray-900 mb-4">نبذة عني</label>
                  <textarea
                    v-model="editForm.bio"
                    rows="4"
                    class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  ></textarea>
                </div>

                <!-- Skills -->
                <div>
                  <label class="block text-lg font-semibold text-gray-900 mb-4">المهارات</label>
                  <div class="mb-4">
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="skill in editForm.skills"
                        :key="skill"
                        class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {{ skill }}
                        <button
                          type="button"
                          @click="removeSkill(skill)"
                          class="mr-2 text-blue-600 hover:text-blue-800"
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
                      :disabled="editForm.skills.includes(skill)"
                      :class="[
                        'px-3 py-1 text-sm rounded-full border transition-colors',
                        editForm.skills.includes(skill)
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      ]"
                    >
                      {{ skill }}
                    </button>
                  </div>
                </div>

                <!-- Certifications -->
                <div>
                  <label class="block text-lg font-semibold text-gray-900 mb-4">الشهادات</label>
                  <div class="mb-4">
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="cert in editForm.certifications"
                        :key="cert"
                        class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {{ cert }}
                        <button
                          type="button"
                          @click="removeCertification(cert)"
                          class="mr-2 text-green-600 hover:text-green-800"
                        >
                          <Icon name="material-symbols:close" class="w-3 h-3" />
                        </button>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="addCertification"
                    class="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Icon name="material-symbols:add" class="w-4 h-4 ml-2" />
                    إضافة شهادة
                  </button>
                </div>

                <!-- Form Actions -->
                <div class="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    @click="cancelEditing"
                    class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    :disabled="isSaving"
                    class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon 
                      v-if="isSaving" 
                      name="material-symbols:progress-activity" 
                      class="animate-spin -mr-1 ml-2 h-4 w-4" 
                    />
                    {{ isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Portfolio Tab -->
          <div v-if="activeTab === 'portfolio'" class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(image, index) in user?.portfolio"
                :key="index"
                class="relative aspect-[4/3] rounded-xl overflow-hidden group"
              >
                <img :src="image" :alt="`صورة المشروع ${index + 1}`" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <button class="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-900">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="p-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Rating Summary -->
              <div class="lg:col-span-1">
                <div class="bg-gray-50 rounded-xl p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">ملخص التقييمات</h3>
                  
                  <!-- Average Rating -->
                  <div class="text-center mb-6">
                    <div class="text-4xl font-bold text-gray-900">{{ averageRating }}</div>
                    <div class="flex items-center justify-center gap-1 text-yellow-400 my-2">
                      <Icon 
                        v-for="i in 5" 
                        :key="i"
                        name="material-symbols:star" 
                        class="w-5 h-5" 
                      />
                    </div>
                    <div class="text-sm text-gray-600">من {{ reviews.length }} تقييم</div>
                  </div>
                  
                  <!-- Rating Distribution -->
                  <div class="space-y-2">
                    <div 
                      v-for="n in 5"
                      :key="n"
                      class="flex items-center gap-2"
                    >
                      <div class="text-sm text-gray-600 w-8">{{ n }}</div>
                      <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-yellow-400 rounded-full"
                          :style="`width: ${(ratingDistribution[n] / reviews.length) * 100}%`"
                        ></div>
                      </div>
                      <div class="text-sm text-gray-600 w-8">{{ ratingDistribution[n] }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reviews List -->
              <div class="lg:col-span-2">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">التقييمات</h3>
                
                <div class="space-y-6">
                  <div
                    v-for="review in reviews"
                    :key="review.id"
                    class="bg-gray-50 rounded-xl p-6"
                  >
                    <div class="flex items-start justify-between mb-4">
                      <div>
                        <h4 class="font-medium text-gray-900">{{ review.client }}</h4>
                        <p class="text-sm text-gray-600">{{ review.service }}</p>
                      </div>
                      <div class="flex items-center gap-1 text-yellow-400">
                        <Icon 
                          v-for="i in review.rating" 
                          :key="i"
                          name="material-symbols:star" 
                          class="w-4 h-4" 
                        />
                      </div>
                    </div>
                    <p class="text-gray-600 text-sm">{{ review.comment }}</p>
                    <div class="mt-4 text-sm text-gray-500">{{ review.date }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'" class="p-8">
            <div class="max-w-2xl">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">إعدادات الحساب</h3>
              
              <!-- Notification Settings -->
              <div class="space-y-6">
                <div>
                  <h4 class="text-base font-medium text-gray-900 mb-4">إعدادات الإشعارات</h4>
                  <div class="space-y-4">
                    <label class="flex items-start">
                      <input type="checkbox" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                      <span class="mr-3">
                        <span class="block text-sm font-medium text-gray-900">إشعارات الطلبات الجديدة</span>
                        <span class="block text-sm text-gray-500">تلقي إشعارات عندما يقوم العملاء بإرسال طلبات جديدة</span>
                      </span>
                    </label>
                    
                    <label class="flex items-start">
                      <input type="checkbox" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                      <span class="mr-3">
                        <span class="block text-sm font-medium text-gray-900">إشعارات الرسائل</span>
                        <span class="block text-sm text-gray-500">تلقي إشعارات عندما يرسل العملاء رسائل جديدة</span>
                      </span>
                    </label>
                    
                    <label class="flex items-start">
                      <input type="checkbox" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                      <span class="mr-3">
                        <span class="block text-sm font-medium text-gray-900">إشعارات التقييمات</span>
                        <span class="block text-sm text-gray-500">تلقي إشعارات عندما يقوم العملاء بتقييم خدماتك</span>
                      </span>
                    </label>
                  </div>
                </div>
                
                <!-- Privacy Settings -->
                <div>
                  <h4 class="text-base font-medium text-gray-900 mb-4">إعدادات الخصوصية</h4>
                  <div class="space-y-4">
                    <label class="flex items-start">
                      <input type="checkbox" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                      <span class="mr-3">
                        <span class="block text-sm font-medium text-gray-900">عرض معلومات الاتصال</span>
                        <span class="block text-sm text-gray-500">السماح للعملاء برؤية معلومات الاتصال الخاصة بك</span>
                      </span>
                    </label>
                    
                    <label class="flex items-start">
                      <input type="checkbox" class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                      <span class="mr-3">
                        <span class="block text-sm font-medium text-gray-900">عرض التقييمات</span>
                        <span class="block text-sm text-gray-500">السماح بعرض التقييمات على ملفك الشخصي</span>
                      </span>
                    </label>
                  </div>
                </div>
                
                <!-- Account Actions -->
                <div>
                  <h4 class="text-base font-medium text-gray-900 mb-4">إجراءات الحساب</h4>
                  <div class="space-y-4">
                    <button class="text-sm text-red-600 hover:text-red-700 transition-colors">
                      تعطيل الحساب مؤقتاً
                    </button>
                    <button class="text-sm text-red-600 hover:text-red-700 transition-colors">
                      حذف الحساب
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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