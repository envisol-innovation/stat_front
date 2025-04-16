<template>
  <div v-if="!storeNav.mode_spectro">
    <stats_page />
  </div>
  <div v-if="storeNav.mode_spectro">
    <Spectro_page />
  </div>

</template>

<script setup lang="ts">
import { useMyNavStore } from '~/stores/nav';
import stats_page from '~/components/stats_page.vue';
import Spectro_page from '~/components/spectro_page.vue';

const storeNav = useMyNavStore();
</script>
