// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'ar', language: 'ar-SA' }
    ],
    defaultLocale: 'en',
  }
})