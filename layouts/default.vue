<template>
  <v-app>
    <v-app-bar color="primary">
      <div v-if="mode == 'dev'">
        Envisol test
      </div>
      <div v-else>
        <NuxtImg src="/2024_Logo_blanc_sans_site.png" height="60" contain ></NuxtImg>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="white" @click="lets_sign_out()">Déconnexion</v-btn>
      <!-- <div>
        You are currently {{ status }}.
      </div> -->
    </v-app-bar>

    <!-- <v-navigation-drawer>
      <v-list>
        <v-list-item>
          <v-btn>
            Statistiques de base
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn>
            Swarmplot
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn>
            Boxplots
          </v-btn>
        </v-list-item>
      </v-list>


      <div>
        You are currently {{ status }}.
      </div> -->

      <!-- <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
        </ul>
        <ul class="navbar-nav d-none d-md-block">
          <li v-if="!isAuthenticated && !isLoading" class="nav-item">
            <button
              id="qsLoginBtn"
              class="btn btn-primary btn-margin"
              @click="signIn"
            >Login</button>
          </li>

          <li class="nav-item dropdown" v-if="isAuthenticated">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="profileDropDown"
              data-toggle="dropdown"
            >
              <img
                :src="user.picture"
                alt="User's profile picture"
                class="nav-user-profile rounded-circle"
                width="50"
              />
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <div class="dropdown-header">{{ user.name }}</div>
              <router-link to="/profile" class="dropdown-item dropdown-profile">
                <font-awesome-icon class="mr-3" icon="user" />Profile
              </router-link>
              <a id="qsLogoutBtn" href="#" class="dropdown-item" @click.prevent="logout">
                <font-awesome-icon class="mr-3" icon="power-off" />Log out
              </a>
            </div>
          </li>
        </ul>

        <ul class="navbar-nav d-md-none" v-if="!isAuthenticated && !isLoading">
          <button id="qsLoginBtn" class="btn btn-primary btn-block" @click="login">Log in</button>
        </ul>

        <ul
          id="mobileAuthNavBar"
          class="navbar-nav d-md-none d-flex"
          v-if="isAuthenticated"
        >
          <li class="nav-item">
            <span class="user-info">
              <img
                :src="user.picture"
                alt="User's profile picture"
                class="nav-user-profile d-inline-block rounded-circle mr-3"
                width="50"
              />
              <h6 class="d-inline-block">{{ user.name }}</h6>
            </span>
          </li>
          <li>
            <font-awesome-icon icon="user" class="mr-3" />
            <router-link to="/profile">Profile</router-link>
          </li>

          <li>
            <font-awesome-icon icon="power-off" class="mr-3" />
            <a id="qsLogoutBtn" href="#" class @click.prevent="logout">Log out</a>
          </li>
        </ul>
      </div> -->
    <!-- </v-navigation-drawer> -->
    <v-main>
          <v-alert
            border="bottom"
            colored-border
            color="blue-grey"
            type="warning"
            elevation="2">
              Ces outils permettent de caractériser des signatures géochimiques et/ou l'impact de paramètres extérieurs (lithologies, profondeur)
              sur la distribution des polluants.<br>
              Il est nécessaire d'évaluer la pertinence des données utilisées : en particulier en fonction des zones à risques,
              de la présence de sources distinctes, etc.<br>
              Prenez le temps d'interpréter vos données au regard de ces éléments avant de réaliser les analyses statistiques.<br>
              Lors du calcul de signature géochimique par exemple, veillez notamment à n'inclure qu'une unique source de polluant dans vos données.
          </v-alert>
      <div v-if="status=='authenticated'"><NuxtPage /></div>
      <div v-else> <v-btn color="primary" block size="x-large" @click="lets_sign_in()">Connexion</v-btn> </div>
    </v-main>
  </v-app>
</template>


<script setup lang="ts">

const runtimeConfig = useRuntimeConfig()
const mode = runtimeConfig.public.mode;



const {
  status,
  data,
  lastRefreshedAt,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut
} = useAuth()

// await signIn("auth0")


async function lets_sign_in () {
  console.log("trying to sign in");
  await signIn("auth0", {}, {"prompt": "login"})
  // see:
  // https://github.com/sidebase/nuxt-auth/blob/main/src/runtime/composables/authjs/useAuth.ts
  // l65  : signIn(provider, options, authorizationParams)
  // authorizationParams let's you define how the app asks the user to login
  // setting prompt to login makes it always ask the login/password rather than automatically reconnecting previous user
}

async function lets_sign_out () {
  console.log("trying to sign in");
  await signOut()
}

</script>

