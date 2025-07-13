<script setup lang="ts">
const promoCards = [
  {
    id: 1,
    title: 'عالم من المواهب في متناول يديك.',
    subtitle: 'احصل على المساعدة الآن.',
    type: 'main',
    bgImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
    tags: ['خدمة', 'منصة مساعدة']
  },
  {
    id: 2,
    title: 'خدمات الصيانة',
    type: 'service',
    bgImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
    tag: 'أعمال خشبية'
  },
  {
    id: 3,
    title: 'أعمال مكتبية',
    subtitle: 'الكفاءة تبدأ هنا: ارتقِ بعملك المكتبي',
    type: 'service',
    bgImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=400&fit=crop',
    tag: 'إدارة'
  },
  {
    id: 4,
    title: 'الشحن والنقل',
    type: 'service',
    bgImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
    tag: 'شحن'
  }
]

const taskerProfiles = [
  { id: 1, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 2, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 3, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }
]
</script>

<template>
  <section class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- البطاقة الرئيسية -->
      <div class="lg:col-span-2 relative rounded-2xl overflow-hidden h-[300px] group">
        <img 
          :src="promoCards[0].bgImage" 
          :alt="promoCards[0].title"
          class="absolute inset-0 w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div class="relative h-full p-6 flex flex-col justify-end">
          <div class="flex gap-2 mb-3">
            <span 
              v-for="tag in promoCards[0].tags" 
              :key="tag"
              class="px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full text-xs text-white"
            >
              {{ tag }}
            </span>
          </div>
          <h2 class="text-3xl font-bold text-white mb-2 max-w-sm">
            {{ promoCards[0].title }}
          </h2>
          <p class="text-lg text-white mb-4">{{ promoCards[0].subtitle }}</p>
          <button class="self-start px-5 py-2.5 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            احصل على المساعدة الآن
          </button>
        </div>
      </div>
      
      <!-- بطاقة خدمات الصيانة -->
      <div class="relative rounded-2xl overflow-hidden h-[300px] group cursor-pointer">
        <img 
          :src="promoCards[1].bgImage" 
          :alt="promoCards[1].title"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="relative h-full p-6 flex flex-col justify-between">
          <span class="self-start px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full text-xs text-white">
            {{ promoCards[1].tag }}
          </span>
          <h3 class="text-xl font-bold text-white">{{ promoCards[1].title }}</h3>
        </div>
        <Icon 
          name="material-symbols:arrow-outward" 
          class="absolute top-4 right-4 w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <!-- العمود الأيمن مع البطاقات المكدسة -->
      <div class="flex flex-col gap-4">
        <!-- بطاقة العمل المكتبي -->
        <div class="relative rounded-2xl overflow-hidden h-[143px] group cursor-pointer">
          <img 
            :src="promoCards[2].bgImage" 
            :alt="promoCards[2].title"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="relative h-full p-4 flex flex-col justify-end">
            <span class="self-start px-2 py-0.5 bg-gray-800/50 backdrop-blur-sm rounded-full text-xs text-white mb-2">
              {{ promoCards[2].tag }}
            </span>
            <h3 class="text-lg font-bold text-white leading-tight">{{ promoCards[2].title }}</h3>
            <p class="text-xs text-white/80 mt-0.5 leading-tight">{{ promoCards[2].subtitle }}</p>
          </div>
          <Icon 
            name="material-symbols:arrow-outward" 
            class="absolute top-3 right-3 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <!-- بطاقة توظيف أفضل المنجزين -->
        <div class="bg-white rounded-2xl p-4 border border-gray-100 h-[143px] relative overflow-hidden">
          <div class="flex gap-1.5 mb-2">
            <span class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
              مريم
            </span>
            <span class="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
              أحمد
            </span>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            وظف أفضل المنجزين
          </h3>
          <p class="text-xs text-gray-600 mb-2">
            // وظف أفضل المنجزين<br>
            لاحتياجاتك.
          </p>
          
          <div class="flex -space-x-2">
            <img 
              v-for="profile in taskerProfiles"
              :key="profile.id"
              :src="profile.image" 
              alt="منجز"
              class="w-8 h-8 rounded-full border-2 border-white"
            >
            <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
              <span class="text-xs text-gray-600">...</span>
            </div>
          </div>

          <!-- عناصر تزيينية -->
          <span class="absolute top-3 right-3 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
            محمد
          </span>
          <span class="absolute bottom-3 right-3 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
            سارة
          </span>
        </div>
      </div>
    </div>
    
    <!-- الصف السفلي -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <!-- بطاقة الشحن -->
      <div class="relative rounded-2xl overflow-hidden h-[180px] group cursor-pointer">
        <img 
          :src="promoCards[3].bgImage" 
          :alt="promoCards[3].title"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="relative h-full p-6 flex flex-col justify-between">
          <span class="self-start px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full text-xs text-white">
            {{ promoCards[3].tag }}
          </span>
          <h3 class="text-xl font-bold text-white">{{ promoCards[3].title }}</h3>
        </div>
        <Icon 
          name="material-symbols:arrow-outward" 
          class="absolute top-4 right-4 w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
      
      <!-- بطاقة الانضمام كمنجز -->
      <div class="bg-blue-600 rounded-2xl p-6 flex flex-col justify-between h-[180px] relative overflow-hidden">
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-500 rounded-full opacity-50"></div>
        <div class="relative">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <Icon name="material-symbols:handshake" class="w-5 h-5 text-white" />
          </div>
          <h3 class="text-lg font-bold text-white mb-1">
            هل أنت مستعد لتحويل مهاراتك<br>إلى دخل؟
          </h3>
        </div>
        <button class="self-start px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
          انضم إلينا
        </button>
        <Icon 
          name="material-symbols:arrow-outward" 
          class="absolute top-4 right-4 w-5 h-5 text-white"
        />
      </div>
      
      <!-- مساحة فارغة للتخطيط -->
      <div class="hidden lg:block"></div>
    </div>
  </section>
</template>

<style scoped></style>