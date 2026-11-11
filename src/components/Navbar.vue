<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { store, shelfLabels } from '../store'
import projects from '../data/projects.json'
import toolGroups from '../data/tools.json'
import sections from '../data/sections.json'

const links = [
  { id: 'landing', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'tools', label: 'Tools' },
  { id: 'contact', label: 'Contact' }
]

const scrolled = ref(false)
const open = ref(false)
const query = ref('')
const active = ref(-1)
const inputEl = ref(null)
const toggleEl = ref(null)
const wrapEl = ref(null)

// ---------- search index (built once from the JSON data) ----------
const index = [
  ...sections.map((s) => ({
    group: 'Sections', title: s.title, sub: s.sub, icon: s.icon,
    text: `${s.sub} ${s.keywords}`, target: s.id
  })),
  ...projects.map((p) => ({
    group: 'Projects', title: p.shortTitle || p.title,
    sub: `${p.tag} • ${shelfLabels[p.shelf]}`, image: p.image,
    text: [p.title, p.tag, p.tagline, p.description, p.stack.join(' ')].join(' '),
    projectId: p.id
  })),
  ...toolGroups.flatMap((g) =>
    g.tools.map((t) => ({
      group: 'Tools', title: t.name, sub: g.title,
      image: t.img ? `/images/tools/${t.img}` : null, logo: true,
      icon: 'bi-send-fill', text: g.title, toolName: t.name
    }))
  )
]

function score(item, terms) {
  const title = item.title.toLowerCase()
  // sub is left out on purpose: a shelf label like "Client & Capstone"
  // would otherwise make every card match "capstone"
  const haystack = `${item.title} ${item.text}`.toLowerCase()
  let total = 0
  for (const term of terms) {
    if (title.startsWith(term)) total += 3
    else if (title.includes(term)) total += 2
    else if (haystack.includes(term)) total += 1
    else return 0
  }
  return total
}

const terms = computed(() => query.value.trim().toLowerCase().split(/\s+/).filter(Boolean))

// grouped results, groups ordered by their best match; `flat` keeps keyboard order
const results = computed(() => {
  if (!terms.value.length) return { groups: [], flat: [] }
  const scored = index
    .map((item) => ({ item, s: score(item, terms.value) }))
    .filter((m) => m.s > 0)
    .sort((a, b) => b.s - a.s)

  const order = []
  scored.forEach((m) => { if (!order.includes(m.item.group)) order.push(m.item.group) })

  const flat = []
  const groups = order.map((name) => {
    const items = scored.filter((m) => m.item.group === name).slice(0, 6).map((m) => m.item)
    items.forEach((item) => flat.push(item))
    return { name, items }
  })
  return { groups, flat }
})

const showResults = computed(() => open.value && terms.value.length > 0)

function posOf(item) {
  return results.value.flat.indexOf(item)
}

function highlight(text) {
  const term = terms.value[0]
  const at = term ? text.toLowerCase().indexOf(term) : -1
  if (at < 0) return [{ text, mark: false }]
  return [
    { text: text.slice(0, at), mark: false },
    { text: text.slice(at, at + term.length), mark: true },
    { text: text.slice(at + term.length), mark: false }
  ]
}

function pulse(id) {
  store.pulseKey = null
  nextTick(() => {
    store.pulseKey = id
    setTimeout(() => { if (store.pulseKey === id) store.pulseKey = null }, 1500)
  })
}

async function go(item) {
  closeSearch()
  if (item.target) {
    document.getElementById(item.target).scrollIntoView({ behavior: 'smooth' })
  } else if (item.projectId !== undefined) {
    const id = `project-card-${item.projectId}`
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    pulse(id)
  } else if (item.toolName) {
    store.toolFilter = 'all' // make sure the tool's category isn't hidden
    await nextTick()
    const id = `tool-${item.toolName}`
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    pulse(id)
  }
}

function openSearch() {
  open.value = true
  nextTick(() => inputEl.value?.focus())
}

function closeSearch() {
  open.value = false
  query.value = ''
  active.value = -1
  inputEl.value?.blur()
}

function onToggle() {
  if (open.value) inputEl.value?.focus()
  else openSearch()
}

function setActive(pos) {
  const n = results.value.flat.length
  if (!n) return
  active.value = (pos + n) % n
  nextTick(() => document.getElementById(`search-opt-${active.value}`)?.scrollIntoView({ block: 'nearest' }))
}

function onKeydown(e) {
  if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active.value + 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active.value - 1) }
  else if (e.key === 'Enter') {
    e.preventDefault()
    const flat = results.value.flat
    if (flat.length) go(flat[Math.max(active.value, 0)])
  } else if (e.key === 'Escape') {
    closeSearch()
    toggleEl.value?.focus()
  }
}

// ---------- global listeners ----------
let observer
function onScroll() { scrolled.value = window.scrollY > 40 }
function onDocClick(e) {
  if (open.value && wrapEl.value && !wrapEl.value.contains(e.target)) closeSearch()
}
function onDocKey(e) {
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)
  if (e.key === '/' && !typing) { e.preventDefault(); openSearch() }
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onDocKey)

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) store.activeSection = entry.target.id
    })
  }, { rootMargin: '-45% 0px -50% 0px' })
  links.forEach((l) => {
    const s = document.getElementById(l.id)
    if (s) observer.observe(s)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onDocKey)
  observer?.disconnect()
})
</script>

<template>
  <nav class="navbar navbar-expand fixed-top site-nav" :class="{ scrolled }" aria-label="Main navigation">
    <div class="container-xl">
      <a class="navbar-brand brand" href="#landing">Portflix</a>

      <ul class="navbar-nav me-auto d-none d-md-flex nav-links">
        <li v-for="l in links" :key="l.id" class="nav-item">
          <a class="nav-link" :class="{ active: store.activeSection === l.id }" :href="`#${l.id}`">{{ l.label }}</a>
        </li>
      </ul>

      <div class="d-flex align-items-center gap-3 ms-auto">
        <div ref="wrapEl" class="nav-search" :class="{ open }">
          <button ref="toggleEl" type="button" class="nav-icon search-toggle" aria-label="Search this page"
            :aria-expanded="open" aria-controls="searchInput" @click="onToggle">
            <i class="bi bi-search"></i>
          </button>
          <input ref="inputEl" id="searchInput" v-model="query" type="search" class="search-input"
            placeholder="Projects, tools, sections..." autocomplete="off" role="combobox"
            aria-label="Search projects, tools, and sections" :aria-expanded="showResults"
            aria-controls="searchResults" aria-autocomplete="list"
            :aria-activedescendant="active >= 0 ? `search-opt-${active}` : undefined"
            @input="active = -1" @keydown="onKeydown" />
          <button type="button" class="search-clear" aria-label="Close search" @click="closeSearch">
            <i class="bi bi-x-lg"></i>
          </button>
          <ul id="searchResults" class="search-results" :class="{ show: showResults }" role="listbox"
            aria-label="Search results">
            <li v-if="showResults && !results.flat.length" class="search-empty">No matches for "{{ query.trim() }}"</li>
            <template v-for="g in results.groups" :key="g.name">
              <li class="search-group" role="presentation">{{ g.name }}</li>
              <li v-for="item in g.items" :id="`search-opt-${posOf(item)}`" :key="g.name + item.title"
                class="search-item" :class="{ active: posOf(item) === active }" role="option"
                :aria-selected="posOf(item) === active" @mousedown.prevent="go(item)">
                <img v-if="item.image" class="search-thumb" :class="{ 'is-logo': item.logo }" :src="item.image" alt="" />
                <span v-else class="search-icon"><i class="bi" :class="item.icon"></i></span>
                <span class="search-text">
                  <span class="search-title">
                    <template v-for="(part, i) in highlight(item.title)" :key="i">
                      <mark v-if="part.mark">{{ part.text }}</mark><template v-else>{{ part.text }}</template>
                    </template>
                  </span>
                  <span class="search-sub">{{ item.sub }}</span>
                </span>
              </li>
            </template>
          </ul>
        </div>

        <img src="/images/avatar.webp" alt="Russ Peter Garcia" class="nav-avatar" width="32" height="32" />
        <a href="/Resume_Garcia-Russ-Peter.pdf" class="resume-btn" download="Resume_Garcia-Russ-Peter.pdf"
          aria-label="Download resume (PDF)">
          <i class="bi bi-download" aria-hidden="true"></i>
          <span class="d-none d-sm-inline">Resume</span>
        </a>
      </div>
    </div>
  </nav>
</template>
