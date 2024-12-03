<template>
  <h1> Swarmplot </h1>

  <v-select v-model="swarmplot_nom_elem" :items="store.colonnes" label="Élément à analyser"> </v-select>
  <v-select v-model="swarmplot_nom_classifier" :items="store.colonnes" label="Catégorie à analyser"> </v-select>
  <v-btn color="primary" @click="post_swarmplot">Swarmplot !</v-btn>

  <div v-if="status_post">
    <v-progress-circular v-if="status_post.value == 'pending'" color="green" indeterminate
      size="50"></v-progress-circular>
  </div>

  <div v-if="img_swarmplot != '' && status_post.value != 'pending'">
    <NuxtImg sizes="sm:600px md:760px lg:1200px xl:1200px" v-bind:src="`data:image/jpg;base64,${img_swarmplot}`" />
  </div>

</template>

<script setup lang="ts">
// import { NuxtImg } from '#build/components';
import { useMyData_and_resultsStore, Resultat } from '#build/imports';


const store = useMyData_and_resultsStore();

const runtimeConfig = useRuntimeConfig();
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;

const endpoint_name = "/EDASwarmPlot"

// Todo: use this to init form with previous results
// const init_swarmplot_params = store.get_relevant_resultat(endpoint_name).parameters ;


let swarmplot_nom_elem = ref("");
let swarmplot_nom_classifier = ref("");
let img_swarmplot = ref("");

let status_post = ref();


async function post_swarmplot() {
  const { data: res, status } = await useFetch(bck_end_base_url_ + endpoint_name, {
    method: 'POST',
    body: { "dataframe": store.data_csv, "nom_classifier": swarmplot_nom_classifier, "nom_elem": swarmplot_nom_elem },
    onResponse({ request, response, options }) {
      img_swarmplot.value = response._data["fig"];
      const res = new Resultat(
        endpoint_name,
        { "nom_classifier": swarmplot_nom_classifier, "nom_elem": swarmplot_nom_elem },
        response._data["fig"],
        response._data["name_fig"]
      );
      store.add_result(res)
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
    }
  });
  status_post.value = status

};


watch(() => store.data_csv, () => { reset_everything() });

function reset_everything() {
  swarmplot_nom_elem.value = "";
  swarmplot_nom_classifier.value = "";
  img_swarmplot.value = "";
}

// Todo: update this :
// function initialize_form() {
//   if(img_swarmplot.value = "") {
//     try {
//       const previous_res = store.get_relevant_resultat(endpoint_name);
//       swarmplot_nom_elem.value = previous_res.parameters["nom_elem"];
//       swarmplot_nom_classifier.value = previous_res.parameters["nom_classifier"];
//       img_swarmplot.value = previous_res.result;
//     }
//   }     
// }

</script>
