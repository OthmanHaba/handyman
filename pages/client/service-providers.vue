<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Page metadata
useHead({
  title: 'Service Providers | HandyIT.com',
  meta: [
    { name: 'description', content: 'Find the best service providers in your area. Browse by category and location to find skilled professionals for your home improvement needs.' }
  ]
})

// Search and filter state
const searchQuery = ref('')
const selectedLocation = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('')
const sortBy = ref('rating') // rating, price-low, price-high, newest
const showFiltersModal = ref(false)

// Temporary filter state for modal
const tempSelectedCategory = ref('')
const tempSelectedSubcategory = ref('')
const tempSelectedLocation = ref('')

// Categories from design system
const categories = [
  { id: 'assembly', name: 'Assembly', icon: 'material-symbols:construction' },
  { id: 'mounting', name: 'Mounting', icon: 'material-symbols:tv-gen' },
  { id: 'cleaning', name: 'Cleaning', icon: 'material-symbols:cleaning-services' },
  { id: 'home-repair', name: 'Home Repair', icon: 'material-symbols:home-repair-service' },
  { id: 'painting', name: 'Painting', icon: 'material-symbols:format-paint' },
  { id: 'moving', name: 'Moving', icon: 'material-symbols:local-shipping' },
  { id: 'outdoor', name: 'Outdoor', icon: 'material-symbols:yard' },
  { id: 'plumbing', name: 'Plumbing', icon: 'material-symbols:plumbing' },
  { id: 'electrical', name: 'Electrical', icon: 'material-symbols:electrical-services' },
  { id: 'carpentry', name: 'Carpentry', icon: 'material-symbols:carpenter' },
  { id: 'landscaping', name: 'Landscaping', icon: 'material-symbols:grass' }
]

// Subcategories
const subcategoriesData: Record<string, Array<{id: string, name: string}>> = {
  assembly: [
    { id: 'furniture', name: 'Furniture Assembly' },
    { id: 'wardrobe', name: 'Wardrobe & Dresser Assembly' },
    { id: 'table', name: 'Table & Chair Assembly' },
    { id: 'bed', name: 'Bed Assembly' },
    { id: 'disassemble', name: 'Disassemble Furniture' },
    { id: 'general', name: 'General Furniture' }
  ],
  cleaning: [
    { id: 'house', name: 'House Cleaning' },
    { id: 'office', name: 'Office Cleaning' },
    { id: 'deep', name: 'Deep Cleaning' },
    { id: 'window', name: 'Window Cleaning' },
    { id: 'carpet', name: 'Carpet Cleaning' }
  ],
  plumbing: [
    { id: 'repair', name: 'Plumbing Repair' },
    { id: 'installation', name: 'Installation' },
    { id: 'drain', name: 'Drain Cleaning' },
    { id: 'leak', name: 'Leak Detection' },
    { id: 'emergency', name: 'Emergency Service' }
  ],
  electrical: [
    { id: 'wiring', name: 'Electrical Wiring' },
    { id: 'fixtures', name: 'Light Fixtures' },
    { id: 'outlets', name: 'Outlets & Switches' },
    { id: 'panel', name: 'Panel Upgrades' }
  ],
  carpentry: [
    { id: 'custom', name: 'Custom Carpentry' },
    { id: 'repair', name: 'Wood Repair' },
    { id: 'installation', name: 'Installation' },
    { id: 'finishing', name: 'Finishing Work' }
  ],
  painting: [
    { id: 'interior', name: 'Interior Painting' },
    { id: 'exterior', name: 'Exterior Painting' },
    { id: 'commercial', name: 'Commercial Painting' },
    { id: 'decorative', name: 'Decorative Painting' }
  ]
}

// Mock service providers data
const allServiceProviders = ref([
  {
    id: 1,
    name: 'Courtney Henry',
    country: 'Nepal',
    city: 'Kathmandu',
    hourlyRate: 70,
    rating: 4.98,
    reviewCount: 247,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    tags: ['Assembly', 'Furniture'],
    categories: ['assembly', 'carpentry'],
    completedJobs: 156,
    responseTime: '2 hours',
    description: 'Expert in furniture assembly and custom carpentry work. 8+ years experience.',
    verified: true,
    topRated: true
  },
  {
    id: 2,
    name: 'Devon Lane',
    country: 'Vietnam',
    city: 'Ho Chi Minh City',
    hourlyRate: 40,
    rating: 4.99,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tags: ['Plumbing', 'Repair'],
    categories: ['plumbing', 'home-repair'],
    completedJobs: 203,
    responseTime: '1 hour',
    description: 'Professional plumber with expertise in repairs and installations.',
    verified: true,
    topRated: true
  },
  {
    id: 3,
    name: 'Arlene McCoy',
    country: 'Myanmar',
    city: 'Yangon',
    hourlyRate: 60,
    rating: 4.98,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    tags: ['Cleaning', 'Office'],
    categories: ['cleaning'],
    completedJobs: 89,
    responseTime: '3 hours',
    description: 'Specialized in office and commercial cleaning services.',
    verified: true,
    topRated: true
  },
  {
    id: 4,
    name: 'Jerome Bell',
    country: 'United States',
    city: 'New York',
    hourlyRate: 80,
    rating: 4.97,
    reviewCount: 324,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    tags: ['Electrical', 'Installation'],
    categories: ['electrical'],
    completedJobs: 278,
    responseTime: '1 hour',
    description: 'Licensed electrician with 12+ years experience in residential and commercial work.',
    verified: true,
    topRated: true
  },
  {
    id: 5,
    name: 'Esther Howard',
    country: 'Netherlands',
    city: 'Amsterdam',
    hourlyRate: 30,
    rating: 4.96,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    tags: ['Cleaning', 'House'],
    categories: ['cleaning'],
    completedJobs: 67,
    responseTime: '2 hours',
    description: 'Reliable house cleaning service with attention to detail.',
    verified: true,
    topRated: false
  },
  {
    id: 6,
    name: 'Robert Fox',
    country: 'Canada',
    city: 'Toronto',
    hourlyRate: 55,
    rating: 4.95,
    reviewCount: 167,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    tags: ['Plumbing', 'Repair'],
    categories: ['plumbing', 'home-repair'],
    completedJobs: 134,
    responseTime: '2 hours',
    description: 'Experienced plumber specializing in emergency repairs and installations.',
    verified: true,
    topRated: true
  },
  {
    id: 7,
    name: 'Darlene Robertson',
    country: 'Australia',
    city: 'Sydney',
    hourlyRate: 45,
    rating: 4.94,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    tags: ['Cleaning', 'Deep Clean'],
    categories: ['cleaning'],
    completedJobs: 56,
    responseTime: '4 hours',
    description: 'Professional deep cleaning and maintenance services.',
    verified: true,
    topRated: false
  },
  {
    id: 8,
    name: 'Wade Warren',
    country: 'United Kingdom',
    city: 'London',
    hourlyRate: 65,
    rating: 4.93,
    reviewCount: 145,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    tags: ['Moving', 'Assembly'],
    categories: ['moving', 'assembly'],
    completedJobs: 112,
    responseTime: '3 hours',
    description: 'Professional moving and furniture assembly services.',
    verified: true,
    topRated: true
  },
  {
    id: 9,
    name: 'Kristin Watson',
    country: 'Germany',
    city: 'Berlin',
    hourlyRate: 50,
    rating: 4.92,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    tags: ['Painting', 'Interior'],
    categories: ['painting'],
    completedJobs: 43,
    responseTime: '5 hours',
    description: 'Interior and exterior painting specialist with color consultation.',
    verified: true,
    topRated: false
  },
  {
    id: 10,
    name: 'Cody Fisher',
    country: 'France',
    city: 'Paris',
    hourlyRate: 75,
    rating: 4.91,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    tags: ['Carpentry', 'Custom'],
    categories: ['carpentry'],
    completedJobs: 167,
    responseTime: '2 hours',
    description: 'Master carpenter specializing in custom furniture and built-ins.',
    verified: true,
    topRated: true
  }
])

// Get current subcategories for modal
const tempCurrentSubcategories = computed(() => {
  return subcategoriesData[tempSelectedCategory.value] || []
})

// Watch temp category changes to reset temp subcategory
watch(tempSelectedCategory, () => {
  tempSelectedSubcategory.value = ''
})

// Filtered service providers based on search and filters
const filteredServiceProviders = computed(() => {
  let filtered = allServiceProviders.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(provider => 
      provider.name.toLowerCase().includes(query) ||
      provider.tags.some(tag => tag.toLowerCase().includes(query)) ||
      provider.description.toLowerCase().includes(query) ||
      provider.city.toLowerCase().includes(query) ||
      provider.country.toLowerCase().includes(query)
    )
  }

  // Location filter
  if (selectedLocation.value) {
    const location = selectedLocation.value.toLowerCase()
    filtered = filtered.filter(provider => 
      provider.city.toLowerCase().includes(location) ||
      provider.country.toLowerCase().includes(location)
    )
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(provider => 
      provider.categories.includes(selectedCategory.value)
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'price-low':
      filtered.sort((a, b) => a.hourlyRate - b.hourlyRate)
      break
    case 'price-high':
      filtered.sort((a, b) => b.hourlyRate - a.hourlyRate)
      break
    case 'newest':
      filtered.sort((a, b) => b.completedJobs - a.completedJobs)
      break
  }

  return filtered
})

// Modal functions
const openFiltersModal = () => {
  // Set temp values to current values
  tempSelectedCategory.value = selectedCategory.value
  tempSelectedSubcategory.value = selectedSubcategory.value
  tempSelectedLocation.value = selectedLocation.value
  showFiltersModal.value = true
}

const applyFilters = () => {
  // Apply temp values to actual filters
  selectedCategory.value = tempSelectedCategory.value
  selectedSubcategory.value = tempSelectedSubcategory.value
  selectedLocation.value = tempSelectedLocation.value
  showFiltersModal.value = false
}

const cancelFilters = () => {
  // Reset temp values
  tempSelectedCategory.value = selectedCategory.value
  tempSelectedSubcategory.value = selectedSubcategory.value
  tempSelectedLocation.value = selectedLocation.value
  showFiltersModal.value = false
}

const clearAllFilters = () => {
  // Clear all filters including temp ones
  searchQuery.value = ''
  selectedLocation.value = ''
  selectedCategory.value = ''
  selectedSubcategory.value = ''
  tempSelectedLocation.value = ''
  tempSelectedCategory.value = ''
  tempSelectedSubcategory.value = ''
  sortBy.value = 'rating'
  showFiltersModal.value = false
}

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (selectedLocation.value) count++
  if (selectedCategory.value) count++
  if (selectedSubcategory.value) count++
  return count
})

// Close modal on escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showFiltersModal.value) {
    cancelFilters()
  }
}

// Add event listener for escape key
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <GuestHeader />

    <!-- Page Header -->
    <section class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Service Providers</h1>
          <p class="text-lg text-gray-600 mb-8">Find the best service providers in your area. Browse by category and location to find skilled professionals for your home improvement needs.</p>
          
          <!-- Search and Filter Bar -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <!-- Search Input -->
              <div class="md:col-span-2">
                <div class="relative">
                  <Icon name="material-symbols:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search providers, skills, or location..."
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                </div>
              </div>
              
              <!-- Filters Button -->
              <div>
                <button
                  @click="openFiltersModal"
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  <Icon name="material-symbols:tune" class="w-5 h-5" />
                  <span>Filters</span>
                  <span v-if="activeFiltersCount > 0" class="bg-blue-600 text-white text-xs px-2 py-1 rounded-full ml-1">
                    {{ activeFiltersCount }}
                  </span>
                </button>
              </div>
              
              <!-- Sort By -->
              <div>
                <select
                  v-model="sortBy"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Most Jobs</option>
                </select>
              </div>
            </div>
            
            <!-- Active Filters Display -->
            <div v-if="activeFiltersCount > 0" class="flex flex-wrap gap-2 items-center">
              <span class="text-sm text-gray-600">Active filters:</span>
              <span v-if="selectedCategory" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {{ categories.find(c => c.id === selectedCategory)?.name }}
                <button @click="selectedCategory = ''" class="hover:bg-blue-200 rounded-full p-0.5">
                  <Icon name="material-symbols:close" class="w-3 h-3" />
                </button>
              </span>
              <span v-if="selectedLocation" class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {{ selectedLocation }}
                <button @click="selectedLocation = ''" class="hover:bg-blue-200 rounded-full p-0.5">
                  <Icon name="material-symbols:close" class="w-3 h-3" />
                </button>
              </span>
              <button
                @click="clearAllFilters"
                class="text-sm text-blue-600 hover:text-blue-700 transition-colors ml-2"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <!-- Results Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ filteredServiceProviders.length }} service providers found
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Showing professionals
              <span v-if="selectedCategory">in {{ categories.find(c => c.id === selectedCategory)?.name }}</span>
            </p>
          </div>
          
          <!-- View Toggle -->
          <div class="hidden md:flex items-center gap-2">
            <button class="p-2 text-gray-600 hover:text-gray-800 transition-colors">
              <Icon name="material-symbols:grid-view" class="w-5 h-5" />
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="material-symbols:list" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Service Providers Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <NuxtLink
            v-for="provider in filteredServiceProviders"
            :key="provider.id"
            :to="`/client/service-detail?id=${provider.id}&provider=${provider.id}`"
            class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group block"
          >
            <!-- Image Container -->
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="provider.image" 
                :alt="provider.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              >
              
              <!-- Badges -->
              <div class="absolute top-3 left-3 flex flex-col gap-2">
                <span v-if="provider.topRated" class="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  Top Rated
                </span>
                <span v-if="provider.verified" class="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                  Verified
                </span>
              </div>
              
              <!-- Tags -->
              <div class="absolute top-3 right-3 flex flex-wrap gap-1">
                <span 
                  v-for="tag in provider.tags.slice(0, 2)" 
                  :key="tag"
                  class="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="p-4">
              <!-- Header -->
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ provider.name }}</h3>
                  <p class="text-sm text-gray-500">{{ provider.city }}, {{ provider.country }}</p>
                </div>
                <div class="flex items-center gap-1">
                  <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="text-sm font-medium text-gray-900">{{ provider.rating.toFixed(2) }}</span>
                </div>
              </div>
              
              <!-- Description -->
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ provider.description }}</p>
              
              <!-- Stats -->
              <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{{ provider.completedJobs }} jobs completed</span>
                <span>{{ provider.reviewCount }} reviews</span>
              </div>
              
              <!-- Pricing and Response -->
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xl font-semibold text-gray-900">${{ provider.hourlyRate }}</span>
                  <span class="text-sm text-gray-600">/hour</span>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">Responds in</p>
                  <p class="text-sm font-medium text-gray-900">{{ provider.responseTime }}</p>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- No Results -->
        <div v-if="filteredServiceProviders.length === 0" class="text-center py-12">
          <Icon name="material-symbols:search-off" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No service providers found</h3>
          <p class="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
          <button
            @click="clearAllFilters"
            class="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>

        <!-- Load More Button -->
        <div v-if="filteredServiceProviders.length > 0" class="text-center mt-12">
          <button class="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Load more service providers
          </button>
        </div>
      </div>
    </section>

    <!-- Filters Modal -->
    <div 
      v-if="showFiltersModal" 
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="cancelFilters"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-300/80 bg-opacity-50 transition-opacity"/>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h3 class="text-xl font-semibold text-gray-900">Filters</h3>
            <button 
              @click="cancelFilters"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="material-symbols:close" class="w-6 h-6" />
            </button>
          </div>
          
          <!-- Modal Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-6">
              <!-- Location Filter -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-3">Location</label>
                <input
                  v-model="tempSelectedLocation"
                  type="text"
                  placeholder="Enter city or country"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
              </div>
              
              <!-- Category Filter -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-3">Category</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="category in categories"
                    :key="category.id"
                    @click="tempSelectedCategory = tempSelectedCategory === category.id ? '' : category.id"
                    :class="[
                      'flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200',
                      tempSelectedCategory === category.id
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    ]"
                  >
                    <Icon :name="category.icon" class="w-5 h-5" />
                    <span>{{ category.name }}</span>
                  </button>
                </div>
              </div>
              
              <!-- Subcategory Filter -->
              <div v-if="tempCurrentSubcategories.length > 0">
                <label class="block text-sm font-semibold text-gray-900 mb-3">Subcategory</label>
                <div class="grid grid-cols-1 gap-2">
                  <button
                    v-for="subcategory in tempCurrentSubcategories"
                    :key="subcategory.id"
                    @click="tempSelectedSubcategory = tempSelectedSubcategory === subcategory.id ? '' : subcategory.id"
                    :class="[
                      'flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200',
                      tempSelectedSubcategory === subcategory.id
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    ]"
                  >
                    <span>{{ subcategory.name }}</span>
                    <Icon 
                      v-if="tempSelectedSubcategory === subcategory.id"
                      name="material-symbols:check" 
                      class="w-4 h-4 text-blue-600" 
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              @click="clearAllFilters"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Clear all
            </button>
            <div class="flex items-center gap-3">
              <button
                @click="cancelFilters"
                class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="applyFilters"
                class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 