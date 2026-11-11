<script setup>
import { computed } from 'vue'
import Shelf from './Shelf.vue'
// Dynamically rendered from a local JSON file
import projects from '../data/projects.json'

const featured = computed(() => projects.filter((p) => p.shelf === 'featured'))
const bootcamp = computed(() => projects.filter((p) => p.shelf === 'bootcamp'))
</script>

<template>
  <section id="projects" class="section-block">
    <Shelf :projects="featured" ranked>
      <template #head>
        <p class="eyebrow"><span class="text-red">Streaming Charts</span> • Client &amp; Capstone</p>
        <h2 class="section-title">Top Projects This Week <i class="bi bi-graph-up-arrow text-red"></i></h2>
      </template>
    </Shelf>

    <Shelf :projects="bootcamp" head-class="mt-5">
      <template #head>
        <p class="eyebrow"><span class="text-red">Bootcamp</span> • Full Stack Releases</p>
        <h2 class="section-title">Bootcamp Releases</h2>
      </template>
    </Shelf>

    <div class="container-xl">
      <p class="swipe-hint d-md-none">Swipe <i class="bi bi-arrow-right"></i></p>
    </div>
  </section>
</template>
