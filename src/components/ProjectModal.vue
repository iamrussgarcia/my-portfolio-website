<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { Modal } from 'bootstrap'
import { store, shelfLabels } from '../store'

const modalEl = ref(null)
let modal

const project = computed(() => store.selectedProject)

onMounted(() => {
  modal = new Modal(modalEl.value)
  modalEl.value.addEventListener('hidden.bs.modal', () => { store.selectedProject = null })
})

onBeforeUnmount(() => modal?.dispose())

watch(project, (p) => {
  if (p) modal.show()
  else modal.hide()
})
</script>

<template>
  <div ref="modalEl" class="modal fade" id="projectModal" tabindex="-1" aria-labelledby="projectModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
      <div class="modal-content">
        <div class="modal-poster" :class="{ 'poster-title-card': project && !project.image }">
          <img v-if="project && project.image" :src="project.image" :alt="project.title" />
          <p v-else-if="project" class="poster-title">{{ project.shortTitle || project.title }}</p>
          <button type="button" class="btn-close btn-close-white modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <template v-if="project">
            <div class="modal-meta">
              <span class="badge-red">{{ project.tag }}</span>
              <span class="meta-match">{{ shelfLabels[project.shelf] }}</span>
            </div>
            <h3 id="projectModalTitle" class="modal-title-text">{{ project.title }}</h3>
            <p class="modal-tagline">{{ project.tagline }}</p>
            <p class="modal-desc">{{ project.description }}</p>
            <ul class="stack-list">
              <li v-for="s in project.stack" :key="s">{{ s }}</li>
            </ul>
            <a v-if="project.link" class="btn btn-play mt-3" :href="project.link" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-box-arrow-up-right"></i> <span>{{ project.linkLabel || 'Visit Project' }}</span>
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
