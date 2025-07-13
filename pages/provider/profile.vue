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
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Assembly',
  'Moving', 'Landscaping', 'Repairs', 'Installation', 'Maintenance',
  'Tile Work', 'Drywall', 'Flooring', 'Roofing', 'HVAC', 'Appliance Repair',
  'Concrete Work', 'Masonry', 'Welding', 'Furniture Assembly', 'Home Security'
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
    client: 'Sarah Wilson',
    rating: 5,
    date: '2024-01-15',
    comment: 'Excellent work! Mike fixed my kitchen faucet quickly and professionally. Very satisfied with the service.',
    service: 'Kitchen Faucet Repair'
  },
  {
    id: 2,
    client: 'John Davis',
    rating: 4,
    date: '2024-01-10',
    comment: 'Great quality work on the bathroom tiles. Clean and efficient. Would hire again.',
    service: 'Bathroom Tile Installation'
  },
  {
    id: 3,
    client: 'Mike Brown',
    rating: 5,
    date: '2024-01-05',
    comment: 'Professional and efficient electrical work. Installed outlets exactly as requested. Highly recommend!',
    service: 'Electrical Outlet Installation'
  },
  {
    id: 4,
    client: 'Lisa Johnson',
    rating: 5,
    date: '2024-01-01',
    comment: 'Amazing carpentry skills. The custom shelving looks perfect and fits exactly what I needed.',
    service: 'Custom Carpentry'
  },
  {
    id: 5,
    client: 'Emma Davis',
    rating: 4,
    date: '2023-12-28',
    comment: 'Good painting work. Completed on time and cleaned up nicely. Professional service.',
    service: 'Interior Painting'
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
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.value.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++
  })
  return distribution
})

// Tab management
const tabs = [
  { id: 'profile', name: 'Profile Info', icon: 'material-symbols:person' },
  { id: 'portfolio', name: 'Portfolio', icon: 'material-symbols:photo-library' },
  { id: 'reviews', name: 'Reviews', icon: 'material-symbols:star' },
  { id: 'settings', name: 'Settings', icon: 'material-symbols:settings' }
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
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/provider/dashboard" class="text-gray-600 hover:text-gray-900">
              <Icon name="material-symbols:arrow-back" class="w-6 h-6" />
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
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
              <p class="text-gray-600 text-sm">{{ user?.businessName }}</p>
              <p class="text-gray-500 text-xs mt-1">{{ user?.experience }} experience</p>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ user?.completedJobs }}</div>
                <div class="text-xs text-gray-500">Jobs Completed</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ user?.rating }}</div>
                <div class="text-xs text-gray-500">Average Rating</div>
              </div>
            </div>
            
            <!-- Skills -->
            <div class="mt-6 pt-6 border-t">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Skills</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in user?.skills"
                  :key="skill"
                  class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {{ skill }}
                </span>
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
          <!-- Profile Info Tab -->
          <div v-if="activeTab === 'profile'" class="bg-white rounded-2xl shadow-sm">
            <div class="p-6 border-b">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Profile Information</h3>
                <button
                  v-if="!isEditing"
                  @click="startEditing"
                  class="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Icon name="material-symbols:edit" class="w-4 h-4 mr-2" />
                  Edit
                </button>
              </div>
            </div>

            <div class="p-6">
              <form v-if="isEditing" @submit.prevent="saveProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                    <input
                      v-model="editForm.name"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    >
                  </div>

                  <!-- Business Name -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Business Name</label>
                    <input
                      v-model="editForm.businessName"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    >
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                    <input
                      v-model="editForm.email"
                      type="email"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    >
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                    <input
                      v-model="editForm.phone"
                      type="tel"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                  </div>

                  <!-- Experience -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Years of Experience</label>
                    <input
                      v-model="editForm.experience"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="e.g., 10+ years"
                    >
                  </div>
                </div>

                <!-- Address -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Service Area</label>
                  <textarea
                    v-model="editForm.address"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Areas you provide services to..."
                  ></textarea>
                </div>

                <!-- Bio -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Professional Bio</label>
                  <textarea
                    v-model="editForm.bio"
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    placeholder="Tell clients about your experience and expertise..."
                  ></textarea>
                </div>

                <!-- Skills -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Skills & Expertise</label>
                  <div class="mb-3">
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
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Certifications</label>
                  <div class="mb-3">
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
                          class="ml-2 text-green-600 hover:text-green-800"
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
                    <Icon name="material-symbols:add" class="w-4 h-4 mr-2" />
                    Add Certification
                  </button>
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
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                  <button
                    type="button"
                    @click="cancelEditing"
                    class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <!-- Display Mode -->
              <div v-else class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                    <p class="text-gray-700">{{ user?.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Business Name</label>
                    <p class="text-gray-700">{{ user?.businessName }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                    <p class="text-gray-700">{{ user?.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                    <p class="text-gray-700">{{ user?.phone || 'Not provided' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Experience</label>
                    <p class="text-gray-700">{{ user?.experience || 'Not provided' }}</p>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Service Area</label>
                  <p class="text-gray-700">{{ user?.address || 'Not provided' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Professional Bio</label>
                  <p class="text-gray-700">{{ user?.bio || 'Not provided' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Certifications</label>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="cert in user?.certifications"
                      :key="cert"
                      class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {{ cert }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Portfolio Tab -->
          <div v-if="activeTab === 'portfolio'" class="bg-white rounded-2xl shadow-sm">
            <div class="p-6 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Portfolio</h3>
              <p class="text-gray-600 text-sm mt-1">Showcase your best work</p>
            </div>

            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="(image, index) in user?.portfolio"
                  :key="index"
                  class="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img 
                    :src="image" 
                    :alt="`Portfolio ${index + 1}`"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <Icon name="material-symbols:zoom-in" class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="bg-white rounded-2xl shadow-sm">
            <div class="p-6 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Customer Reviews</h3>
              <p class="text-gray-600 text-sm mt-1">What your clients say about your work</p>
            </div>

            <div class="p-6">
              <!-- Rating Summary -->
              <div class="mb-8 p-6 bg-gray-50 rounded-xl">
                <div class="flex items-center justify-between mb-4">
                  <div class="text-center">
                    <div class="text-4xl font-bold text-gray-900">{{ averageRating }}</div>
                    <div class="flex items-center justify-center mt-1">
                      <Icon
                        v-for="i in 5"
                        :key="i"
                        name="material-symbols:star"
                        :class="[
                          'w-5 h-5',
                          i <= Math.floor(parseFloat(averageRating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        ]"
                      />
                    </div>
                    <div class="text-sm text-gray-500 mt-1">{{ reviews.length }} reviews</div>
                  </div>
                  <div class="flex-1 max-w-xs ml-8">
                    <div
                      v-for="(count, rating) in ratingDistribution"
                      :key="rating"
                      class="flex items-center mb-2"
                    >
                      <span class="text-sm text-gray-600 w-6">{{ rating }}</span>
                      <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current mx-2" />
                      <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          class="bg-yellow-400 h-2 rounded-full"
                          :style="{ width: `${(count / reviews.length) * 100}%` }"
                        ></div>
                      </div>
                      <span class="text-sm text-gray-500 w-8">{{ count }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reviews List -->
              <div class="space-y-6">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="border border-gray-200 rounded-xl p-4"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span class="text-blue-600 font-medium text-sm">{{ review.client.charAt(0) }}</span>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-900">{{ review.client }}</h4>
                        <p class="text-sm text-gray-500">{{ review.date }}</p>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <Icon
                        v-for="i in 5"
                        :key="i"
                        name="material-symbols:star"
                        :class="[
                          'w-4 h-4',
                          i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        ]"
                      />
                    </div>
                  </div>
                  <p class="text-gray-700 mb-2">{{ review.comment }}</p>
                  <p class="text-sm text-blue-600 font-medium">{{ review.service }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'" class="bg-white rounded-2xl shadow-sm">
            <div class="p-6 border-b">
              <h3 class="text-lg font-semibold text-gray-900">Account Settings</h3>
              <p class="text-gray-600 text-sm mt-1">Manage your account preferences</p>
            </div>

            <div class="p-6 space-y-6">
              <!-- Change Password -->
              <div class="border border-gray-200 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">Password</h4>
                    <p class="text-sm text-gray-600">Last changed 3 months ago</p>
                  </div>
                  <button class="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>

              <!-- Notification Settings -->
              <div class="border border-gray-200 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">Notifications</h4>
                    <p class="text-sm text-gray-600">Manage your notification preferences</p>
                  </div>
                  <button class="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Manage
                  </button>
                </div>
              </div>

              <!-- Availability -->
              <div class="border border-gray-200 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">Availability</h4>
                    <p class="text-sm text-gray-600">Set your working hours and availability</p>
                  </div>
                  <button class="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Set Schedule
                  </button>
                </div>
              </div>

              <!-- Account Verification -->
              <div class="border border-green-200 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">Account Verification</h4>
                    <p class="text-sm text-gray-600">Verify your identity to build trust</p>
                  </div>
                  <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Verified
                  </span>
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