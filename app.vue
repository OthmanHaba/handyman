<script>

useHead({
  htmlAttrs: {
    lang: 'ar',
  }
})
</script>

<template>
  <div dir="rtl">
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
