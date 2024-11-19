<template>
    <div> Statistiques de base</div>
    <div>
      <v-btn color="success" @click="post_stats_de_base">  </v-btn>
    </div>
    <div v-if="json_table_basic_stats != undefined">
      <v-data-table :items="json_table_basic_stats"></v-data-table>
    </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;


let props_from_parent = defineProps({
    data: {
        type: [],
        required: true,
    },
});
let { data } = props_from_parent;


let json_table_basic_stats = ref([]);

async function post_stats_de_base() {
  const { data: res } = await useFetch(bck_end_base_url_+'/BasicStatistics', {
  // const { data: res } = await useFetch('http://127.0.0.1:3838'+'/EDASwarmPlot', {
    method: 'POST',
    body: {"dataframe": data},
    onResponse({ request, response, options }) {
      json_table_basic_stats.value = response._data;
    },
    onResponseError({ request, response, options }) {
      console.log(116, "this bugged:", response)
      // Handle the response errors
    }
  });
}

</script>