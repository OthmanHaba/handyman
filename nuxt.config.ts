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
    '@nuxtjs/i18n',
    ['@nuxtjs/google-fonts',
    {
      families: {
        Cairo: true,
        'Noto+Sans+Arabic': true,
      }
    }]
  ],
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ar', language: 'ar-SA', name: 'العربية', file: 'ar.json' }
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  googleFonts: {
    download: true,
    fontsDir: './fonts',
    families: {
      'Cairo': true,
      'Noto+Sans+Arabic': true,
    }
  }
})