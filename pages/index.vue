<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

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

const selectedCategory = ref('assembly')
const selectedSubcategory = ref('')
const displayLocalCurrency = ref(false)

// Carousel refs
const carouselRef = ref<HTMLElement>()
const currentIndex = ref(0)
const scrollProgress = ref(0)

const handleCategoryChange = (category: string) => {
  selectedCategory.value = category
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

onUnmounted(() => {
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('scroll', updateScrollProgress)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <GuestHeader />

    <!-- Promotional Section -->
    <GuestPromoSection />

    <!-- Main Content -->
    <section class="container mx-auto px-4 py-8">
      <!-- Category Navigation with Currency Toggle -->
      <div class="mb-8">
        <!-- Category Icons -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex gap-4 overflow-x-auto scrollbar-hide">
            <button v-for="category in [
              { id: 'assembly', name: 'Assembly', icon: 'material-symbols:construction', active: true },
              { id: 'mounting', name: 'Mounting', icon: 'material-symbols:tv-gen' },
              { id: 'cleaning', name: 'Cleaning', icon: 'material-symbols:cleaning-services' },
              { id: 'home-repair', name: 'Home Repair', icon: 'material-symbols:home-repair-service' },
              { id: 'painting', name: 'Painting', icon: 'material-symbols:format-paint' },
              { id: 'moving', name: 'Moving', icon: 'material-symbols:local-shipping' },
              { id: 'outdoor', name: 'Outdoor', icon: 'material-symbols:yard' },
              { id: 'rehab', name: 'Rehab', icon: 'material-symbols:medical-services' }
            ]" :key="category.id" :class="[
                'flex flex-col items-center min-w-[80px] p-2 rounded-lg transition-all',
                category.active ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'
              ]" @click="handleCategoryChange(category.id)">
              <div :class="[
                'w-16 h-16 rounded-full flex items-center justify-center mb-2',
                category.active ? 'bg-blue-600' : 'bg-gray-100'
              ]">
                <Icon :name="category.icon" :class="[
                  'w-8 h-8',
                  category.active ? 'text-white' : 'text-gray-600'
                ]" />
              </div>
              <span class="text-xs font-medium">{{ category.name }}</span>
            </button>
          </div>

          <!-- List View Toggle -->
          <button class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Icon name="material-symbols:view-list" class="w-5 h-5 text-gray-600" />
          </button>

          <!-- Currency Toggle -->
          <div class="hidden lg:flex items-center ml-4">
            <span class="mr-3 text-sm text-gray-700">Display sarwisi currency</span>
            <button @click="displayLocalCurrency = !displayLocalCurrency" :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              displayLocalCurrency ? 'bg-blue-600' : 'bg-gray-300'
            ]">
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                displayLocalCurrency ? 'translate-x-6' : 'translate-x-1'
              ]" />
            </button>
          </div>
        </div>

        <!-- Sub Categories -->
        <div class="flex gap-3 overflow-x-auto scrollbar-hide">
          <button v-for="subCategory in [
            { id: 'furniture', name: 'Furniture Assembly' },
            { id: 'wardrobe', name: 'Wardrobe & Dresser Assembly' },
            { id: 'table', name: 'Table & Chair Assembly', active: true },
            { id: 'bed', name: 'Bed Assembly' },
            { id: 'disassemble', name: 'Disassemble Furniture' },
            { id: 'general', name: 'General Furniture' }
          ]" :key="subCategory.id" @click="handleSubcategoryChange(subCategory.id)" :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              subCategory.active
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-600 hover:text-blue-600'
            ]">
            {{ subCategory.name }}
          </button>
        </div>
      </div>

      <!-- Handymen Carousel -->
      <div class="relative">
        <div ref="carouselRef" class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth mb-6"
          style="scroll-snap-type: x mandatory;">
          <div v-for="handyman in handymen" :key="handyman.id" class="flex-none w-[250px] scroll-snap-start">
            <GuestHandymanCard :name="handyman.name" :country="handyman.country" :hourly-rate="handyman.hourlyRate"
              :rating="handyman.rating" :image="handyman.image" :tags="handyman.tags"
              :currency="displayLocalCurrency ? '€' : '$'" />
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
