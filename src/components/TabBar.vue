<script setup>
import { store } from '../store'

const tabs = [
  { id: 'landing', label: 'Home', icon: 'bi-house-door-fill' },
  { id: 'projects', label: 'Projects', icon: 'bi-collection-play-fill' },
  { id: 'tools', label: 'Tools', icon: 'bi-tools' },
  { id: 'contact', label: 'Contact', icon: 'bi-envelope-fill' }
]
</script>

<template>
  <nav class="tabbar d-md-none" aria-label="Section navigation">
    <a v-for="t in tabs" :key="t.id" :href="`#${t.id}`" class="tab" :class="{ active: store.activeSection === t.id }">
      <i class="bi" :class="t.icon"></i><span>{{ t.label }}</span>
    </a>
  </nav>
</template>
