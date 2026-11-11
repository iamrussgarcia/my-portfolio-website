<script setup>
const year = new Date().getFullYear()
const links = [
  { id: 'landing', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'tools', label: 'Tools' },
  { id: 'contact', label: 'Contact' }
]
</script>

<template>
  <footer class="site-footer">
    <div class="container-xl">
      <p class="footer-brand">
        <span class="brand">Portflix</span>
        <span class="footer-sub">Portfolio of Russ Peter Garcia</span>
      </p>
      <ul class="footer-links">
        <li v-for="l in links" :key="l.id"><a :href="`#${l.id}`">{{ l.label }}</a></li>
      </ul>
      <div class="footer-bottom">
        <span class="service-code">Service Code: RPG-2026</span>
        <span>&copy; {{ year }} Russ Peter Garcia. All rights reserved.</span>
      </div>
    </div>
  </footer>
</template>
