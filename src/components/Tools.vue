<script setup>
import { computed } from 'vue'
import { store } from '../store'
// Dynamically rendered from a local JSON file
import toolGroups from '../data/tools.json'

const filters = [
  { key: 'all', label: 'All' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'languages', label: 'Languages' },
  { key: 'databases', label: 'Databases' },
  { key: 'devtools', label: 'Dev Tools' }
]

const totalTools = computed(() => toolGroups.reduce((n, g) => n + g.tools.length, 0))
</script>

<template>
  <section id="tools" class="section-block">
    <div class="container-xl">
      <div class="shelf-head">
        <div>
          <p class="eyebrow"><span class="text-red">Dev Runtime</span> • Active Stack</p>
          <h2 class="section-title">Continue Watching: My Toolkit <i class="bi bi-terminal"></i></h2>
        </div>
        <p class="sessions-online d-none d-md-block">{{ totalTools }} tools online</p>
      </div>

      <div class="filter-row" role="group" aria-label="Filter tools by category">
        <button v-for="f in filters" :key="f.key" type="button" class="filter-chip"
          :class="{ active: store.toolFilter === f.key }" @click="store.toolFilter = f.key">
          {{ f.label }}
        </button>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        <div v-for="g in toolGroups" :key="g.category" class="col tool-group"
          :class="{ 'd-none': store.toolFilter !== 'all' && store.toolFilter !== g.category }">
          <article class="terminal">
            <header class="terminal-bar">
              <span class="dots"><i></i><i></i><i></i></span>
              <span class="terminal-file">{{ g.file }}</span>
              <span class="stage" :class="g.stageClass">{{ g.stage }}</span>
            </header>
            <p class="terminal-cmd"><span class="text-red">&gt;</span> {{ g.cmd }}</p>
            <h3 class="terminal-title">{{ g.title }}</h3>
            <ul class="tool-grid">
              <li v-for="t in g.tools" :id="`tool-${t.name}`" :key="t.name" class="tool-tile"
                :class="{ 'search-hit': store.pulseKey === `tool-${t.name}` }">
                <img v-if="t.img" :src="`/images/tools/${t.img}`" alt="" width="40" height="40" loading="lazy"
                  :class="t.cls" />
                <span v-else class="tool-icon-fallback"><i class="bi" :class="t.icon"></i></span>
                <span>{{ t.name }}</span>
              </li>
            </ul>
            <div class="terminal-progress"><span>{{ g.status }}</span><span>{{ g.count }}</span></div>
            <div class="progress-bar-track"><div class="progress-fill"></div></div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
