<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)
const searchLocation = ref('')
const startDate = ref('')
const endDate = ref('')
const searchCategory = ref('')
</script>

<template>
  <header class="w-full bg-white shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <div class="flex items-center">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
            <Icon name="material-symbols:handyman" class="w-5 h-5 text-white" />
          </div>
          <h1 class="text-xl font-medium text-gray-900">Sarwisi<span class="text-gray-500">.com</span></h1>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <NuxtLink to="/tasks" class="text-gray-700 hover:text-blue-600 transition-colors">
            Tasks
          </NuxtLink>
          <NuxtLink to="/projects" class="text-gray-700 hover:text-blue-600 transition-colors">
            Projects
          </NuxtLink>
          <NuxtLink to="/quick-errands" class="text-blue-600 font-medium">
            Quick Errands
          </NuxtLink>
          <NuxtLink to="/marketplace" class="text-gray-700 hover:text-blue-600 transition-colors">
            Marketplace
          </NuxtLink>
        </nav>

        <!-- Right side items -->
        <div class="flex items-center space-x-4">
          <button class="hidden md:flex items-center text-gray-700 hover:text-gray-900">
            EN
            <Icon name="material-symbols:language" class="w-5 h-5 ml-1" />
          </button>
          <NuxtLink 
            to="/client/auth/login" 
            class="hidden md:inline-flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            Login
            <div class="ml-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon name="material-symbols:person" class="w-5 h-5 text-white" />
            </div>
          </NuxtLink>
          
          <!-- Mobile menu button -->
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="lg:hidden p-2 rounded-md text-gray-700"
          >
            <Icon name="material-symbols:menu" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Search Bar Section -->
      <div class="py-4 border-t border-gray-100">
        <div class="flex flex-col lg:flex-row gap-4 items-center">
          <!-- Location Input -->
          <div class="flex-1 w-full">
            <label class="block text-sm text-gray-600 mb-1">Location</label>
            <input 
              v-model="searchLocation"
              type="text" 
              placeholder="Enter your address"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
          </div>
          
          <!-- Start Date -->
          <div class="flex-1 w-full">
            <label class="block text-sm text-gray-600 mb-1">Start time</label>
            <input 
              v-model="startDate"
              type="text" 
              placeholder="Add dates"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
          </div>
          
          <!-- End Date -->
          <div class="flex-1 w-full">
            <label class="block text-sm text-gray-600 mb-1">End time</label>
            <input 
              v-model="endDate"
              type="text" 
              placeholder="Add dates"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
          </div>
          
          <!-- Category -->
          <div class="flex-1 w-full">
            <label class="block text-sm text-gray-600 mb-1">Find help today</label>
            <input 
              v-model="searchCategory"
              type="text" 
              placeholder="Select category"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
          </div>
          
          <!-- Search Button -->
          <button class="w-full lg:w-auto px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium flex items-center justify-center mt-6 lg:mt-0">
            Find help now
            <Icon name="material-symbols:search" class="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-if="isMenuOpen" 
      class="lg:hidden fixed inset-0 z-50 bg-white"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold">Menu</h2>
          <button @click="isMenuOpen = false">
            <Icon name="material-symbols:close" class="w-6 h-6" />
          </button>
        </div>
        <nav class="space-y-4">
          <NuxtLink 
            to="/tasks" 
            class="block py-2 text-gray-700 hover:text-blue-600"
            @click="isMenuOpen = false"
          >
            Tasks
          </NuxtLink>
          <NuxtLink 
            to="/projects" 
            class="block py-2 text-gray-700 hover:text-blue-600"
            @click="isMenuOpen = false"
          >
            Projects
          </NuxtLink>
          <NuxtLink 
            to="/quick-errands" 
            class="block py-2 text-gray-700 hover:text-blue-600"
            @click="isMenuOpen = false"
          >
            Quick Errands
          </NuxtLink>
          <NuxtLink 
            to="/marketplace" 
            class="block py-2 text-gray-700 hover:text-blue-600"
            @click="isMenuOpen = false"
          >
            Marketplace
          </NuxtLink>
          <hr class="my-4">
          <NuxtLink 
            to="/client/auth/login" 
            class="block py-2 text-blue-600 font-medium"
            @click="isMenuOpen = false"
          >
            Login
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
