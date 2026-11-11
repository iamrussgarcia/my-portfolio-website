<script setup>
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Projects from './components/Projects.vue'
import Tools from './components/Tools.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'
import TabBar from './components/TabBar.vue'
import ProjectModal from './components/ProjectModal.vue'
</script>

<template>
  <Navbar />
  <main>
    <Hero />
    <Projects />
    <Tools />
    <Contact />
  </main>
  <Footer />
  <TabBar />
  <ProjectModal />
</template>
