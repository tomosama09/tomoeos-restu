// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'TomoeOS - Restu Utomo Portfolio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Personal interactive OS portfolio of Restu Utomo - Graphic Designer, Videographer & Photographer.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icons/fci-display.svg' }
      ]
    }
  },
  css: ['~/assets/css/aero.css'],
  ssr: true
})
