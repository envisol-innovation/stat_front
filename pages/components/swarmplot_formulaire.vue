<template>
    <div> Swarmplot </div>

    <v-select v-model="swarmplot_nom_elem" :items="colonnes" label="Élément à analyser"> </v-select>
    <v-select v-model="swarmplot_nom_classifier" :items="colonnes" label="Catégorie à analyser"> </v-select>
    <v-btn color="success" @click="post_swarmplot">Swarmplot !</v-btn>
    <div v-if="img_swarmplot != ''">
      <img v-bind:src="`data:image/jpg;base64,${img_swarmplot}`" />
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

let swarmplot_nom_elem = ref("");
let swarmplot_nom_classifier = ref("");
let img_swarmplot = ref("")

let boxplot_sum_element = ref("");
let img_boxplot = ref("")


async function post_swarmplot() {
  const { data: res } = await useFetch(bck_end_base_url_+'/EDASwarmPlot', {
    method: 'POST',
    body: {"dataframe": data, "nom_classifier": swarmplot_nom_classifier, "nom_elem": swarmplot_nom_elem},
    onResponse({ request, response, options }) {
    img_swarmplot.value = response._data["fig"];
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
    }
  });
}


</script>
