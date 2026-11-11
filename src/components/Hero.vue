<script setup>
const stacks = ['MERN', 'Laravel', 'Vue.js']
</script>

<template>
  <section id="landing" class="hero">
    <div class="hero-scrim"></div>
    <div class="container-xl hero-content">
      <div class="hero-kicker">
        <span class="badge-red">Portflix Original</span>
        <span class="kicker-text">Software Engineer's Cut</span>
      </div>

      <h1 class="hero-name">Russ Peter Garcia</h1>
      <p class="hero-title">
        <span class="hero-role" id="full-stack">Full Stack Web Developer</span>
        <span class="hero-divider">&amp;</span>
        <span class="hero-role" id="software-engineer">Software Engineer</span>
      </p>

      <div class="hero-meta">
        <span class="meta-match">Now Streaming</span>
        <span v-for="s in stacks" :key="s" class="chip-outline">{{ s }}</span>
        <span class="chip-outline chip-gold"><i class="bi bi-trophy-fill"></i> Best Capstone 1st Runner-Up</span>
      </div>

      <p class="hero-desc">
        I build full-stack web applications end to end — from RESTful APIs and role-based dashboards to booking
        engines, CMS platforms, and offline-first PWAs. Every release on this page ships with secure authentication,
        real data, and a UI people actually enjoy using.
      </p>

      <div class="hero-cta">
        <a href="#projects" class="btn btn-play"><i class="bi bi-play-fill"></i> Play Reel / View Work</a>
        <a href="#contact" class="btn btn-info-glass"><i class="bi bi-info-circle"></i> Spec Sheet &amp; Direct Hire</a>
      </div>
    </div>

    <div class="container-xl">
      <div class="status-banner">
        <span class="status-dot"></span>
        <span class="status-text">Available for Full-Time &amp; Freelance Roles • Remote / Hybrid</span>
        <span class="status-tag">Open</span>
      </div>
    </div>
  </section>
</template>
