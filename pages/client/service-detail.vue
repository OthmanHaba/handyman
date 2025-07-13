<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Page metadata
useHead({
  title: 'Service Details | HandyIT.com',
  meta: [
    { name: 'description', content: 'View service details and book your handyman service.' }
  ]
})

// Get service ID from query params
const route = useRoute()
const serviceId = computed(() => route.query.id)
const providerId = computed(() => route.query.provider)

// Type definitions
interface User {
  id: number
  name: string
  email: string
  avatar: string
}

interface Service {
  id: number
  title: string
  category: string
  subcategory: string
  description: string
  fullDescription: string
  basePrice: number
  priceType: string
  duration: string
  location: string
  availability: string
  skills: string[]
  images: string[]
  providerId: number
  completedJobs: number
  rating: number
  reviews: Array<{
    id: number
    user: string
    rating: number
    comment: string
    date: string
    avatar: string
  }>
  features: string[]
}

interface Provider {
  id: number
  name: string
  avatar: string
  rating: number
  reviewCount: number
  completedJobs: number
  responseTime: string
  location: string
  memberSince: string
  verified: boolean
  skills: string[]
  bio: string
  certifications: string[]
  languages: string[]
}

// Authentication state
const isLoggedIn = ref(false)
const user = ref<User | null>(null)

// Service data
const service = ref<Service | null>(null)
const provider = ref<Provider | null>(null)
const isLoading = ref(true)

// Booking state
const selectedDate = ref('')
const selectedTime = ref('')
const selectedDuration = ref(2) // Default 2 hours
const bookingNotes = ref('')
const isBookingModalOpen = ref(false)
const isCheckoutModalOpen = ref(false)
const isProcessingBooking = ref(false)

// Calendar state
const currentMonth = ref(new Date())
const selectedCalendarDate = ref<Date | null>(null)

// Available time slots
const timeSlots = ref([
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '12:00', available: true },
  { time: '13:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: false },
  { time: '16:00', available: true },
  { time: '17:00', available: true },
  { time: '18:00', available: true }
])

// Mock service data (in real app, this would come from API)
const mockServices = [
  {
    id: 1,
    title: 'Furniture Assembly Service',
    category: 'Assembly',
    subcategory: 'Furniture',
    description: 'Expert furniture assembly service for all types of furniture. Fast, efficient, and professional.',
    fullDescription: 'Professional furniture assembly service for IKEA, Wayfair, Amazon, and other furniture brands. I have all the tools and experience to assemble your furniture quickly and correctly. Services include: bed assembly, wardrobe assembly, desk assembly, chair assembly, and disassembly services.',
    basePrice: 70,
    priceType: 'hourly',
    duration: '1-4 hours',
    location: 'client_location',
    availability: 'weekdays',
    skills: ['Assembly', 'Furniture', 'Tools'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'
    ],
    providerId: 1,
    completedJobs: 156,
    rating: 4.98,
    reviews: [
      {
        id: 1,
        user: 'Sarah Wilson',
        rating: 5,
        comment: 'Amazing work! Assembled my entire bedroom set perfectly. Very professional and efficient.',
        date: '2024-01-15',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      },
      {
        id: 2,
        user: 'John Davis',
        rating: 5,
        comment: 'Great service! All furniture assembled correctly and quickly. Highly recommend!',
        date: '2024-01-10',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
      }
    ],
    features: [
      'All tools provided',
      'Warranty on assembly',
      'Same-day service available',
      'Experienced assembler',
      'Clean-up included'
    ]
  },
  {
    id: 2,
    title: 'Plumbing Repair Service',
    category: 'Plumbing',
    subcategory: 'Repair',
    description: 'Professional plumbing repair services for all your home plumbing needs.',
    fullDescription: 'Comprehensive plumbing repair services including leak detection, pipe repair, faucet installation, toilet repair, and drain cleaning. Licensed plumber with 10+ years experience. Available for emergency repairs.',
    basePrice: 40,
    priceType: 'hourly',
    duration: '1-3 hours',
    location: 'client_location',
    availability: 'both',
    skills: ['Plumbing', 'Repair', 'Installation'],
    images: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    ],
    providerId: 2,
    completedJobs: 203,
    rating: 4.99,
    reviews: [
      {
        id: 1,
        user: 'Mike Johnson',
        rating: 5,
        comment: 'Fixed my leaking faucet quickly and professionally. Great service!',
        date: '2024-01-18',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      },
      {
        id: 2,
        user: 'Lisa Chen',
        rating: 5,
        comment: 'Emergency plumbing service was excellent. Very responsive and skilled.',
        date: '2024-01-12',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
      }
    ],
    features: [
      'Licensed plumber',
      'Emergency service available',
      'High-quality parts',
      'Warranty on work',
      'Free estimates'
    ]
  },
  {
    id: 3,
    title: 'Office Cleaning Service',
    category: 'Cleaning',
    subcategory: 'Office',
    description: 'Professional office cleaning services for businesses and commercial spaces.',
    fullDescription: 'Comprehensive office cleaning services including desk cleaning, floor mopping, window cleaning, bathroom sanitization, and trash removal. Flexible scheduling to work around your business hours.',
    basePrice: 60,
    priceType: 'hourly',
    duration: '2-4 hours',
    location: 'client_location',
    availability: 'both',
    skills: ['Cleaning', 'Office', 'Sanitization'],
    images: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    ],
    providerId: 3,
    completedJobs: 89,
    rating: 4.98,
    reviews: [
      {
        id: 1,
        user: 'Corporate Office',
        rating: 5,
        comment: 'Excellent cleaning service. Office always spotless after their visit.',
        date: '2024-01-20',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
      }
    ],
    features: [
      'Flexible scheduling',
      'Commercial grade supplies',
      'Insured and bonded',
      'Eco-friendly products',
      'Regular service available'
    ]
  },
  {
    id: 4,
    title: 'Electrical Installation Service',
    category: 'Electrical',
    subcategory: 'Installation',
    description: 'Licensed electrician providing safe and professional electrical installation services.',
    fullDescription: 'Professional electrical installation services including outlet installation, light fixture installation, ceiling fan installation, and electrical panel upgrades. Licensed electrician with 12+ years experience.',
    basePrice: 80,
    priceType: 'hourly',
    duration: '1-3 hours',
    location: 'client_location',
    availability: 'weekdays',
    skills: ['Electrical', 'Installation', 'Wiring'],
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    ],
    providerId: 4,
    completedJobs: 278,
    rating: 4.97,
    reviews: [
      {
        id: 1,
        user: 'Home Owner',
        rating: 5,
        comment: 'Professional electrical work. Installed outlets perfectly and safely.',
        date: '2024-01-16',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      }
    ],
    features: [
      'Licensed electrician',
      'Code compliant work',
      'Safety guaranteed',
      'Warranty included',
      'Free consultation'
    ]
  },
  {
    id: 5,
    title: 'House Cleaning Service',
    category: 'Cleaning',
    subcategory: 'House',
    description: 'Reliable house cleaning service with attention to detail and quality.',
    fullDescription: 'Professional house cleaning service including kitchen cleaning, bathroom cleaning, bedroom cleaning, living room cleaning, and deep cleaning services. Flexible scheduling and eco-friendly products.',
    basePrice: 30,
    priceType: 'hourly',
    duration: '2-5 hours',
    location: 'client_location',
    availability: 'both',
    skills: ['Cleaning', 'House', 'Deep Clean'],
    images: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    ],
    providerId: 5,
    completedJobs: 67,
    rating: 4.96,
    reviews: [
      {
        id: 1,
        user: 'Happy Customer',
        rating: 5,
        comment: 'House was spotless after cleaning. Very thorough and professional.',
        date: '2024-01-14',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
      }
    ],
    features: [
      'Eco-friendly products',
      'Flexible scheduling',
      'Insured and bonded',
      'Regular service available',
      'Satisfaction guaranteed'
    ]
  },
  {
    id: 6,
    title: 'Emergency Plumbing Service',
    category: 'Plumbing',
    subcategory: 'Emergency',
    description: 'Fast and reliable emergency plumbing services available 24/7.',
    fullDescription: 'Emergency plumbing services available 24/7 for urgent plumbing issues. Experienced plumber specializing in emergency repairs, burst pipes, clogged drains, and water heater issues.',
    basePrice: 55,
    priceType: 'hourly',
    duration: '1-4 hours',
    location: 'client_location',
    availability: 'both',
    skills: ['Plumbing', 'Emergency', 'Repair'],
    images: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    ],
    providerId: 6,
    completedJobs: 134,
    rating: 4.95,
    reviews: [
      {
        id: 1,
        user: 'Emergency Client',
        rating: 5,
        comment: 'Saved the day! Fixed my burst pipe quickly and professionally.',
        date: '2024-01-19',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      }
    ],
    features: [
      '24/7 availability',
      'Emergency response',
      'Licensed plumber',
      'Quality repairs',
      'Fair pricing'
    ]
  },
  {
    id: 7,
    title: 'Deep Cleaning Service',
    category: 'Cleaning',
    subcategory: 'Deep',
    description: 'Professional deep cleaning services for thorough home maintenance.',
    fullDescription: 'Comprehensive deep cleaning services including detailed cleaning of all rooms, appliances, windows, and hard-to-reach areas. Perfect for move-in/move-out cleaning or seasonal deep cleaning.',
    basePrice: 45,
    priceType: 'hourly',
    duration: '3-6 hours',
    location: 'client_location',
    availability: 'weekdays',
    skills: ['Cleaning', 'Deep Clean', 'Detailed'],
    images: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    ],
    providerId: 7,
    completedJobs: 56,
    rating: 4.94,
    reviews: [
      {
        id: 1,
        user: 'Satisfied Client',
        rating: 5,
        comment: 'Incredible deep cleaning service. House looks brand new!',
        date: '2024-01-17',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
      }
    ],
    features: [
      'Thorough cleaning',
      'Move-in/out cleaning',
      'Professional equipment',
      'Eco-friendly products',
      'Satisfaction guaranteed'
    ]
  },
  {
    id: 8,
    title: 'Moving & Assembly Service',
    category: 'Moving',
    subcategory: 'Assembly',
    description: 'Professional moving and furniture assembly services for your relocation needs.',
    fullDescription: 'Complete moving and furniture assembly services including packing, moving, unpacking, and furniture assembly. Experienced team with proper equipment and insurance coverage.',
    basePrice: 65,
    priceType: 'hourly',
    duration: '2-8 hours',
    location: 'client_location',
    availability: 'both',
    skills: ['Moving', 'Assembly', 'Packing'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'
    ],
    providerId: 8,
    completedJobs: 112,
    rating: 4.93,
    reviews: [
      {
        id: 1,
        user: 'Moving Client',
        rating: 5,
        comment: 'Great moving service! Professional team and careful handling.',
        date: '2024-01-13',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
      }
    ],
    features: [
      'Full moving service',
      'Professional equipment',
      'Insurance coverage',
      'Careful handling',
      'Flexible scheduling'
    ]
  }
]

// Mock provider data
const mockProviders = [
  {
    id: 1,
    name: 'Courtney Henry',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    rating: 4.98,
    reviewCount: 247,
    completedJobs: 156,
    responseTime: '2 hours',
    location: 'Kathmandu, Nepal',
    memberSince: '2020',
    verified: true,
    skills: ['Assembly', 'Furniture', 'Tools'],
    bio: 'Expert furniture assembler with 8+ years of experience. Specialized in IKEA and other furniture brands. Fast, efficient, and reliable service.',
    certifications: ['Furniture Assembly Certified', 'Tool Safety Certified'],
    languages: ['English', 'Nepali']
  },
  {
    id: 2,
    name: 'Devon Lane',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 4.99,
    reviewCount: 189,
    completedJobs: 203,
    responseTime: '1 hour',
    location: 'Ho Chi Minh City, Vietnam',
    memberSince: '2019',
    verified: true,
    skills: ['Plumbing', 'Repair', 'Installation'],
    bio: 'Professional plumber with 10+ years experience. Specialized in residential and commercial plumbing. Available for emergency repairs.',
    certifications: ['Licensed Plumber', 'Emergency Service Certified'],
    languages: ['English', 'Vietnamese']
  },
  {
    id: 3,
    name: 'Arlene McCoy',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    rating: 4.98,
    reviewCount: 156,
    completedJobs: 89,
    responseTime: '3 hours',
    location: 'Yangon, Myanmar',
    memberSince: '2021',
    verified: true,
    skills: ['Cleaning', 'Office', 'Sanitization'],
    bio: 'Professional office cleaning specialist. Experienced in commercial cleaning with flexible scheduling and eco-friendly products.',
    certifications: ['Commercial Cleaning Certified', 'Eco-Friendly Products Certified'],
    languages: ['English', 'Burmese']
  },
  {
    id: 4,
    name: 'Jerome Bell',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    rating: 4.97,
    reviewCount: 324,
    completedJobs: 278,
    responseTime: '1 hour',
    location: 'New York, NY',
    memberSince: '2018',
    verified: true,
    skills: ['Electrical', 'Installation', 'Wiring'],
    bio: 'Licensed electrician with 12+ years experience in residential and commercial electrical work. Safety-focused and code-compliant.',
    certifications: ['Licensed Electrician', 'Code Compliance Certified'],
    languages: ['English']
  },
  {
    id: 5,
    name: 'Esther Howard',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    rating: 4.96,
    reviewCount: 98,
    completedJobs: 67,
    responseTime: '2 hours',
    location: 'Amsterdam, Netherlands',
    memberSince: '2022',
    verified: true,
    skills: ['Cleaning', 'House', 'Deep Clean'],
    bio: 'Reliable house cleaning service with attention to detail. Eco-friendly products and flexible scheduling available.',
    certifications: ['House Cleaning Certified', 'Eco-Friendly Certified'],
    languages: ['English', 'Dutch']
  },
  {
    id: 6,
    name: 'Robert Fox',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    rating: 4.95,
    reviewCount: 167,
    completedJobs: 134,
    responseTime: '2 hours',
    location: 'Toronto, Canada',
    memberSince: '2020',
    verified: true,
    skills: ['Plumbing', 'Emergency', 'Repair'],
    bio: 'Emergency plumbing specialist available 24/7. Experienced in urgent repairs and water damage prevention.',
    certifications: ['Licensed Plumber', 'Emergency Response Certified'],
    languages: ['English', 'French']
  },
  {
    id: 7,
    name: 'Darlene Robertson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    rating: 4.94,
    reviewCount: 89,
    completedJobs: 56,
    responseTime: '4 hours',
    location: 'Sydney, Australia',
    memberSince: '2021',
    verified: true,
    skills: ['Cleaning', 'Deep Clean', 'Detailed'],
    bio: 'Professional deep cleaning specialist. Perfect for move-in/move-out cleaning and seasonal deep cleaning services.',
    certifications: ['Deep Cleaning Certified', 'Professional Equipment Certified'],
    languages: ['English']
  },
  {
    id: 8,
    name: 'Wade Warren',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    rating: 4.93,
    reviewCount: 145,
    completedJobs: 112,
    responseTime: '3 hours',
    location: 'London, UK',
    memberSince: '2019',
    verified: true,
    skills: ['Moving', 'Assembly', 'Packing'],
    bio: 'Professional moving and furniture assembly service. Experienced team with proper equipment and insurance coverage.',
    certifications: ['Moving Services Certified', 'Insurance Coverage Certified'],
    languages: ['English']
  }
]

// Check authentication
onMounted(() => {
  checkAuth()
  loadServiceData()
})

const checkAuth = () => {
  try {
    const loggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (loggedIn === 'true' && userData) {
      isLoggedIn.value = true
      user.value = JSON.parse(userData)
    }
  } catch (error) {
    console.error('Auth check failed:', error)
  }
}

const loadServiceData = () => {
  // Simulate API call
  setTimeout(() => {
    service.value = mockServices.find(s => s.id === parseInt(serviceId.value as string)) || null
    provider.value = mockProviders.find(p => p.id === parseInt(providerId.value as string)) || null
    isLoading.value = false
  }, 500)
}

// Calendar helpers
const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const current = new Date(startDate)
  
  while (current <= lastDay || current.getDay() !== 0) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  return days
}

const calendarDays = computed(() => getDaysInMonth(currentMonth.value))

const isToday = (date: Date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const isCurrentMonth = (date: Date) => {
  return date.getMonth() === currentMonth.value.getMonth()
}

const isSelected = (date: Date) => {
  return selectedCalendarDate.value?.toDateString() === date.toDateString()
}

const isAvailable = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today && isCurrentMonth(date)
}

const selectDate = (date: Date) => {
  if (isAvailable(date)) {
    selectedCalendarDate.value = date
    selectedDate.value = date.toISOString().split('T')[0]
    selectedTime.value = ''
  }
}

const previousMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1)
}

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1)
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Booking calculations
const totalPrice = computed(() => {
  if (!service.value) return 0
  
  if (service.value.priceType === 'hourly') {
    return service.value.basePrice * selectedDuration.value
  }
  return service.value.basePrice
})

const serviceFee = computed(() => Math.round(totalPrice.value * 0.1))
const totalAmount = computed(() => totalPrice.value + serviceFee.value)

// Booking actions
const openBookingModal = () => {
  if (!isLoggedIn.value) {
    const router = useRouter()
    router.push('/client/auth/login?redirect=' + encodeURIComponent(route.fullPath))
    return
  }
  isBookingModalOpen.value = true
}

const closeBookingModal = () => {
  isBookingModalOpen.value = false
  selectedDate.value = ''
  selectedTime.value = ''
  selectedCalendarDate.value = null
  bookingNotes.value = ''
}

const proceedToCheckout = () => {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Please select a date and time')
    return
  }
  isBookingModalOpen.value = false
  isCheckoutModalOpen.value = true
}

const confirmBooking = async () => {
  isProcessingBooking.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create booking object
    const booking = {
      serviceId: service.value.id,
      providerId: provider.value.id,
      date: selectedDate.value,
      time: selectedTime.value,
      duration: selectedDuration.value,
      notes: bookingNotes.value,
      totalAmount: totalAmount.value,
      status: 'pending'
    }
    
    console.log('Booking created:', booking)
    
    // Close modal and show success
    isCheckoutModalOpen.value = false
    alert('Booking confirmed! You will receive a confirmation email shortly.')
    
    // Redirect to my tasks
    const router = useRouter()
    router.push('/client/my-tasks')
    
  } catch (error) {
    console.error('Booking failed:', error)
    alert('Booking failed. Please try again.')
  } finally {
    isProcessingBooking.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <GuestHeader />

    <!-- Loading State -->
    <div v-if="isLoading" class="container mx-auto px-4 py-16">
      <div class="text-center">
        <Icon name="material-symbols:progress-activity" class="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p class="text-gray-600">Loading service details...</p>
      </div>
    </div>

    <!-- Service Not Found -->
    <div v-else-if="!service" class="container mx-auto px-4 py-16">
      <div class="text-center">
        <Icon name="material-symbols:error" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
        <p class="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
          Back to Home
        </NuxtLink>
      </div>
    </div>

    <!-- Service Details -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li><NuxtLink to="/" class="hover:text-blue-600">Home</NuxtLink></li>
          <li><Icon name="material-symbols:chevron-right" class="w-4 h-4" /></li>
          <li><span class="text-gray-900">{{ service.title }}</span></li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Service Images -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            <div class="aspect-video bg-gray-100">
              <img 
                :src="service.images[0]" 
                :alt="service.title"
                class="w-full h-full object-cover"
              >
            </div>
            <div v-if="service.images.length > 1" class="p-4">
              <div class="flex gap-2 overflow-x-auto">
                <img
                  v-for="(image, index) in service.images.slice(1)"
                  :key="index"
                  :src="image"
                  :alt="`Service image ${index + 2}`"
                  class="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
              </div>
            </div>
          </div>

          <!-- Service Info -->
          <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ service.title }}</h1>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <Icon name="material-symbols:category" class="w-4 h-4" />
                    {{ service.category }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current" />
                    {{ service.rating }} ({{ service.completedJobs }} jobs)
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-gray-900">
                  ${{ service.basePrice }}
                  <span v-if="service.priceType === 'hourly'" class="text-lg font-normal text-gray-600">/hour</span>
                </div>
                <p class="text-sm text-gray-600">{{ service.duration }}</p>
              </div>
            </div>

            <div class="prose max-w-none">
              <p class="text-gray-700 mb-4">{{ service.fullDescription }}</p>
            </div>

            <!-- Features -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">What's included</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="feature in service.features" :key="feature" class="flex items-center gap-2">
                  <Icon name="material-symbols:check-circle" class="w-5 h-5 text-green-600" />
                  <span class="text-gray-700">{{ feature }}</span>
                </div>
              </div>
            </div>

            <!-- Skills -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Skills required</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in service.skills"
                  :key="skill"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <!-- Reviews -->
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Reviews</h3>
            <div class="space-y-4">
              <div v-for="review in service.reviews" :key="review.id" class="border-b border-gray-200 pb-4 last:border-b-0">
                <div class="flex items-start gap-3">
                  <img :src="review.avatar" :alt="review.user" class="w-10 h-10 rounded-full">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-gray-900">{{ review.user }}</span>
                      <div class="flex items-center">
                        <Icon 
                          v-for="i in 5" 
                          :key="i" 
                          name="material-symbols:star" 
                          :class="[
                            'w-4 h-4',
                            i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          ]" 
                        />
                      </div>
                      <span class="text-sm text-gray-500">{{ review.date }}</span>
                    </div>
                    <p class="text-gray-700">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Provider Info -->
          <div v-if="provider" class="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
              <img :src="provider.avatar" :alt="provider.name" class="w-16 h-16 rounded-full">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">{{ provider.name }}</h3>
                <div class="flex items-center gap-1">
                  <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-400 fill-current" />
                  <span class="text-sm text-gray-600">{{ provider.rating }} ({{ provider.reviewCount }} reviews)</span>
                </div>
              </div>
            </div>

            <div class="space-y-3 mb-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Location:</span>
                <span class="font-medium">{{ provider.location }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Response time:</span>
                <span class="font-medium">{{ provider.responseTime }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Jobs completed:</span>
                <span class="font-medium">{{ provider.completedJobs }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Member since:</span>
                <span class="font-medium">{{ provider.memberSince }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 mb-4">
              <Icon name="material-symbols:verified" class="w-5 h-5 text-green-600" />
              <span class="text-sm text-green-600 font-medium">Verified Provider</span>
            </div>

            <p class="text-gray-700 text-sm mb-4">{{ provider.bio }}</p>

          </div>

          <!-- Book Service -->
          <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Book this service</h3>
            
            <div class="space-y-4 mb-6">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Base price:</span>
                <span class="font-semibold">${{ service.basePrice }}{{ service.priceType === 'hourly' ? '/hour' : '' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Duration:</span>
                <span class="font-semibold">{{ service.duration }}</span>
              </div>
            </div>

            <button 
              @click="openBookingModal"
              class="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Icon name="material-symbols:calendar-month" class="w-5 h-5 mr-2" />
              Book Now
            </button>

            <p class="text-xs text-gray-500 text-center mt-3">
              Free cancellation up to 24 hours before scheduled time
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="isBookingModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">Book Service</h2>
            <button @click="closeBookingModal" class="p-2 hover:bg-gray-100 rounded-lg">
              <Icon name="material-symbols:close" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Date Selection -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
              
              <!-- Calendar -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-4">
                  <button @click="previousMonth" class="p-2 hover:bg-gray-200 rounded-lg">
                    <Icon name="material-symbols:chevron-left" class="w-5 h-5" />
                  </button>
                  <h4 class="text-lg font-semibold">
                    {{ monthNames[currentMonth.getMonth()] }} {{ currentMonth.getFullYear() }}
                  </h4>
                  <button @click="nextMonth" class="p-2 hover:bg-gray-200 rounded-lg">
                    <Icon name="material-symbols:chevron-right" class="w-5 h-5" />
                  </button>
                </div>

                <div class="grid grid-cols-7 gap-1 mb-2">
                  <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day" 
                       class="text-center text-sm font-medium text-gray-600 py-2">
                    {{ day }}
                  </div>
                </div>

                <div class="grid grid-cols-7 gap-1">
                  <button
                    v-for="date in calendarDays"
                    :key="date.toISOString()"
                    @click="selectDate(date)"
                    :disabled="!isAvailable(date)"
                    :class="[
                      'aspect-square flex items-center justify-center text-sm rounded-lg transition-colors',
                      isSelected(date) ? 'bg-blue-600 text-white' :
                      isToday(date) ? 'bg-blue-100 text-blue-600 font-semibold' :
                      isAvailable(date) ? 'hover:bg-gray-200 text-gray-900' :
                      'text-gray-400 cursor-not-allowed',
                      !isCurrentMonth(date) && 'opacity-50'
                    ]"
                  >
                    {{ date.getDate() }}
                  </button>
                </div>
              </div>

              <!-- Time Selection -->
              <div v-if="selectedDate" class="mt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="slot in timeSlots"
                    :key="slot.time"
                    @click="selectedTime = slot.time"
                    :disabled="!slot.available"
                    :class="[
                      'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                      selectedTime === slot.time ? 'bg-blue-600 text-white' :
                      slot.available ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' :
                      'bg-gray-50 text-gray-400 cursor-not-allowed'
                    ]"
                  >
                    {{ formatTime(slot.time) }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Booking Details -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
              
              <div class="space-y-4">
                <!-- Duration -->
                <div v-if="service.priceType === 'hourly'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                  <select v-model="selectedDuration" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="6">6 hours</option>
                    <option value="8">8 hours</option>
                  </select>
                </div>

                <!-- Notes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea 
                    v-model="bookingNotes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Any specific instructions or requirements..."
                  ></textarea>
                </div>

                <!-- Summary -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h4 class="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span>Service:</span>
                      <span class="font-medium">{{ service.title }}</span>
                    </div>
                    <div v-if="selectedDate" class="flex justify-between">
                      <span>Date:</span>
                      <span class="font-medium">{{ formatDate(selectedDate) }}</span>
                    </div>
                    <div v-if="selectedTime" class="flex justify-between">
                      <span>Time:</span>
                      <span class="font-medium">{{ formatTime(selectedTime) }}</span>
                    </div>
                    <div v-if="service.priceType === 'hourly'" class="flex justify-between">
                      <span>Duration:</span>
                      <span class="font-medium">{{ selectedDuration }} hours</span>
                    </div>
                    <div class="border-t pt-2 mt-2">
                      <div class="flex justify-between">
                        <span>Service fee:</span>
                        <span class="font-medium">${{ totalPrice }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span>Platform fee:</span>
                        <span class="font-medium">${{ serviceFee }}</span>
                      </div>
                      <div class="flex justify-between font-semibold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>${{ totalAmount }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button @click="closeBookingModal" class="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button 
              @click="proceedToCheckout"
              :disabled="!selectedDate || !selectedTime"
              class="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div v-if="isCheckoutModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-gray-900">Confirm Booking</h2>
            <button @click="isCheckoutModalOpen = false" class="p-2 hover:bg-gray-100 rounded-lg">
              <Icon name="material-symbols:close" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- Booking Summary -->
          <div class="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Service:</span>
                <span class="font-medium">{{ service.title }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Provider:</span>
                <span class="font-medium">{{ provider.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Date:</span>
                <span class="font-medium">{{ formatDate(selectedDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Time:</span>
                <span class="font-medium">{{ formatTime(selectedTime) }}</span>
              </div>
              <div v-if="service.priceType === 'hourly'" class="flex justify-between">
                <span class="text-gray-600">Duration:</span>
                <span class="font-medium">{{ selectedDuration }} hours</span>
              </div>
              <div v-if="bookingNotes" class="flex justify-between">
                <span class="text-gray-600">Notes:</span>
                <span class="font-medium">{{ bookingNotes }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Summary -->
          <div class="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Service fee:</span>
                <span>${{ totalPrice }}</span>
              </div>
              <div class="flex justify-between">
                <span>Platform fee:</span>
                <span>${{ serviceFee }}</span>
              </div>
              <div class="border-t pt-2 mt-2">
                <div class="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span>${{ totalAmount }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div class="space-y-3">
              <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="card" checked class="text-blue-600">
                <Icon name="material-symbols:credit-card" class="w-5 h-5 text-gray-600" />
                <span>Credit/Debit Card</span>
              </label>
              <label class="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="paypal" class="text-blue-600">
                <Icon name="material-symbols:account-balance-wallet" class="w-5 h-5 text-gray-600" />
                <span>PayPal</span>
              </label>
            </div>
          </div>

          <!-- Terms -->
          <div class="mb-6">
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" class="mt-1 text-blue-600" required>
              <span class="text-sm text-gray-600">
                I agree to the <a href="#" class="text-blue-600 hover:underline">Terms of Service</a> and 
                <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          <div class="flex justify-end gap-3">
            <button @click="isCheckoutModalOpen = false" class="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button 
              @click="confirmBooking"
              :disabled="isProcessingBooking"
              class="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Icon v-if="isProcessingBooking" name="material-symbols:progress-activity" class="w-5 h-5 mr-2 animate-spin" />
              {{ isProcessingBooking ? 'Processing...' : 'Confirm Booking' }}
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
}
</style> 