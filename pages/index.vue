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

  <v-select v-model="nom_elem" :items="colonnes" label="Élément à analyser"> </v-select>
  <v-select v-model="nom_classifier" :items="colonnes" label="Catégorie à analyser"> </v-select>
  <v-btn color="success" @click="post_swarplot">Swarmplot !</v-btn>
  <div v-if="img_swarplot != ''">
    <img v-bind:src="`data:image/jpg;base64,${img_swarplot}`" />
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
let ACP_selected_cols = ref([""]);
var data = ref()
watch(files, goFunc);

function toggle() {
  if (ACP_selected_cols.value.length == colonnes.value.length) {
    ACP_selected_cols.value = []
  } else {
    ACP_selected_cols.value = colonnes.value.slice()
  }
}

function goFunc() {
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

let nom_elem = ref("");
let nom_classifier = ref("");
let img_swarplot = ref("")
watch(img_swarplot, () => {console.log("hello new img?")})


async function post_swarplot() {
  console.log("Swarmplot !!!", data_csv[0]);
  // let datframe_json = data_csv.map(row => { return Object.fromEntries(Object.entries(row).filter(([k, v]) => Object.values([nom_elem, nom_classifier].values).includes(k))) });
  // console.log("datframe_json", datframe_json);
  // const { data: res } = await useFetch(bck_end_base_url+'/EDASwarmPlot', {
  const { data: res } = await useFetch('http://127.0.0.1:3838'+'/EDASwarmPlot', {
    method: 'POST',
    body: {"dataframe": data_csv, "nom_classifier": nom_classifier, "nom_elem": nom_elem},
    onResponse({ request, response, options }) {
    // Process the response data
    // img_swarplot = response
    // console.log("104 response", response);
    // console.log("104 response", response._data["fig"]);
    img_swarplot.value = response._data["fig"];
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
  }
  });
  // console.log("res loool")
  // console.log(res.value)
  // console.log(res.value["fig"])
  // console.log("img_swarplot", img_swarplot)
  // img_swarplot = res.value["fig"]
}
</script>
