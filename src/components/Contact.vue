<script setup>
  import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
  import axios from 'axios'
  import { Notyf } from 'notyf'
  import 'notyf/notyf.min.css'

  const notyf = new Notyf()

  const WEB3FORMS_ACCESS_KEY = "3f4b210a-262c-4a98-af9b-79075fbbf15e";
  const SITE_KEY = "6Lf_jxouAAAAAIWI80N-l5oHjA4vap0WHtRfygAi";
  // The reCAPTCHA secret key must never live in frontend code; Web3Forms verifies the token server-side.

  const subject = "New message from Portfolio Contact Form";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  const form = reactive({ name: '', email: '', scope: '', timeline: 'Immediate', message: '' })
  const submitted = ref(false) // show validation feedback after first submit attempt
  const sending = ref(false)
  const success = ref(false)

  const scopes = ['Full Stack Web App', 'Frontend / UI Build', 'Backend / REST API', 'Full-Time Role']
  const timelines = ['Immediate', 'Within 1 month', '1–3 months', 'Flexible']

  const errors = () => ({
    name: form.name.trim().length < 2,
    email: !emailPattern.test(form.email.trim()),
    scope: !form.scope,
    message: form.message.trim().length < 10
  })

  async function handleSubmit() {
    success.value = false
    submitted.value = true
    if (Object.values(errors()).some(Boolean)) return

    if (!recaptchaToken.value) {
      notyf.error('Please complete the reCAPTCHA.')
      return
    }

    sending.value = true
    try {
      const response = await axios.post("https://api.web3forms.com/submit", {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: subject,
        name: form.name,
        email: form.email,
        scope: form.scope,
        timeline: form.timeline,
        message: form.message,
        'g-recaptcha-response': recaptchaToken.value,
      }, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (response.data.success) {
        notyf.success('Message Sent!')
        Object.assign(form, { name: '', email: '', scope: '', timeline: 'Immediate', message: '' })
        submitted.value = false
        success.value = true
      } else {
        notyf.error('An error occurred. Please try again.')
      }
    } catch (error) {
      const reason = error.response?.data?.message
      console.error('Web3Forms error:', error.response?.data || error)
      notyf.error(reason || 'Failed to send message.')
    } finally {
      sending.value = false
      resetRecaptcha()
    }
  }

  const recaptchaContainer = ref(null);
    const recaptchaWidgetId = ref(null);
    const recaptchaToken = ref('');

    // Callback called by reCAPTCHA when successful
    function onRecaptchaSuccess(token) {
        recaptchaToken.value = token;
    }

    // Callback when expired
    function onRecaptchaExpired() {
        recaptchaToken.value = '';
    }

    // Function to render the reCAPTCHA widget
    function renderRecaptcha() {
        if (!window.grecaptcha) {
            console.error('reCAPTCHA not loaded');
            return;
        }

        recaptchaWidgetId.value = window.grecaptcha.render(recaptchaContainer.value, {
            sitekey: SITE_KEY,
            size: 'normal', // or 'compact'
            callback: onRecaptchaSuccess,
            'expired-callback': onRecaptchaExpired,
        });
    }

    // Function to reset reCAPTCHA 
    function resetRecaptcha() {
        if (recaptchaWidgetId.value !== null) {
            window.grecaptcha.reset(recaptchaWidgetId.value);
            recaptchaToken.value = '';
        }
    }

    onMounted(() => {
        // Wait for the Google reCAPTCHA library to load, then render the widget
        const interval = setInterval(() => {
            if (window.grecaptcha && window.grecaptcha.render) {
                clearInterval(interval);
                renderRecaptcha();
            }
        }, 100);

        onBeforeUnmount(() => clearInterval(interval));
    });
</script>

<template>
  <section id="contact" class="section-block">
    <div class="container-xl">
      <div class="contact-panel">
        <div class="row g-4 g-lg-5 align-items-start">
          <div class="col-lg-6">
            <p class="eyebrow"><span class="badge-red">Episode / Dispatch</span> • Direct Transmission</p>
            <h2 class="contact-title">Direct Stream // Production Inquiries</h2>
            <p class="contact-lead">
              Have a product to build, an API to document, or a dashboard to ship? Send a brief and let's talk about
              your next release.
            </p>

            <div class="profile-card">
              <img src="/images/avatar.webp" alt="Russ Peter Garcia" width="56" height="56" loading="lazy" />
              <div>
                <p class="profile-status"><span class="status-dot"></span> Available for new engagements</p>
                <p class="profile-name">Russ Peter Garcia — Software Engineer</p>
                <p class="profile-loc">Metro Manila / Remote Worldwide</p>
              </div>
            </div>

            <div class="row g-3 mt-1">
              <div class="col-6">
                <div class="mini-card">
                  <p class="mini-label">Open To</p>
                  <p class="mini-value">Full-Time</p>
                  <p class="mini-sub text-green"><i class="bi bi-check2"></i> Freelance too</p>
                </div>
              </div>
              <div class="col-6">
                <div class="mini-card">
                  <p class="mini-label">Work Setup</p>
                  <p class="mini-value">Remote</p>
                  <p class="mini-sub text-blue"><i class="bi bi-lightning-charge-fill"></i> Hybrid ready</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <form class="contact-form" :class="{ 'was-validated': submitted }" novalidate @submit.prevent="handleSubmit">
              <div class="form-head">
                <h3 class="form-title">Stream Contact Session</h3>
                <span class="form-tls">TLS 1.3 // Encrypted</span>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label for="cfName" class="form-label">Your Name / Organization</label>
                  <input id="cfName" v-model="form.name" type="text" class="form-control" name="name"
                    placeholder="e.g. Juan Dela Cruz, Acme Inc." required minlength="2" />
                  <div class="invalid-feedback">Please enter your name.</div>
                </div>
                <div class="col-md-6">
                  <label for="cfEmail" class="form-label">Contact Channel</label>
                  <input id="cfEmail" v-model="form.email" type="email" class="form-control" name="email"
                    placeholder="name@company.com" required
                    :class="{ 'is-invalid': submitted && errors().email }" />
                  <div class="invalid-feedback">Please enter a valid email.</div>
                </div>
                <div class="col-md-6">
                  <label for="cfScope" class="form-label">Production Scope</label>
                  <select id="cfScope" v-model="form.scope" class="form-select" name="scope" required>
                    <option value="" disabled>Select a scope</option>
                    <option v-for="s in scopes" :key="s">{{ s }}</option>
                  </select>
                  <div class="invalid-feedback">Please choose a scope.</div>
                </div>
                <div class="col-md-6">
                  <label for="cfTimeline" class="form-label">Target Release Window</label>
                  <select id="cfTimeline" v-model="form.timeline" class="form-select" name="timeline">
                    <option v-for="t in timelines" :key="t">{{ t }}</option>
                  </select>
                </div>
                <div class="col-12">
                  <label for="cfMessage" class="form-label">Mission Brief &amp; Stack Requirements</label>
                  <textarea id="cfMessage" v-model="form.message" class="form-control" name="message" rows="4"
                    placeholder="Outline deliverables, timeline, and tech stack constraints..." required
                    minlength="10"></textarea>
                  <div class="invalid-feedback">Please write at least 10 characters.</div>
                </div>
                <div class="col-12">
                  <div ref="recaptchaContainer"></div>
                </div>
                <div class="col-12">
                  <button type="submit" class="btn btn-transmit w-100" :disabled="sending">
                    <i class="bi bi-send-fill"></i> {{ sending ? 'Transmitting...' : 'Transmit Mission Brief' }}
                  </button>
                </div>
              </div>

              <div v-if="success" class="alert form-success mt-3 mb-0" role="status">
                <i class="bi bi-check-circle-fill"></i> Transmission received! Thanks — I'll get back to you soon.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
