<template>
    <h1> Swarmplot </h1>

    <v-select v-model="swarmplot_nom_elem" :items="props_from_parent.colonnes" label="Élément à analyser"> </v-select>
    <v-select v-model="swarmplot_nom_classifier" :items="props_from_parent.colonnes" label="Catégorie à analyser"> </v-select>
    <v-btn color="success" @click="post_swarmplot">Swarmplot !</v-btn>


    <div v-if="status_post">
      <v-progress-circular v-if="status_post.value == 'pending'"
        color="green"
        indeterminate
        size="50"
      ></v-progress-circular>
    </div>

    <div v-if="img_swarmplot != '' && status_post.value != 'pending'">
      <img v-bind:src="`data:image/jpg;base64,${img_swarmplot}`" />
    </div>

</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;


let props_from_parent = defineProps({
    data: {
        type: Array,
        required: true,
    },
    colonnes: {
      type: Array,
      required: true,
    }
});


let swarmplot_nom_elem = ref("");
let swarmplot_nom_classifier = ref("");
let img_swarmplot = ref("")

let status_post = ref();


async function post_swarmplot() {
  const { data: res, status } = await useFetch(bck_end_base_url_+'/EDASwarmPlot', {
    method: 'POST',
    body: {"dataframe": props_from_parent.data, "nom_classifier": swarmplot_nom_classifier, "nom_elem": swarmplot_nom_elem},
    onResponse({ request, response, options }) {
    img_swarmplot.value = response._data["fig"];
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
    }
  });
  status_post.value = status

}
</script>
