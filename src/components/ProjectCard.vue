<script setup>
import { store } from '../store'

defineProps({
  project: { type: Object, required: true },
  rank: { type: Number, default: null }
})
</script>

<template>
  <button :id="`project-card-${project.id}`" type="button" class="project-card"
    :class="{ 'search-hit': store.pulseKey === `project-card-${project.id}` }"
    :aria-label="`View details for ${project.title}`" @click="store.selectedProject = project">
    <div class="poster" :class="{ 'poster-title-card': !project.image }">
      <img v-if="project.image" :src="project.image" :alt="project.title" loading="lazy" width="640" height="360" />
      <p v-else class="poster-title">{{ project.shortTitle || project.title }}</p>
      <span class="n-badge">N</span>
      <span v-if="project.flag" class="poster-flag" :class="{ 'flag-award': project.flag === 'Award Winner' }">{{ project.flag }}</span>
      <span v-if="rank" class="rank">{{ rank }}</span>
    </div>
    <div class="card-body-p">
      <span class="card-genre">{{ project.tag }}</span>
      <h3 class="card-title">{{ project.shortTitle || project.title }}</h3>
      <p class="card-tagline">{{ project.tagline }}</p>
      <div class="card-foot">
        <ul class="stack-list">
          <li v-for="s in project.stack" :key="s">{{ s }}</li>
        </ul>
        <span class="play-dot"><i class="bi bi-play-fill"></i></span>
      </div>
    </div>
  </button>
</template>
