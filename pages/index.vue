<template>
  <div v-if="!storeNav.mode_spectro">
    <stats_pages />
  </div>
  <div v-if="storeNav.mode_spectro">
    <spectro />
  </div>

</template>

<script setup lang="ts">
import { useMyNavStore } from '~/stores/nav';
import stats_pages from '~/components/stats_page.vue';
import spectro from '~/components/spectro_page.vue';

const storeNav = useMyNavStore();
</script>
