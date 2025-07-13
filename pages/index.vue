<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// بيانات جميع الفئات
const allCategories = [
  { id: 'assembly', name: 'تجميع', icon: 'material-symbols:construction' },
  { id: 'mounting', name: 'تركيب', icon: 'material-symbols:tv-gen' },
  { id: 'cleaning', name: 'تنظيف', icon: 'material-symbols:cleaning-services' },
  { id: 'home-repair', name: 'إصلاح المنزل', icon: 'material-symbols:home-repair-service' },
  { id: 'painting', name: 'دهان', icon: 'material-symbols:format-paint' },
  { id: 'moving', name: 'نقل', icon: 'material-symbols:local-shipping' },
  { id: 'outdoor', name: 'خارجي', icon: 'material-symbols:yard' },
  { id: 'rehab', name: 'إعادة تأهيل', icon: 'material-symbols:medical-services' },
  { id: 'plumbing', name: 'سباكة', icon: 'material-symbols:plumbing' },
  { id: 'electrical', name: 'كهرباء', icon: 'material-symbols:electrical-services' },
  { id: 'carpentry', name: 'نجارة', icon: 'material-symbols:carpenter' },
  { id: 'landscaping', name: 'تنسيق حدائق', icon: 'material-symbols:grass' }
]

// حالة عرض الفئات
const categoryStartIndex = ref(0)
const selectedCategory = ref('assembly')
const categoryCarouselRef = ref<HTMLElement>()

// وظيفة للتقدم في عرض الفئات
const advanceCategories = () => {
  categoryStartIndex.value = (categoryStartIndex.value + 1) % allCategories.length
}

// وظيفة للرجوع فئة واحدة
const previousCategories = () => {
  categoryStartIndex.value = categoryStartIndex.value <= 0 
    ? allCategories.length - 1 
    : categoryStartIndex.value - 1
}

// بيانات تجريبية للعمال
const handymen = ref([
  {
    id: 1,
    name: 'كورتني هنري',
    country: 'نيبال',
    hourlyRate: 70,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    tags: ['تدريس', 'إعادة تأهيل']
  },
  {
    id: 2,
    name: 'ديفون لين',
    country: 'فيتنام',
    hourlyRate: 40,
    rating: 4.99,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    tags: ['إصلاح']
  },
  {
    id: 3,
    name: 'آرلين ماكوي',
    country: 'ميانمار',
    hourlyRate: 60,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    tags: ['مكتب']
  },
  {
    id: 4,
    name: 'جيروم بيل',
    country: 'الولايات المتحدة',
    hourlyRate: 80,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    tags: ['تخطيط الفعاليات']
  },
  {
    id: 5,
    name: 'إستر هوارد',
    country: 'هولندا',
    hourlyRate: 30,
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    tags: ['إعادة تأهيل']
  },
  {
    id: 6,
    name: 'روبرت فوكس',
    country: 'كندا',
    hourlyRate: 55,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    tags: ['سباكة', 'إصلاح']
  },
  {
    id: 7,
    name: 'دارلين روبرتسون',
    country: 'أستراليا',
    hourlyRate: 45,
    rating: 4.97,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    tags: ['تنظيف']
  },
  {
    id: 8,
    name: 'وايد وارن',
    country: 'المملكة المتحدة',
    hourlyRate: 65,
    rating: 4.96,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    tags: ['نقل', 'تجميع']
  }
])

const selectedSubcategory = ref('table') // الافتراضي للطاولة في فئة التجميع
const displayLocalCurrency = ref(false)

// بيانات الفئات الفرعية
const subcategoriesData: Record<string, Array<{id: string, name: string}>> = {
  assembly: [
    { id: 'furniture', name: 'تجميع الأثاث' },
    { id: 'wardrobe', name: 'تجميع خزانة الملابس والأدراج' },
    { id: 'table', name: 'تجميع الطاولات والكراسي' },
    { id: 'bed', name: 'تجميع السرير' },
    { id: 'disassemble', name: 'تفكيك الأثاث' },
    { id: 'general', name: 'أثاث عام' }
  ],
  cleaning: [
    { id: 'house', name: 'تنظيف المنزل' },
    { id: 'office', name: 'تنظيف المكتب' },
    { id: 'deep', name: 'تنظيف عميق' },
    { id: 'window', name: 'تنظيف النوافذ' },
    { id: 'carpet', name: 'تنظيف السجاد' }
  ],
  plumbing: [
    { id: 'repair', name: 'إصلاح السباكة' },
    { id: 'installation', name: 'تركيب' },
    { id: 'drain', name: 'تنظيف المجاري' },
    { id: 'leak', name: 'كشف التسربات' },
    { id: 'emergency', name: 'خدمة طوارئ' }
  ],
  // إضافة المزيد من الفئات حسب الحاجة
}

// الحصول على الفئات الفرعية الحالية
const currentSubcategories = computed(() => {
  return subcategoriesData[selectedCategory.value] || []
})

// مراجع العرض
const carouselRef = ref<HTMLElement>()
const currentIndex = ref(0)
const scrollProgress = ref(0)

const handleCategoryChange = (categoryId: string) => {
  selectedCategory.value = categoryId
  // إعادة تعيين الفئة الفرعية عند تغيير الفئة
  selectedSubcategory.value = ''
  // تعيين الفئة الفرعية الافتراضية للتجميع
  if (categoryId === 'assembly') {
    selectedSubcategory.value = 'table'
  }
}

const handleSubcategoryChange = (subcategory: string) => {
  selectedSubcategory.value = subcategory
}

// التنقل في العرض
const scrollToIndex = (index: number) => {
  if (!carouselRef.value) return
  
  const cardWidth = 260 // عرض البطاقة التقريبي مع الفجوة
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
  const maxIndex = Math.max(0, handymen.value.length - 5) // عرض 5 بطاقات في وقت واحد على سطح المكتب
  if (currentIndex.value < maxIndex) {
    currentIndex.value++
    scrollToIndex(currentIndex.value)
  }
}

// تحديث التقدم بناءً على التمرير
const updateScrollProgress = () => {
  if (!carouselRef.value) return
  
  const scrollLeft = carouselRef.value.scrollLeft
  const scrollWidth = carouselRef.value.scrollWidth
  const clientWidth = carouselRef.value.clientWidth
  const maxScroll = scrollWidth - clientWidth
  
  if (maxScroll > 0) {
    scrollProgress.value = (scrollLeft / maxScroll) * 100
    // تحديث المؤشر الحالي بناءً على موضع التمرير
    currentIndex.value = Math.round(scrollLeft / 260)
  }
}

// خاصية محسوبة لحالات التعطيل
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
    <GuestHeader />
    <div class="py-4 sm:py-6 lg:py-8 border-t border-gray-100">
        <div class="max-w-4xl mx-auto px-4">
          <div class="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 transition-all duration-300 ease-in-out"
          :class="{'rounded-none': isMenuOpen, 'rounded-full': !isMenuOpen}"
          >
            <div class="hidden lg:flex">
              <div class="flex-1 px-6 py-3 border-r border-gray-200">
                <div class="cursor-pointer">
                  <div class="text-xs font-semibold text-gray-900 mb-1">موقعك</div>
                  <input 
                    v-model="searchLocation"
                    type="text" 
                    placeholder="أدخل عنوانك"
                    class="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none focus:text-gray-900"
                  >
                </div>
              </div>
              
              <div class="flex-1 px-6 py-3 border-r border-gray-200">
                <div class="cursor-pointer">
                  <div class="text-xs font-semibold text-gray-900 mb-1">التاريخ المطلوب</div>
                  <input 
                    v-model="startDate"
                    type="date" 
                    placeholder="اختر التاريخ"
                    class="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none focus:text-gray-900"
                  >
                </div>
              </div>
              
              <div class="flex-1 px-6 py-3">
                <div class="cursor-pointer">
                  <div class="text-xs font-semibold text-gray-900 mb-1">الفئة</div>
                  <select 
                    v-model="searchCategory"
                    class="w-full text-sm text-gray-600 bg-transparent border-none outline-none focus:text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" class="text-gray-400">اختر الخدمة</option>
                    <option value="plumbing">سباكة</option>
                    <option value="electrical">كهرباء</option>
                    <option value="carpentry">نجارة</option>
                    <option value="painting">دهان</option>
                    <option value="cleaning">تنظيف</option>
                    <option value="gardening">بستنة</option>
                    <option value="moving">نقل</option>
                    <option value="repair">إصلاح عام</option>
                  </select>
                </div>
              </div>
              
              <div class="flex items-center justify-center pr-2">
                <button class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg">
                  <Icon name="material-symbols:search"/>
                </button>
              </div>
            </div>

            <div class="lg:hidden">
              <div class="flex items-center justify-between p-4" @click="isMenuOpen = !isMenuOpen">
                <div class="flex-1">
                  <div class="text-sm font-semibold text-gray-900">هل تحتاج مساعدة في شيء ما؟</div>
                  <div class="text-xs text-gray-500 mt-1">
                    <span v-if="searchLocation">{{ searchLocation }}</span>
                    <span v-else>أي موقع</span>
                    <span class="mx-1">•</span>
                    <span v-if="startDate">
                      {{ new Date(startDate).toLocaleDateString() }}
                    </span>
                    <span v-else>أي تاريخ</span>
                    <span class="mx-1">•</span>
                    <span v-if="searchCategory">{{ searchCategory }}</span>
                    <span v-else>أي خدمة</span>
                  </div>
                </div>
                <div class="mr-4">
                  <div class="bg-gray-600 text-white p-3 rounded-full">
                    <Icon name="material-symbols:search" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div v-if="isMenuOpen" class="border-t border-gray-200 p-4 space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">موقعك</label>
                  <input 
                    v-model="searchLocation"
                    type="text" 
                    placeholder="أدخل عنوانك"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">التاريخ المطلوب</label>
                  <input 
                    v-model="startDate"
                    type="date" 
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-900 mb-2">الفئة</label>
                  <select 
                    v-model="searchCategory"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">اختر الخدمة</option>
                    <option value="plumbing">سباكة</option>
                    <option value="electrical">كهرباء</option>
                    <option value="carpentry">نجارة</option>
                    <option value="painting">دهان</option>
                    <option value="cleaning">تنظيف</option>
                    <option value="gardening">بستنة</option>
                    <option value="moving">نقل</option>
                    <option value="repair">إصلاح عام</option>
                  </select>
                </div>
                
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg transition-colors duration-200 font-semibold flex items-center justify-center">
                  <Icon name="material-symbols:search" class="w-5 h-5 ml-2" />
                  ابحث عن عامل صيانة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    <GuestPromoSection />
    
    <section class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6 w-full">
          <div class="flex items-center gap-3 relative overflow-hidden w-full">
            <button 
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0 z-10"
              @click="previousCategories"
            >
              <Icon name="material-symbols:chevron-right" class="w-6 h-6 text-gray-600" />
            </button>
            
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
            
            <button 
              @click="advanceCategories"
              class="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex-shrink-0 z-10"
            >
              <Icon name="material-symbols:chevron-left" class="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
        
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
        
        <div class="flex items-center justify-between">
          <div class="flex-1 ml-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="`width: ${scrollProgress}%`"></div>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button :class="[
              'p-2 rounded-full transition-colors',
              isPreviousDisabled
                ? 'bg-gray-100 cursor-not-allowed'
                : 'hover:bg-gray-100'
            ]" @click="handlePrevious" :disabled="isPreviousDisabled">
              <Icon name="material-symbols:arrow-forward" :class="[
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
              <Icon name="material-symbols:arrow-back" :class="[
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
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
