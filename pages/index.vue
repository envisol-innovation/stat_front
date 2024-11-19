<template>
  <div>
    <VFileInput v-model="files" label="Selectionner fichier"></VFileInput>
  </div>
  <div>
    Hello World!
    {{ files.values }}
  </div>

  <div> Statistiques de base</div>
  <Stats_de_base :data="data_csv"></Stats_de_base>
  <!-- <div>
    <v-btn color="success" @click="post_stats_de_base">  </v-btn>
  </div>
  <div v-if="json_table_basic_stats != undefined">
    <v-data-table :items="json_table_basic_stats"></v-data-table>
  </div> -->

  <div>
    <Swarmplot_formulaire :data="data_csv"></Swarmplot_formulaire>
  </div>


  <div> Box plot </div>
  
  <!-- <v-select v-model="list_elements" :items="colonnes" label="Éléments à analyser"> </v-select> -->
  <v-select v-model="boxplot_sum_element" :items="colonnes" label="Somme du type d'éléments à analyser"> </v-select>
  <v-select v-model="selected_list_elements" :items="colonnes" label="Éléments à analyser" multiple>
    <template v-slot:prepend-item>
      <v-list-item @click="toggle">
        <v-list-item-action>
          <v-icon :color="selected_list_elements.length > 0 ? 'indigo darken-4' : ''"></v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            Selectionner tous
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template>
  </v-select>
  <v-btn color="success" @click="post_boxplot">Boxplot !</v-btn>
  <div v-if="img_boxplot != ''">
    <img v-bind:src="`data:image/jpg;base64,${img_boxplot}`" />
  </div>
</template>

<script setup lang="ts">
import * as PaPa from 'papaparse';
import Stats_de_base from './components/stats_de_base.vue';
import Swarmplot_formulaire from './components/swarmplot_formulaire.vue';

const runtimeConfig = useRuntimeConfig()
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;
console.log("bck_end_base_url_ runtimeConfig.backend_url_public", bck_end_base_url_)
const files = ref([]);
let colonnes = ref([""]);
let data_csv = ref([]);
var filename = "";
let selected_list_elements = ref([]);
var data = ref();
watch(files, Read_File);

function toggle() {
  if (selected_list_elements.value.length == colonnes.value.length) {
    selected_list_elements.value = []
  } else {
    selected_list_elements.value = colonnes.value.slice()
  }
}

function Read_File() {
  console.log("file");
  console.log("file", files);

  const csv_file = files.value[0];
  // console.log("file", csv_file);
  let reader = new FileReader();
  reader.readAsText(csv_file);
  reader.onload = () => {
    const csv_string: string = reader.result as string;
    // console.log("brrr", csv_string);
    const parser = PaPa.parse(csv_string, { delimiter: ";" });
    data_csv.value = PaPa.parse(csv_string, { delimiter: ";", header: true }).data;
    // console.log(62, "hey now", parser.data[0]);
    // console.log(62, "hey now", data_csv);
    colonnes.value = parser.data[0] as [string];
  }
}


// let json_table_basic_stats = ref([]);

// async function post_stats_de_base() {
//   const { data: res } = await useFetch(bck_end_base_url_+'/BasicStatistics', {
//   // const { data: res } = await useFetch('http://127.0.0.1:3838'+'/EDASwarmPlot', {
//     method: 'POST',
//     body: {"dataframe": data_csv},
//     onResponse({ request, response, options }) {
//       json_table_basic_stats.value = response._data;
//     },
//     onResponseError({ request, response, options }) {
//       console.log(116, "this bugged:", response)
//       // Handle the response errors
//     }
//   });
// }

// let swarmplot_nom_elem = ref("");
// let swarmplot_nom_classifier = ref("");
// let img_swarmplot = ref("")



// async function post_swarmplot() {
//   console.log("Swarmplot !!!", data_csv[0]);
//   const { data: res } = await useFetch(bck_end_base_url_+'/EDASwarmPlot', {
//     method: 'POST',
//     body: {"dataframe": data_csv, "nom_classifier": swarmplot_nom_classifier, "nom_elem": swarmplot_nom_elem},
//     onResponse({ request, response, options }) {
//     img_swarmplot.value = response._data["fig"];
//     },
//     onResponseError({ request, response, options }) {
//       // Handle the response errors
//   }
//   });
// }



let boxplot_sum_element = ref("");
let img_boxplot = ref("")

async function post_boxplot() {
  console.log("Boxplot !!!", data_csv.value[0]);
  const { data: res } = await useFetch(bck_end_base_url_+'/EDABoxPlot', {
    method: 'POST',
    body: {"dataframe": data_csv, "list_elements": selected_list_elements, "sum_element": boxplot_sum_element},
    onResponse({ request, response, options }) {
      img_boxplot.value = response._data["fig"];
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
  }
  });
}
</script>
