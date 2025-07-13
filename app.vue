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

<style>

body {
  font-family: 'Cairo', sans-serif;
}
</style>
