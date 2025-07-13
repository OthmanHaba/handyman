<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// All categories data
const allCategories = [
  { id: 'assembly', name: 'Assembly', icon: 'material-symbols:construction' },
  { id: 'mounting', name: 'Mounting', icon: 'material-symbols:tv-gen' },
  { id: 'cleaning', name: 'Cleaning', icon: 'material-symbols:cleaning-services' },
  { id: 'home-repair', name: 'Home Repair', icon: 'material-symbols:home-repair-service' },
  { id: 'painting', name: 'Painting', icon: 'material-symbols:format-paint' },
  { id: 'moving', name: 'Moving', icon: 'material-symbols:local-shipping' },
  { id: 'outdoor', name: 'Outdoor', icon: 'material-symbols:yard' },
  { id: 'rehab', name: 'Rehab', icon: 'material-symbols:medical-services' },
  { id: 'plumbing', name: 'Plumbing', icon: 'material-symbols:plumbing' },
  { id: 'electrical', name: 'Electrical', icon: 'material-symbols:electrical-services' },
  { id: 'carpentry', name: 'Carpentry', icon: 'material-symbols:carpenter' },
  { id: 'landscaping', name: 'Landscaping', icon: 'material-symbols:grass' }
]

// Category carousel state
const categoryStartIndex = ref(0)
const selectedCategory = ref('assembly')
const categoryCarouselRef = ref<HTMLElement>()



// Function to advance category carousel by one item
const advanceCategories = () => {
  categoryStartIndex.value = (categoryStartIndex.value + 1) % allCategories.length
}

// Function to go back one category
const previousCategories = () => {
  categoryStartIndex.value = categoryStartIndex.value <= 0 
    ? allCategories.length - 1 
    : categoryStartIndex.value - 1
}

// Mock data for handymen
const handymen = ref([
  {
    id: 1,
    name: 'Courtney Henry',
    country: 'Nepal',
    hourlyRate: 70,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    tags: ['Tutoring', 'Rehab']
  },
  {
    id: 2,
    name: 'Devon Lane',
    country: 'Vietnam',
    hourlyRate: 40,
    rating: 4.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tags: ['Repair']
  },
  {
    id: 3,
    name: 'Arlene McCoy',
    country: 'Myanmar',
    hourlyRate: 60,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    tags: ['Office']
  },
  {
    id: 4,
    name: 'Jerome Bell',
    country: 'United States',
    hourlyRate: 80,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    tags: ['Event planning']
  },
  {
    id: 5,
    name: 'Esther Howard',
    country: 'Netherlands',
    hourlyRate: 30,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    tags: ['Rehab']
  },
  {
    id: 6,
    name: 'Robert Fox',
    country: 'Canada',
    hourlyRate: 55,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    tags: ['Plumbing', 'Repair']
  },
  {
    id: 7,
    name: 'Darlene Robertson',
    country: 'Australia',
    hourlyRate: 45,
    rating: 4.97,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    tags: ['Cleaning']
  },
  {
    id: 8,
    name: 'Wade Warren',
    country: 'United Kingdom',
    hourlyRate: 65,
    rating: 4.96,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    tags: ['Moving', 'Assembly']
  }
])

const selectedSubcategory = ref('table') // Default to table for assembly category
const displayLocalCurrency = ref(false)

// Subcategories data
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
  // Add more categories as needed
}

// Get current subcategories
const currentSubcategories = computed(() => {
  return subcategoriesData[selectedCategory.value] || []
})

// Carousel refs
const carouselRef = ref<HTMLElement>()
const currentIndex = ref(0)
const scrollProgress = ref(0)

const handleCategoryChange = (categoryId: string) => {
  selectedCategory.value = categoryId
  // Reset subcategory when changing category
  selectedSubcategory.value = ''
  // Set default subcategory for assembly
  if (categoryId === 'assembly') {
    selectedSubcategory.value = 'table'
  }
}

const handleSubcategoryChange = (subcategory: string) => {
  selectedSubcategory.value = subcategory
}

// Carousel navigation
const scrollToIndex = (index: number) => {
  if (!carouselRef.value) return
  
  const cardWidth = 260 // Approximate card width including gap
  const scrollPosition = index * cardWidth
  
  carouselRef.value.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  })
}

const handlePrevious = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    scrollToIndex(currentIndex.value)
  }
}

const handleNext = () => {
  const maxIndex = Math.max(0, handymen.value.length - 5) // Show 5 cards at a time on desktop
  if (currentIndex.value < maxIndex) {
    currentIndex.value++
    scrollToIndex(currentIndex.value)
  }
}

// Update progress based on scroll
const updateScrollProgress = () => {
  if (!carouselRef.value) return
  
  const scrollLeft = carouselRef.value.scrollLeft
  const scrollWidth = carouselRef.value.scrollWidth
  const clientWidth = carouselRef.value.clientWidth
  const maxScroll = scrollWidth - clientWidth
  
  if (maxScroll > 0) {
    scrollProgress.value = (scrollLeft / maxScroll) * 100
    // Update current index based on scroll position
    currentIndex.value = Math.round(scrollLeft / 260)
  }
}

// Computed property for disable states
const isPreviousDisabled = computed(() => currentIndex.value === 0)
const isNextDisabled = computed(() => {
  const maxIndex = Math.max(0, handymen.value.length - 5)
  return currentIndex.value >= maxIndex
})

onMounted(() => {
  if (carouselRef.value) {
    carouselRef.value.addEventListener('scroll', updateScrollProgress)
  }
})
const searchLocation = ref('')
const startDate = ref('')
const searchCategory = ref('')

onUnmounted(() => {
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('scroll', updateScrollProgress)
  }
})
const isMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <GuestHeader />
    <div class="py-4 sm:py-6 lg:py-8 border-t border-gray-100">
        <div class="max-w-4xl mx-auto px-4">
          <!-- Main Search Bar -->
          <div class="bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <!-- Desktop Layout -->
            <div class="hidden lg:flex">
              <!-- Your Location -->
              <div class="flex-1 px-6 py-3 border-r border-gray-200">
                <div class="cursor-pointer">
                  <div class="text-xs font-semibold text-gray-900 mb-1">Your location</div>
                  <input 
                    v-model="searchLocation"
                    type="text" 
                    placeholder="Enter your address"
                    class="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none focus:text-gray-900"
                  >
                </div>
              </div>
              
              <!-- Date Requested -->
              <div class="flex-1 px-6 py-3 border-r border-gray-200">
                <div class="cursor-pointer">
                  <div class="text-xs font-semibold text-gray-900 mb-1">Date requested</div>
                  <input 
                    v-model="startDate"
                    type="date" 
                    placeholder="Select date"
                    class="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none focus:text-gray-900"
                  >
                </div>
              </div>
              
              <!-- Category -->
              <div class="flex-1 px-6 py-3">
                <div class="cursor-pointer">
                  <div class="text-xs font-semibold text-gray-900 mb-1">Category</div>
                  <select 
                    v-model="searchCategory"
                    class="w-full text-sm text-gray-600 bg-transparent border-none outline-none focus:text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" class="text-gray-400">Select service</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="gardening">Gardening</option>
                    <option value="moving">Moving</option>
                    <option value="repair">General Repair</option>
                  </select>
                </div>
              </div>
              
              <!-- Search Button -->
              <div class="flex items-center justify-center pr-2 ">
                <button class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg">
                  <Icon name="material-symbols:search"/>
                </button>
              </div>
            </div>

            <!-- Mobile/Tablet Layout -->
            <div class="lg:hidden">
              <!-- Collapsed Search Bar -->
              <div class="flex items-center justify-between p-4" @click="isMenuOpen = !isMenuOpen">
                <div class="flex-1">
                  <div class="text-sm font-semibold text-gray-900">Need help with something?</div>
                  <div class="text-xs text-gray-500 mt-1">
                    <span v-if="searchLocation">{{ searchLocation }}</span>
                    <span v-else>Any location</span>
                    <span class="mx-1">•</span>
                    <span v-if="startDate">
                      {{ new Date(startDate).toLocaleDateString() }}
                    </span>
                    <span v-else>Any date</span>
                    <span class="mx-1">•</span>
                    <span v-if="searchCategory">{{ searchCategory }}</span>
                    <span v-else>Any service</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="bg-gray-600 text-white p-3  rounded-full">
                    <Icon name="material-symbols:search" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Expanded Mobile Search -->
              <div v-if="isMenuOpen" class="border-t border-gray-200 p-4 space-y-4">
                <!-- Your Location -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Your location</label>
                  <input 
                    v-model="searchLocation"
                    type="text" 
                    placeholder="Enter your address"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                </div>
                
                <!-- Date Requested -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Date requested</label>
                  <input 
                    v-model="startDate"
                    type="date" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                </div>
                
                <!-- Category -->
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                  <select 
                    v-model="searchCategory"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select service</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="gardening">Gardening</option>
                    <option value="moving">Moving</option>
                    <option value="repair">General Repair</option>
                  </select>
                </div>
                
                <!-- Search Button -->
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg transition-colors duration-200 font-semibold flex items-center justify-center">
                  <Icon name="material-symbols:search" class="w-5 h-5 mr-2" />
                  Find Handyman
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Promo Section -->
    <GuestPromoSection />
    
    <!-- Main Content -->
    <section class="container mx-auto px-4 py-8">
      <!-- Category Navigation with Currency Toggle -->
      <div class="mb-8">
        <!-- Category Icons -->
        <div class="flex items-center justify-between mb-6 w-full">
          <div class="flex items-center gap-3 relative overflow-hidden w-full">
            <!-- Previous button -->
            <button 
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0 z-10"
              @click="previousCategories"
            >
              <Icon name="material-symbols:chevron-left" class="w-6 h-6 text-gray-600" />
            </button>
            
            <!-- Category buttons container -->
            <div class="relative overflow-hidden" style="width: 720px;">
              <div 
                ref="categoryCarouselRef"
                class="flex gap-3 transition-transform duration-300 ease-in-out"
                :style="`transform: translateX(-${categoryStartIndex * 90}px)`"
              >
                <button 
                  v-for="category in allCategories" 
                  :key="category.id" 
                  :class="[
                    'flex flex-col items-center min-w-[80px] p-2 rounded-lg transition-all flex-shrink-0',
                    selectedCategory === category.id ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
                  ]" 
                  @click="handleCategoryChange(category.id)"
                >
                  <div :class="[
                    'w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors',
                    selectedCategory === category.id ? 'bg-blue-600' : 'bg-gray-100'
                  ]">
                    <Icon 
                      :name="category.icon" 
                      :class="[
                        'w-8 h-8',
                        selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                      ]" 
                    />
                  </div>
                  <span class="text-xs font-medium">{{ category.name }}</span>
                </button>
              </div>
            </div>
            
            <!-- Next button with arrow -->
            <button 
              @click="advanceCategories"
              class="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex-shrink-0 z-10"
            >
              <Icon name="material-symbols:chevron-right" class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
        
        <!-- Sub Categories -->
        <div class="flex gap-3 overflow-x-auto scrollbar-hide">
          <button 
            v-for="subCategory in currentSubcategories" 
            :key="subCategory.id" 
            @click="handleSubcategoryChange(subCategory.id)" 
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              selectedSubcategory === subCategory.id || (subCategory.id === 'table' && !selectedSubcategory)
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600 hover:text-blue-600'
            ]"
          >
            {{ subCategory.name }}
          </button>
        </div>
      </div>
      
      <!-- Handymen Carousel -->
      <div class="relative">
        <div ref="carouselRef" class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth mb-6"
          style="scroll-snap-type: x mandatory;">
          <div v-for="handyman in handymen" :key="handyman.id" class="flex-none w-[250px] scroll-snap-start">
            <NuxtLink :to="`/client/service-detail?id=${handyman.id}&provider=${handyman.id}`">
              <GuestHandymanCard :name="handyman.name" :country="handyman.country" :hourly-rate="handyman.hourlyRate"
                :rating="handyman.rating" :image="handyman.image" :tags="handyman.tags"
                :currency="displayLocalCurrency ? '€' : '$'" />
            </NuxtLink>
          </div>
        </div>
        
        <!-- Carousel Progress and Navigation -->
        <div class="flex items-center justify-between">
          <!-- Progress Bar -->
          <div class="flex-1 mr-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="`width: ${scrollProgress}%`"></div>
            </div>
          </div>
          
          <!-- Navigation Buttons -->
          <div class="flex items-center gap-2">
            <button :class="[
              'p-2 rounded-full transition-colors',
              isPreviousDisabled
                ? 'bg-gray-100 cursor-not-allowed'
                : 'hover:bg-gray-100'
            ]" @click="handlePrevious" :disabled="isPreviousDisabled">
              <Icon name="material-symbols:arrow-back" :class="[
                'w-6 h-6',
                isPreviousDisabled ? 'text-gray-300' : 'text-gray-600'
              ]" />
            </button>
            <button @click="handleNext" :disabled="isNextDisabled" :class="[
              'p-2 rounded-full transition-colors',
              isNextDisabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            ]">
              <Icon name="material-symbols:arrow-forward" :class="[
                'w-6 h-6',
                isNextDisabled ? 'text-gray-400' : 'text-white'
              ]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
