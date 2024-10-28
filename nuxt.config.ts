
import 'dotenv/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },

  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark'
      }
    }
  },

  modules: ["vuetify-nuxt-module", '@sidebase/nuxt-auth'],
  auth: {
    isEnabled: true,
    // disableServerSideAuth: false,
    originEnvKey: 'NUXT_AUTH_ORIGIN',
    // baseURL: 'https://stats-envisol.netlify.app/api/auth',   // production path: must be added to the Allowed callback url on auth0 manager (with /callback/auth0 at the end)
    baseURL: 'http://localhost:3000/api/auth',   // this must be updated for production and be app url + path to NuxtAuthHandler ALSO this path must be added to the Allowed callback url on auth0 manager
    provider: {
      type: 'authjs',
      defaultProvider: 'auth0',
      
    },
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
    }
  }
})