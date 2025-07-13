<script setup lang="ts">
import { ref } from 'vue'

// Page metadata
useHead({
  title: 'تسجيل | HandyIT.com',
  meta: [
    { name: 'description', content: 'انضم إلى HandyIT.com كمستخدم أو مقدم خدمة. أنشئ حسابك للبدء.' }
  ]
})

// Registration type state
const registrationType = ref<'user' | 'provider'>('user')

// Form state
const userForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: '',
  agreeToTerms: false
})

const providerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  businessName: '',
  address: '',
  bio: '',
  experience: '',
  skills: [] as string[],
  certifications: [] as string[],
  agreeToTerms: false
})

// Form validation states
const userErrors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  agreeToTerms: ''
})

const providerErrors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  businessName: '',
  bio: '',
  agreeToTerms: ''
})

// Loading state
const isLoading = ref(false)
const errorMessage = ref('')

// Available skills for providers
const availableSkills = ref([
  'السباكة', 'الكهرباء', 'النجارة', 'الطلاء', 'التنظيف', 'التركيب',
  'النقل', 'تنسيق الحدائق', 'الإصلاحات', 'التركيب', 'الصيانة',
  'تركيب البلاط', 'الجبس', 'الأرضيات', 'السقف', 'التكييف', 'إصلاح الأجهزة'
])

// Switch registration type
const switchRegistrationType = (type: 'user' | 'provider') => {
  registrationType.value = type
  // Clear error messages when switching
  errorMessage.value = ''
  clearErrors()
}

// Clear all errors
const clearErrors = () => {
  userErrors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: ''
  }
  providerErrors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    bio: '',
    agreeToTerms: ''
  }
}

// Validation functions
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string) => {
  return password.length >= 8
}

const validateUserForm = () => {
  let isValid = true
  clearErrors()

  // Name validation
  if (!userForm.value.name.trim()) {
    userErrors.value.name = 'الاسم الكامل مطلوب'
    isValid = false
  }

  // Email validation
  if (!userForm.value.email.trim()) {
    userErrors.value.email = 'البريد الإلكتروني مطلوب'
    isValid = false
  } else if (!validateEmail(userForm.value.email)) {
    userErrors.value.email = 'يرجى إدخال بريد إلكتروني صحيح'
    isValid = false
  }

  // Password validation
  if (!userForm.value.password) {
    userErrors.value.password = 'كلمة المرور مطلوبة'
    isValid = false
  } else if (!validatePassword(userForm.value.password)) {
    userErrors.value.password = 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل'
    isValid = false
  }

  // Confirm password validation
  if (!userForm.value.confirmPassword) {
    userErrors.value.confirmPassword = 'يرجى تأكيد كلمة المرور'
    isValid = false
  } else if (userForm.value.password !== userForm.value.confirmPassword) {
    userErrors.value.confirmPassword = 'كلمات المرور غير متطابقة'
    isValid = false
  }

  // Phone validation
  if (!userForm.value.phone.trim()) {
    userErrors.value.phone = 'رقم الهاتف مطلوب'
    isValid = false
  }

  // Terms validation
  if (!userForm.value.agreeToTerms) {
    userErrors.value.agreeToTerms = 'يجب الموافقة على الشروط والأحكام'
    isValid = false
  }

  return isValid
}

const validateProviderForm = () => {
  let isValid = true
  clearErrors()

  // Name validation
  if (!providerForm.value.name.trim()) {
    providerErrors.value.name = 'الاسم الكامل مطلوب'
    isValid = false
  }

  // Email validation
  if (!providerForm.value.email.trim()) {
    providerErrors.value.email = 'البريد الإلكتروني مطلوب'
    isValid = false
  } else if (!validateEmail(providerForm.value.email)) {
    providerErrors.value.email = 'يرجى إدخال بريد إلكتروني صحيح'
    isValid = false
  }

  // Password validation
  if (!providerForm.value.password) {
    providerErrors.value.password = 'كلمة المرور مطلوبة'
    isValid = false
  } else if (!validatePassword(providerForm.value.password)) {
    providerErrors.value.password = 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل'
    isValid = false
  }

  // Confirm password validation
  if (!providerForm.value.confirmPassword) {
    providerErrors.value.confirmPassword = 'يرجى تأكيد كلمة المرور'
    isValid = false
  } else if (providerForm.value.password !== providerForm.value.confirmPassword) {
    providerErrors.value.confirmPassword = 'كلمات المرور غير متطابقة'
    isValid = false
  }

  // Phone validation
  if (!providerForm.value.phone.trim()) {
    providerErrors.value.phone = 'رقم الهاتف مطلوب'
    isValid = false
  }

  // Business name validation
  if (!providerForm.value.businessName.trim()) {
    providerErrors.value.businessName = 'اسم العمل مطلوب'
    isValid = false
  }

  // Bio validation
  if (!providerForm.value.bio.trim()) {
    providerErrors.value.bio = 'السيرة المهنية مطلوبة'
    isValid = false
  }

  // Terms validation
  if (!providerForm.value.agreeToTerms) {
    providerErrors.value.agreeToTerms = 'يجب الموافقة على الشروط والأحكام'
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleRegistration = async () => {
  const isValid = registrationType.value === 'user' ? validateUserForm() : validateProviderForm()
  
  if (!isValid) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (registrationType.value === 'user') {
      // Store user session
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userType', 'user')
      localStorage.setItem('user', JSON.stringify({
        id: Date.now(),
        name: userForm.value.name,
        email: userForm.value.email,
        avatar: '',
        type: 'user',
        phone: userForm.value.phone,
        address: userForm.value.address
      }))
      
      // Redirect to user dashboard
      await navigateTo('/client/my-tasks')
      
    } else {
      // Store provider session
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userType', 'provider')
      localStorage.setItem('user', JSON.stringify({
        id: Date.now(),
        name: providerForm.value.name,
        email: providerForm.value.email,
        avatar: '',
        type: 'provider',
        businessName: providerForm.value.businessName,
        rating: 0,
        completedJobs: 0,
        skills: providerForm.value.skills,
        phone: providerForm.value.phone,
        address: providerForm.value.address,
        bio: providerForm.value.bio,
        experience: providerForm.value.experience,
        certifications: providerForm.value.certifications
      }))
      
      // Redirect to provider dashboard
      await navigateTo('/provider/dashboard')
    }
    
  } catch {
    errorMessage.value = 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Skill management for providers
const addSkill = (skill: string) => {
  if (!providerForm.value.skills.includes(skill)) {
    providerForm.value.skills.push(skill)
  }
}

const removeSkill = (skill: string) => {
  providerForm.value.skills = providerForm.value.skills.filter(s => s !== skill)
}

// Certification management for providers
const addCertification = () => {
  const cert = prompt('Enter certification name:')
  if (cert && !providerForm.value.certifications.includes(cert)) {
    providerForm.value.certifications.push(cert)
  }
}

const removeCertification = (cert: string) => {
  providerForm.value.certifications = providerForm.value.certifications.filter(c => c !== cert)
}

// Social registration handlers
const handleGoogleRegister = () => {
  console.log('Google registration for', registrationType.value)
}

const handleFacebookRegister = () => {
  console.log('Facebook registration for', registrationType.value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center ml-3">
            <Icon name="material-symbols:handyman" class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-2xl font-medium text-gray-900">HandyIT<span class="text-gray-500">.com</span></h1>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        إنشاء حساب جديد
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        أو
        <NuxtLink to="/client/auth/login" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          تسجيل الدخول إلى حسابك الحالي
        </NuxtLink>
      </p>
    </div>

    <!-- Registration Form -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
        <!-- Registration Type Tabs -->
        <div class="mb-6">
          <div class="flex bg-gray-100 rounded-xl p-1">
            <button
              @click="switchRegistrationType('user')"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors',
                registrationType === 'user'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <Icon name="material-symbols:person" class="w-4 h-4 ml-2 inline" />
              انضم كمستخدم
            </button>
            <button
              @click="switchRegistrationType('provider')"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors',
                registrationType === 'provider'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <Icon name="material-symbols:handyman" class="w-4 h-4 ml-2 inline" />
              انضم كمقدم خدمة
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
          <p class="text-sm text-red-700">{{ errorMessage }}</p>
        </div>

        <!-- User Registration Form -->
        <form v-if="registrationType === 'user'" @submit.prevent="handleRegistration" class="space-y-6">
          <!-- Full Name -->
          <div>
            <label for="user-name" class="block text-sm font-semibold text-gray-900 mb-2">
              الاسم الكامل
            </label>
            <input
              id="user-name"
              v-model="userForm.name"
              type="text"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                userErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              ]"
              placeholder="أدخل اسمك الكامل"
            >
            <p v-if="userErrors.name" class="mt-1 text-sm text-red-600">{{ userErrors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="user-email" class="block text-sm font-semibold text-gray-900 mb-2">
              البريد الإلكتروني
            </label>
            <input
              id="user-email"
              v-model="userForm.email"
              type="email"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                userErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              ]"
              placeholder="أدخل بريدك الإلكتروني"
            >
            <p v-if="userErrors.email" class="mt-1 text-sm text-red-600">{{ userErrors.email }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label for="user-phone" class="block text-sm font-semibold text-gray-900 mb-2">
              رقم الهاتف
            </label>
            <input
              id="user-phone"
              v-model="userForm.phone"
              type="tel"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                userErrors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              ]"
              placeholder="أدخل رقم هاتفك"
            >
            <p v-if="userErrors.phone" class="mt-1 text-sm text-red-600">{{ userErrors.phone }}</p>
          </div>

          <!-- Address -->
          <div>
            <label for="user-address" class="block text-sm font-semibold text-gray-900 mb-2">
              العنوان (اختياري)
            </label>
            <textarea
              id="user-address"
              v-model="userForm.address"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="أدخل عنوانك"
            ></textarea>
          </div>

          <!-- Password -->
          <div>
            <label for="user-password" class="block text-sm font-semibold text-gray-900 mb-2">
              كلمة المرور
            </label>
            <input
              id="user-password"
              v-model="userForm.password"
              type="password"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                userErrors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              ]"
              placeholder="أنشئ كلمة مرور قوية"
            >
            <p v-if="userErrors.password" class="mt-1 text-sm text-red-600">{{ userErrors.password }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="user-confirm-password" class="block text-sm font-semibold text-gray-900 mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              id="user-confirm-password"
              v-model="userForm.confirmPassword"
              type="password"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                userErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              ]"
              placeholder="أكد كلمة المرور"
            >
            <p v-if="userErrors.confirmPassword" class="mt-1 text-sm text-red-600">{{ userErrors.confirmPassword }}</p>
          </div>

          <!-- Terms Agreement -->
          <div>
            <div class="flex items-start">
              <input
                id="user-terms"
                v-model="userForm.agreeToTerms"
                type="checkbox"
                :class="[
                  'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1',
                  userErrors.agreeToTerms ? 'border-red-300' : ''
                ]"
              >
              <label for="user-terms" class="mr-2 block text-sm text-gray-700">
                أوافق على 
                <a href="#" class="text-blue-600 hover:text-blue-500">شروط الخدمة</a> 
                و 
                <a href="#" class="text-blue-600 hover:text-blue-500">سياسة الخصوصية</a>
              </label>
            </div>
            <p v-if="userErrors.agreeToTerms" class="mt-1 text-sm text-red-600">{{ userErrors.agreeToTerms }}</p>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon 
                v-if="isLoading" 
                name="material-symbols:progress-activity" 
                class="animate-spin -mr-1 ml-2 h-4 w-4" 
              />
              {{ isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب مستخدم' }}
            </button>
          </div>
        </form>

        <!-- Service Provider Registration Form -->
        <form v-else @submit.prevent="handleRegistration" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
              <label for="provider-name" class="block text-sm font-semibold text-gray-900 mb-2">
                الاسم الكامل
              </label>
              <input
                id="provider-name"
                v-model="providerForm.name"
                type="text"
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  providerErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="أدخل اسمك الكامل"
              >
              <p v-if="providerErrors.name" class="mt-1 text-sm text-red-600">{{ providerErrors.name }}</p>
            </div>

            <!-- Business Name -->
            <div>
              <label for="provider-business" class="block text-sm font-semibold text-gray-900 mb-2">
                اسم العمل
              </label>
              <input
                id="provider-business"
                v-model="providerForm.businessName"
                type="text"
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  providerErrors.businessName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="أدخل اسم عملك"
              >
              <p v-if="providerErrors.businessName" class="mt-1 text-sm text-red-600">{{ providerErrors.businessName }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Email -->
            <div>
              <label for="provider-email" class="block text-sm font-semibold text-gray-900 mb-2">
                البريد الإلكتروني
              </label>
              <input
                id="provider-email"
                v-model="providerForm.email"
                type="email"
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  providerErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="أدخل بريدك الإلكتروني"
              >
              <p v-if="providerErrors.email" class="mt-1 text-sm text-red-600">{{ providerErrors.email }}</p>
            </div>

            <!-- Phone -->
            <div>
              <label for="provider-phone" class="block text-sm font-semibold text-gray-900 mb-2">
                رقم الهاتف
              </label>
              <input
                id="provider-phone"
                v-model="providerForm.phone"
                type="tel"
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  providerErrors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="أدخل رقم هاتفك"
              >
              <p v-if="providerErrors.phone" class="mt-1 text-sm text-red-600">{{ providerErrors.phone }}</p>
            </div>
          </div>

          <!-- Service Area -->
          <div>
            <label for="provider-address" class="block text-sm font-semibold text-gray-900 mb-2">
              منطقة الخدمة
            </label>
            <textarea
              id="provider-address"
              v-model="providerForm.address"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="المناطق التي تقدم فيها خدماتك..."
            ></textarea>
          </div>

          <!-- Professional Bio -->
          <div>
            <label for="provider-bio" class="block text-sm font-semibold text-gray-900 mb-2">
              السيرة المهنية
            </label>
            <textarea
              id="provider-bio"
              v-model="providerForm.bio"
              rows="4"
              :class="[
                'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none',
                providerErrors.bio ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              ]"
              placeholder="أخبر العملاء عن خبرتك وتخصصك..."
            ></textarea>
            <p v-if="providerErrors.bio" class="mt-1 text-sm text-red-600">{{ providerErrors.bio }}</p>
          </div>

          <!-- Experience -->
          <div>
            <label for="provider-experience" class="block text-sm font-semibold text-gray-900 mb-2">
              سنوات الخبرة
            </label>
            <input
              id="provider-experience"
              v-model="providerForm.experience"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="مثال: 5+ سنوات، 10+ سنوات"
            >
          </div>

          <!-- Skills -->
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">المهارات والخبرات</label>
            <div class="mb-3">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in providerForm.skills"
                  :key="skill"
                  class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {{ skill }}
                  <button
                    type="button"
                    @click="removeSkill(skill)"
                    class="mr-2 text-blue-600 hover:text-blue-800"
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
                :disabled="providerForm.skills.includes(skill)"
                :class="[
                  'px-3 py-1 text-sm rounded-full border transition-colors',
                  providerForm.skills.includes(skill)
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
            <label class="block text-sm font-semibold text-gray-900 mb-2">الشهادات (اختياري)</label>
            <div class="mb-3">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="cert in providerForm.certifications"
                  :key="cert"
                  class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {{ cert }}
                  <button
                    type="button"
                    @click="removeCertification(cert)"
                    class="mr-2 text-green-600 hover:text-green-800"
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
              <Icon name="material-symbols:add" class="w-4 h-4 ml-2" />
              إضافة شهادة
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Password -->
            <div>
              <label for="provider-password" class="block text-sm font-semibold text-gray-900 mb-2">
                كلمة المرور
              </label>
              <input
                id="provider-password"
                v-model="providerForm.password"
                type="password"
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  providerErrors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="أنشئ كلمة مرور قوية"
              >
              <p v-if="providerErrors.password" class="mt-1 text-sm text-red-600">{{ providerErrors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="provider-confirm-password" class="block text-sm font-semibold text-gray-900 mb-2">
                تأكيد كلمة المرور
              </label>
              <input
                id="provider-confirm-password"
                v-model="providerForm.confirmPassword"
                type="password"
                :class="[
                  'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors',
                  providerErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                ]"
                placeholder="أكد كلمة المرور"
              >
              <p v-if="providerErrors.confirmPassword" class="mt-1 text-sm text-red-600">{{ providerErrors.confirmPassword }}</p>
            </div>
          </div>

          <!-- Terms Agreement -->
          <div>
            <div class="flex items-start">
              <input
                id="provider-terms"
                v-model="providerForm.agreeToTerms"
                type="checkbox"
                :class="[
                  'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1',
                  providerErrors.agreeToTerms ? 'border-red-300' : ''
                ]"
              >
              <label for="provider-terms" class="mr-2 block text-sm text-gray-700">
                أوافق على 
                <a href="#" class="text-blue-600 hover:text-blue-500">شروط الخدمة</a>، 
                <a href="#" class="text-blue-600 hover:text-blue-500">سياسة الخصوصية</a>، 
                و 
                <a href="#" class="text-blue-600 hover:text-blue-500">اتفاقية مقدم الخدمة</a>
              </label>
            </div>
            <p v-if="providerErrors.agreeToTerms" class="mt-1 text-sm text-red-600">{{ providerErrors.agreeToTerms }}</p>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Icon 
                v-if="isLoading" 
                name="material-symbols:progress-activity" 
                class="animate-spin -mr-1 ml-2 h-4 w-4" 
              />
              {{ isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب مقدم خدمة' }}
            </button>
          </div>
        </form>

        <!-- Social Registration -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">أو تابع باستخدام</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              @click="handleGoogleRegister"
              class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Icon name="material-symbols:google" class="w-5 h-5 ml-2" />
              جوجل
            </button>

            <button
              @click="handleFacebookRegister"
              class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Icon name="material-symbols:facebook" class="w-5 h-5 ml-2" />
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