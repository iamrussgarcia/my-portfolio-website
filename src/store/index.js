import { reactive } from 'vue'

// Small shared state so the navbar search can drive the tools filter,
// the project modal and the active nav section.
export const store = reactive({
  toolFilter: 'all',
  selectedProject: null,
  activeSection: 'landing',
  pulseKey: null // id of the element to highlight after a search jump
})

export const shelfLabels = {
  featured: 'Client & Capstone',
  bootcamp: 'Bootcamp Release'
}
