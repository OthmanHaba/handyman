<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'تسجيل الدخول | هاندلي',
  meta: [
    { name: 'description', content: 'سجل دخولك إلى حساب هاندلي لإدارة مهامك والتواصل مع مقدمي الخدمات.' }
  ]
})

const loginType = ref<'user' | 'provider'>('user')

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const emailError = ref('')
const passwordError = ref('')

const switchLoginType = (type: 'user' | 'provider') => {
  loginType.value = type
  email.value = ''
  password.value = ''
  errorMessage.value = ''
  emailError.value = ''
  passwordError.value = ''
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    emailError.value = 'البريد الإلكتروني مطلوب'
    return false
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'يرجى إدخال عنوان بريد إلكتروني صالح'
    return false
  } else {
    emailError.value = ''
    return true
  }
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'كلمة المرور مطلوبة'
    return false
  } else if (password.value.length < 6) {
    passwordError.value = 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'
    return false
  } else {
    passwordError.value = ''
    return true
  }
}

const handleLogin = async () => {
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  
  if (!isEmailValid || !isPasswordValid) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const isValidUserLogin = loginType.value === 'user' && email.value === 'demo@handyit.com' && password.value === 'password'
    const isValidProviderLogin = loginType.value === 'provider' && email.value === 'provider@handyit.com' && password.value === 'password'
    
    if (isValidUserLogin) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userType', 'user')
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'جون دو',
        email: email.value,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        type: 'user'
      }))
      
      const router = useRouter()
      const route = useRoute()
      const redirectTo = route.query.redirect as string || '/client/my-tasks'
      await router.push(redirectTo)
      
    } else if (isValidProviderLogin) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userType', 'provider')
      localStorage.setItem('user', JSON.stringify({
        id: 2,
        name: 'مايك جونسون',
        email: email.value,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        type: 'provider',
        businessName: 'خدمات مايك للصيانة',
        rating: 4.9,
        completedJobs: 156,
        skills: ['سباكة', 'كهرباء', 'نجارة', 'دهان']
      }))
      
      const router = useRouter()
      await router.push('/provider/dashboard')
      
    } else {
      const demoCredentials = loginType.value === 'user' 
        ? 'demo@handyit.com / password'
        : 'provider@handyit.com / password'
      errorMessage.value = `بريد إلكتروني أو كلمة مرور غير صالحة. جرب ${demoCredentials}`
    }
  } catch {
    errorMessage.value = 'حدث خطأ. يرجى المحاولة مرة أخرى.'
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = () => {
  console.log('تسجيل الدخول عبر جوجل لـ', loginType.value)
}

const handleFacebookLogin = () => {
  console.log('تسجيل الدخول عبر فيسبوك لـ', loginType.value)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <Icon name="material-symbols:handyman" class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-2xl font-medium text-gray-900">هاندلي</h1>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        تسجيل الدخول إلى حسابك
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        أو
        <NuxtLink to="/client/auth/register" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          إنشاء حساب جديد
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
        <div class="mb-6">
          <div class="flex bg-gray-100 rounded-xl p-1">
            <button
              @click="switchLoginType('user')"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors',
                loginType === 'user'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <Icon name="material-symbols:person" class="w-4 h-4 mr-2 inline" />
              مستخدم
            </button>
            <button
              @click="switchLoginType('provider')"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors',
                loginType === 'provider'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <Icon name="material-symbols:handyman" class="w-4 h-4 mr-2 inline" />
              مقدم خدمة
            </button>
          </div>
        </div>

        <div class="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 class="text-sm font-semibold text-blue-900 mb-2">بيانات تجريبية</h3>
          <div v-if="loginType === 'user'" class="text-sm text-blue-700">
            <strong>البريد الإلكتروني:</strong> demo@handyit.com<br>
            <strong>كلمة المرور:</strong> password
          </div>
          <div v-else class="text-sm text-blue-700">
            <strong>البريد الإلكتروني:</strong> provider@handyit.com<br>
            <strong>كلمة المرور:</strong> password
          </div>
        </div>

        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-900 mb-2">
              البريد الإلكتروني
            </label>
            <div class="relative">
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  emailError ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="أدخل بريدك الإلكتروني"
                @blur="validateEmail"
                @input="emailError = ''"
              >
              <Icon 
                name="material-symbols:email" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
              />
            </div>
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-900 mb-2">
              كلمة المرور
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                :class="[
                  'w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  passwordError ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="أدخل كلمة المرور"
                @blur="validatePassword"
                @input="passwordError = ''"
              >
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon 
                  :name="showPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'" 
                  class="w-5 h-5" 
                />
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="mr-2 block text-sm text-gray-700">
                تذكرني
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                نسيت كلمة المرور؟
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon 
                v-if="isLoading" 
                name="material-symbols:progress-activity" 
                class="animate-spin -ml-1 mr-2 h-4 w-4" 
              />
              {{ isLoading ? 'جاري تسجيل الدخول...' : `تسجيل الدخول كـ ${loginType === 'user' ? 'مستخدم' : 'مقدم خدمة'}` }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">أو المتابعة باستخدام</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              @click="handleGoogleLogin"
              class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Icon name="material-symbols:google" class="w-5 h-5 mr-2" />
              جوجل
            </button>

            <button
              @click="handleFacebookLogin"
              class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Icon name="material-symbols:facebook" class="w-5 h-5 mr-2" />
              فيسبوك
            </button>
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
