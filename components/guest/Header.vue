<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const isMenuOpen = ref(false)
const isLoginModalOpen = ref(false)

// Authentication state
const isLoggedIn = ref(false)
const user = ref<{
  id: number
  name: string
  email: string
  avatar: string
} | null>(null)

// Login form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// Form validation
const emailError = ref('')
const passwordError = ref('')

// Check authentication status on mount
onMounted(() => {
  checkAuthStatus()
})

// Check if user is authenticated
const checkAuthStatus = () => {
  const loggedIn = localStorage.getItem('isLoggedIn')
  const userType = localStorage.getItem('userType')
  const userData = localStorage.getItem('user')

  if (loggedIn === 'true' && userData) {
    isLoggedIn.value = true
    user.value = JSON.parse(userData)

    // Redirect providers away from client pages
    const route = useRoute()
    if (userType === 'provider' && route.path.startsWith('/client/')) {
      navigateTo('/provider/dashboard')
    }
  }
}

// Validate email
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = 'Email is required'
    return false
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return false
  } else {
    emailError.value = ''
    return true
  }
}

// Validate password
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Password is required'
    return false
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return false
  } else {
    passwordError.value = ''
    return true
  }
}

// Handle form submission
const handleLogin = async () => {
  // Validate form
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()

  if (!isEmailValid || !isPasswordValid) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock authentication - in real app, this would be an API call
    if (email.value === 'demo@handyit.com' && password.value === 'password') {
      // Store user session (in real app, use proper authentication)
      localStorage.setItem('isLoggedIn', 'true')
      const userData = {
        id: 1,
        name: 'John Doe',
        email: email.value,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      }
      localStorage.setItem('user', JSON.stringify(userData))

      // Update reactive state
      isLoggedIn.value = true
      user.value = userData

      // Close modal and reset form
      isLoginModalOpen.value = false
      resetForm()
    } else {
      errorMessage.value = 'Invalid email or password. Try demo@handyit.com / password'
    }
  } catch {
    errorMessage.value = 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userType')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  user.value = null

  // Redirect to home if on protected page
  const router = useRouter()
  const route = useRoute()
  if (route.path.startsWith('/client/') || route.path.startsWith('/provider/')) {
    router.push('/')
  }
}

// Reset form
const resetForm = () => {
  email.value = ''
  password.value = ''
  rememberMe.value = false
  errorMessage.value = ''
  emailError.value = ''
  passwordError.value = ''
  showPassword.value = false
}

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Open login modal
const openLoginModal = () => {
  isLoginModalOpen.value = true
  resetForm()
}

// Close login modal
const closeLoginModal = () => {
  isLoginModalOpen.value = false
  resetForm()
}

// Social login handlers
const handleGoogleLogin = () => {
  // Implement Google OAuth
  console.log('Google login')
}

const handleFacebookLogin = () => {
  // Implement Facebook OAuth
  console.log('Facebook login')
}

// Dynamic navigation links based on user type
const navigationLinks = computed(() => {
  const userType = localStorage.getItem('userType')

  if (userType === 'provider') {
    return [
      {
        name: 'Home',
        path: '/',
        active: false
      },
      {
        name: 'Dashboard',
        path: '/provider/dashboard',
        active: false
      },
      {
        name: 'My Services',
        path: '/provider/my-services',
        active: false
      },
      {
        name: 'My Profile',
        path: '/provider/profile',
        active: false
      }
    ]
  } else {
    return [
      {
        name: 'Home',
        path: '/',
        active: false
      },
      {
        name: 'Service providers',
        path: '/client/service-providers',
        active: false
      },
      {
        name: 'My Tasks',
        path: '/client/my-tasks',
        active: false
      },
      {
        name: 'My Profile',
        path: '/client/profile',
        active: false
      }
    ]
  }
})

// Check if link is active
const isLinkActive = (_path: string) => {
  return useRoute().path === _path
}

// User initials for avatar fallback
const userInitials = computed(() => {
  if (!user.value) return ''
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})
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
          <h1 class="text-xl font-medium text-gray-900">HandyIT</h1>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <NuxtLink v-for="link in navigationLinks" :key="link.path" :to="link.path" :class="[
            'transition-colors',
            isLinkActive(link.path) ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
          ]">
            {{ link.name }}
          </NuxtLink>
        </nav>

        <!-- Right side items -->
        <div class="flex items-center space-x-4">
          <button class="hidden md:flex items-center text-gray-700 hover:text-gray-900">
            EN
            <Icon name="material-symbols:language" class="w-5 h-5 ml-1" />
          </button>

          <!-- Authentication Section -->
          <div v-if="isLoggedIn && user" class="hidden md:flex items-center space-x-3">
            <!-- User Info -->
            <div class="flex items-center space-x-2">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
              <div class="relative">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-full object-cover">
                <div v-else class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">{{ userInitials }}</span>
                </div>
              </div>
            </div>

            <!-- Logout Button -->
            <button @click="handleLogout"
              class="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors">
              <Icon name="material-symbols:logout" class="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>

          <!-- Login Button (when not authenticated) -->
          <NuxtLink
            v-else
            to="/client/auth/login"
            class="hidden md:inline-flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            @click="openLoginModal">
            Login
            <div class="ml-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon name="material-symbols:person" class="w-5 h-5 text-white" />
            </div>
          </NuxtLink>

          <!-- Mobile menu button -->
          <button @click="isMenuOpen = !isMenuOpen" class="lg:hidden p-2 rounded-md text-gray-700">
            <Icon name="material-symbols:menu" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Search Bar Section -->
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="lg:hidden fixed inset-0 z-50 bg-white">
      <div class="p-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold">Menu</h2>
          <button @click="isMenuOpen = false">
            <Icon name="material-symbols:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- User info in mobile menu -->
        <div v-if="isLoggedIn && user" class="mb-6 p-4 bg-gray-50 rounded-xl">
          <div class="flex items-center space-x-3">
            <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-12 h-12 rounded-full object-cover">
            <div v-else class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white font-medium">{{ userInitials }}</span>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ user.name }}</p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </div>
        </div>

        <nav class="space-y-4">
          <NuxtLink v-for="link in navigationLinks" :key="link.path" :to="link.path" :class="[
            'block py-2 transition-colors',
            isLinkActive(link.path) ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
          ]" @click="isMenuOpen = false">
            {{ link.name }}
          </NuxtLink>
          <hr class="my-4">

          <!-- Mobile auth actions -->
          <button v-if="isLoggedIn" @click="handleLogout(); isMenuOpen = false"
            class="block w-full text-left py-2 text-red-600 font-medium">
            <Icon name="material-symbols:logout" class="w-4 h-4 mr-2 inline" />
            Logout
          </button>
          <button v-else @click="openLoginModal(); isMenuOpen = false"
            class="block w-full text-left py-2 text-blue-600 font-medium">
            Login
          </button>
        </nav>
      </div>
    </div>

    <!-- Login Modal -->
    <div v-if="isLoginModalOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeLoginModal">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal content -->
        <div
          class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div class="bg-white px-6 pt-6 pb-4">
            <!-- Modal Header -->
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <Icon name="material-symbols:handyman" class="w-5 h-5 text-white" />
                </div>
                <h3 class="text-lg font-medium text-gray-900">Sign in to HandyIT</h3>
              </div>
              <button @click="closeLoginModal" class="text-gray-400 hover:text-gray-600">
                <Icon name="material-symbols:close" class="w-6 h-6" />
              </button>
            </div>

            <!-- Demo Credentials -->
            <div class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 class="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h4>
              <p class="text-sm text-blue-700">
                <strong>Email:</strong> demo@handyit.com<br>
                <strong>Password:</strong> password
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="space-y-6">
              <!-- Email Field -->
              <div>
                <label for="modal-email" class="block text-sm font-semibold text-gray-900 mb-2">
                  Email address
                </label>
                <div class="relative">
                  <input id="modal-email" v-model="email" type="email" autocomplete="email" :class="[
                    'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                    emailError ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  ]" placeholder="Enter your email" @blur="validateEmail" @input="emailError = ''">
                  <Icon name="material-symbols:email"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
              </div>

              <!-- Password Field -->
              <div>
                <label for="modal-password" class="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div class="relative">
                  <input id="modal-password" v-model="password" :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password" :class="[
                      'w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                      passwordError ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    ]" placeholder="Enter your password" @blur="validatePassword" @input="passwordError = ''">
                  <button type="button" @click="togglePasswordVisibility"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Icon :name="showPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'"
                      class="w-5 h-5" />
                  </button>
                </div>
                <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input id="modal-remember-me" v-model="rememberMe" type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="modal-remember-me" class="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div class="text-sm">
                  <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <!-- Login Button -->
              <div>
                <button type="submit" :disabled="isLoading"
                  class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <Icon v-if="isLoading" name="material-symbols:progress-activity"
                    class="animate-spin -ml-1 mr-2 h-4 w-4" />
                  {{ isLoading ? 'Signing in...' : 'Sign in' }}
                </button>
              </div>
            </form>

            <!-- Social Login -->
            <div class="mt-6">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-300" />
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div class="mt-6 grid grid-cols-2 gap-3">
                <button @click="handleGoogleLogin"
                  class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Icon name="material-symbols:google" class="w-5 h-5 mr-2" />
                  Google
                </button>

                <button @click="handleFacebookLogin"
                  class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Icon name="material-symbols:facebook" class="w-5 h-5 mr-2" />
                  Facebook
                </button>
              </div>
            </div>

            <!-- Register Link -->
            <div class="mt-6 text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?
                <NuxtLink to="/client/auth/register"
                  class="font-medium text-blue-600 hover:text-blue-500 transition-colors" @click="closeLoginModal">
                  Sign up
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
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
