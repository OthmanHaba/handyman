<script setup lang="ts">
interface HandymanProps {
  name: string
  country: string
  hourlyRate: number
  rating: number
  image: string
  tags: string[]
  currency?: string
}

const props = defineProps<HandymanProps>()
</script>

<template>
  <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
    <!-- Image Container -->
    <div class="relative h-64 overflow-hidden">
      <img 
        :src="props.image" 
        :alt="props.name"
        class="w-full h-full object-cover"
      >
      <!-- Tags -->
      <div class="absolute top-4 left-4 flex flex-wrap gap-2">
        <span 
          v-for="tag in props.tags" 
          :key="tag"
          class="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-5">
      <!-- Name and Rating -->
      <div class="flex items-start justify-between mb-1">
        <h3 class="text-lg font-semibold text-gray-900">{{ props.name }}</h3>
        <div class="flex items-center">
          <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current" />
          <span class="ml-1 text-sm font-medium text-gray-900">{{ props.rating.toFixed(2) }}</span>
        </div>
      </div>
      
      <!-- Country -->
      <p class="text-gray-500 text-sm mb-3">{{ props.country }}</p>
      
      <!-- Pricing -->
      <div class="flex items-baseline">
        <span class="text-xl font-semibold text-gray-900">{{ props.currency || '$' }}{{ props.hourlyRate }}</span>
        <span class="ml-1 text-gray-600 text-sm">hour</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style> 