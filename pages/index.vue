<template>
  <div>
    <VFileInput v-model="files" label="Selectionner fichier"></VFileInput>
  </div>
  <div>
    Hello World!
    {{ files.values }}
  </div>
  <!-- <v-btn color="success" @click="goFunc">Go!</v-btn> -->

  <!-- <v-select v-model="ACP_selected_cols" :items="colonnes" label="Colonnes à analyser" multiple>
    <template v-slot:prepend-item>
      <v-list-item ripple @mousedown.prevent @click="toggle">
        <v-list-item-action>
          <v-icon :color="ACP_selected_cols.length > 0 ? 'indigo darken-4' : ''"></v-icon>
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
  <v-btn color="success" @click="post_ACP">ACP!</v-btn> -->

  <div> Swarm plot </div>

  <v-select v-model="swarmplot_nom_elem" :items="colonnes" label="Élément à analyser"> </v-select>
  <v-select v-model="swarmplot_nom_classifier" :items="colonnes" label="Catégorie à analyser"> </v-select>
  <v-btn color="success" @click="post_swarmplot">Swarmplot !</v-btn>
  <div v-if="img_swarmplot != ''">
    <img v-bind:src="`data:image/jpg;base64,${img_swarmplot}`" />
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

const runtimeConfig = useRuntimeConfig()
console.log("runtimeConfig.apiSecret", runtimeConfig.apiSecret)
console.log("runtimeConfig.backend_url_public", runtimeConfig.backend_url_public)
console.log("BACKEND_BASE_URL", process.env.BACKEND_BASE_URL)
const bck_end_base_url = process.env.BACKEND_BASE_URL;
const bck_end_base_url_ = runtimeConfig.backend_url_public;
const files = ref([]);
let colonnes = ref([""]);
let data_csv: any[] = [];
var filename = "";
let selected_list_elements = ref([""]);
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
  console.log("file", csv_file);
  let reader = new FileReader();
  reader.readAsText(csv_file);
  reader.onload = () => {
    const csv_string: string = reader.result as string;
    console.log("brrr", csv_string);
    const parser = PaPa.parse(csv_string, { delimiter: ";" });
    data_csv = PaPa.parse(csv_string, { delimiter: ";", header: true }).data;
    console.log(62, "hey now", parser.data[0]);
    console.log(62, "hey now", data_csv);
    colonnes.value = parser.data[0] as [string];
  }
}


// async function post_ACP() {
//   console.log("ACP !!!", data_csv[0]);
//   let datframe_json = data_csv.map(row => { return Object.fromEntries(Object.entries(row).filter(([k, v]) => Object.values(ACP_selected_cols.value).includes(k))) });
//   console.log(datframe_json);
//   const { res } = await useFetch('http://localhost:12751/EDA_swarmplot', {
//     method: 'POST',
//     // headers: {'Access-Control-Allow-Origin': "http://localhost:12751"},
//     body: {"dataframe": datframe_json},
//   });
//   console.log(res)
// }

let swarmplot_nom_elem = ref("");
let swarmplot_nom_classifier = ref("");
let img_swarmplot = ref("")
watch(img_swarmplot, () => {console.log("hello new img?")})

let selected_list_elements = ref([""]);
let boxplot_sum_element = ref("");
let img_boxplot = ref("")
watch(img_boxplot, () => {console.log("hello new box img?")})


async function post_swarmplot() {
  console.log("Swarmplot !!!", data_csv[0]);
  // let datframe_json = data_csv.map(row => { return Object.fromEntries(Object.entries(row).filter(([k, v]) => Object.values([swarmplot_nom_elem, swarmplot_nom_classifier].values).includes(k))) });
  // console.log("datframe_json", datframe_json);
  // const { data: res } = await useFetch(bck_end_base_url+'/EDASwarmPlot', {
  const { data: res } = await useFetch('http://127.0.0.1:3838'+'/EDASwarmPlot', {
    method: 'POST',
    body: {"dataframe": data_csv, "swarmplot_nom_classifier": swarmplot_nom_classifier, "swarmplot_nom_elem": swarmplot_nom_elem},
    onResponse({ request, response, options }) {
    // Process the response data
    // img_swarmplot = response
    // console.log("104 response", response);
    // console.log("104 response", response._data["fig"]);
    img_swarmplot.value = response._data["fig"];
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
  }
  });
  // console.log("res loool")
  // console.log(res.value)
  // console.log(res.value["fig"])
  // console.log("img_swarmplot", img_swarmplot)
  // img_swarmplot = res.value["fig"]
}

async function post_boxplot() {
  console.log("Boxplot !!!", data_csv[0]);
  // const { data: res } = await useFetch(bck_end_base_url+'/EDABoxPlot', {
  const { data: res } = await useFetch('http://127.0.0.1:3838'+'/EDABoxPlot', {
    method: 'POST',
    body: {"dataframe": data_csv, "list_elements": selected_list_elements, "boxplot_sum_element": boxplot_sum_element},
    onResponse({ request, response, options }) {
    img_boxplot.value = response._data["fig"];
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
  }
  });
}
</script>
