<script>

useHead({
  htmlAttrs: {
    lang: 'ar',
    dir: 'rtl'
  }
})
</script>

<template>
  <div>
    <ClientOnly>
      <NuxtRouteAnnouncer />
      <!-- <NuxtWelcome /> -->
      <NuxtPage />
    </ClientOnly>
  </div>
</template>
