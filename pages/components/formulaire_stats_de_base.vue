<template>
    <h1> Statistiques de base</h1>
    <div>
      <div v-if="status_post">
        <v-progress-circular v-if="status_post == 'pending'"
          color="green"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-btn color="success" @click="post_stats_de_base"> Statistiques de base </v-btn>
    </div>
    <div v-if="json_table_basic_stats != undefined && status_post && status_post.value != 'pending'">
      <v-data-table :items="json_table_basic_stats"></v-data-table>
    </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;

let status_post = ref("");

// This is definition of the parameters that parent component can pass to this component.
// The type definition should be one of these: String, Number, Boolean, Array, or Object
// If these need to be dynamic (if they change in the parent, they change in the child), they should be passed with the "v-bind" keyword (see index.vue)
// also in the child component (here) the prop needs to be accessed from the props_from_parent object
// for instance in the parent this component in used like this: <Stats_de_base v-bind:data="data_csv"></Stats_de_base>
let props_from_parent = defineProps({
    data: {
        type: Array,
        required: true,
    },
});


let json_table_basic_stats = ref([]);

async function post_stats_de_base() {
  const { data: res, status } = await useFetch(bck_end_base_url_+'/BasicStatistics', {
  // const { data: res } = await useFetch('http://127.0.0.1:3838'+'/EDASwarmPlot', {
    method: 'POST',
    body: {"dataframe": props_from_parent.data},
    onResponse({ request, response, options }) {
      json_table_basic_stats.value = response._data;
    },
    onResponseError({ request, response, options }) {
      console.log(116, "this bugged:", response)
      // Handle the response errors
    }
  });
  status_post.value = status.value
}

</script>