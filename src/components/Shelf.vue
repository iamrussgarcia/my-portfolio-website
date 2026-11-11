<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ProjectCard from './ProjectCard.vue'

defineProps({
  projects: { type: Array, required: true },
  ranked: { type: Boolean, default: false },
  headClass: { type: String, default: '' }
})

const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)

function update() {
  const t = track.value
  if (!t) return
  atStart.value = t.scrollLeft <= 2
  atEnd.value = t.scrollLeft >= t.scrollWidth - t.clientWidth - 2
}

function scrollShelf(dir) {
  const t = track.value
  t.scrollBy({ left: dir * t.clientWidth * 0.8, behavior: 'smooth' })
}

onMounted(() => {
  update()
  window.addEventListener('resize', update)
})
onBeforeUnmount(() => window.removeEventListener('resize', update))
</script>

<template>
  <div class="container-xl">
    <div class="shelf-head" :class="headClass">
      <div><slot name="head" /></div>
      <div class="shelf-arrows d-none d-md-flex">
        <button class="shelf-btn" type="button" aria-label="Scroll left" :disabled="atStart" @click="scrollShelf(-1)">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="shelf-btn" type="button" aria-label="Scroll right" :disabled="atEnd" @click="scrollShelf(1)">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
  <div ref="track" class="shelf-track" :class="{ 'fade-left': !atStart, 'fade-right': !atEnd }" @scroll.passive="update">
    <ProjectCard v-for="(p, i) in projects" :key="p.id" :project="p" :rank="ranked ? i + 1 : null" />
  </div>
</template>
