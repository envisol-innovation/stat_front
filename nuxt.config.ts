import 'dotenv/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },

  vuetify: {
    vuetifyOptions: {
      theme: {
        themes: {
          test_theme:{
            dark: true,
            colors: {
              primary: '#b71c1c'
            }
          },
          prod_theme:{
            dark: true,
            colors: {
              primary: '#84BC28'
            }
          }
          },
        defaultTheme: process.env.MODE=='prod'? 'prod_theme' : 'test_theme',
      }
    }
  },

  // modules: ["vuetify-nuxt-module", "@pinia/nuxt", "@nuxt/image"],
  modules: ["vuetify-nuxt-module", '@sidebase/nuxt-auth', "@pinia/nuxt", "@nuxt/image"],
  // modules: ["vuetify-nuxt-module", '@sidebase/nuxt-auth'],
  auth: {
    isEnabled: true,
    // disableServerSideAuth: false,
    originEnvKey: 'NUXT_AUTH_ORIGIN',
    baseURL: process.env.NUXT_AUTH_ORIGIN + '/api/auth',   // this must be updated for production and be app url + path to NuxtAuthHandler ALSO this path must be added to the Allowed callback url on auth0 manager
    provider: {
      type: 'authjs',
      defaultProvider: 'auth0',
      
    },
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
    }
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    // that's not really secret though, bc this rep is public!!!!!!
    apiSecret: '123',
    authsecret: process.env.AUTH0_SECRET,
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: '/api',
      backend_url_public: process.env.BACKEND_BASE_URL,
      mode: process.env.MODE,
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
    },
    privateRuntimeConfig: {
      backend_url: process.env.BACKEND_BASE_URL
    }
  }
})