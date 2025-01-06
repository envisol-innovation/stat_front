<template>
  <h1> Visualisation du modèle</h1>

  <v-select v-model="value_to_model" :items="store.colonnes" label="Composé à visualiser"> </v-select>
  <v-btn color="primary" @click="post_hrk_3Dmodelling"> Charger les données</v-btn>

  <div v-if="status_post">
    <v-progress-circular v-if="status_post === 'pending'"
      color="primary" size="50" width="12"
      indeterminate
    ></v-progress-circular>
  </div>

  <div v-if="status_post == 'error'">
      Erreur !
      Ceci est probablement du a la présence de texte dans les colonnes sélectionnées. Vérifiez si elles sont inclues dans les alertes ci dessus et corrigez le fichier d'entré en conséquence.
      <!-- Status = {{status_post}} {{ typeof(status_post.value) }} {{ status_post.value == 'pending' }} -->
    </div>

  <div v-if="img_visual != '' && status_post !== 'pending'">
    <h2> Résultat de visualisation</h2>
    <NuxtImg sizes="sm:600px md:760px lg:1200px xl:1200px" v-bind:src="`data:image/jpg;base64,${img_boxplot}`" />
    <!-- <v-data-table :headers="headers_from_back" :items="json_3Dmodelling_coordinates"></v-data-table> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMyData_and_resultsStore } from '#build/imports';
import * as PaPa from 'papaparse';

const runtimeConfig = useRuntimeConfig();
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;
const store = useMyData_and_resultsStore();
const endpoint_name = "/3Dmodelling_in2D" // ??? what name using in backend

const status_post = ref<string>('');

const value_to_model = ref("")
const init_visual = store.get_relevant_resultat(endpoint_name) ;
const img_visual = ref(init_visual.result)
const init_visual_params = init_visual.parameters ;
let headers_from_back = ref(init_visual_params.visual_element);
let json_3Dmodelling_coordinates = ref([]);
let props_from_parent = defineProps({
  data: {
      type: Array,
      required: true,
  },
});


async function post_hrk_3Dmodelling() {
const { data, status } = await useFetch(bck_end_base_url_ + endpoint_name, {
  method: 'POST',
  body: {"dataframe": store.data_csv}, // depends on the json from the back.
  // Hence necessity to work on the function to adapt json file as expected.
  onRequest({}) {
    status_post.value = "pending";
  },
  onResponse({ request, response, options }) {
    img_visual.value = response._data["fig"]
    const res = new Resultat(
        endpoint_name,
        { "visual_element": headers_from_back.value }, // depends on the json from the back
        response._data["fig"],
        response._data["name_fig"]
      )
    let colonnes_dict = response._data["colonnes_dict"];
    colonnes_dict = colonnes_dict.sort((a, b) => {return a.pos - b.pos})
    headers_from_back.value = colonnes_dict.map(({nv_nom, nom}) => {return {title: nv_nom, value: nom}});
    json_3Dmodelling_coordinates.value = response._data["list_stats"]

  },
  onResponseError({ request, response, options }) {
    console.log(116, "this bugged:", response)
    // Handle the response errors
  }
});
status_post.value = status.value
};

/**
* Download contents as a file
* Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
*/
function downloadBlob() {
const content = arrayToCsv(json_3Dmodelling_coordinates.value)
const filename = 'export_3Dmodelling.csv'
const contentType = 'text/csv;charset=utf-8;'

var blob = new Blob([content], { type: contentType });
var url = URL.createObjectURL(blob);

var pom = document.createElement('a');
pom.href = url;
pom.setAttribute('download', filename);
pom.click();
};


/**
* Convert a 2D array into a CSV string
*/
function arrayToCsv(data){
let unparsed_data = PaPa.unparse(data, {delimiter: ";"});
return unparsed_data
}

</script>