<template>
  <div>
    <VFileInput v-model="files" label="Selectionner fichier"></VFileInput>
  </div>
  <div>
    Hello World!
    {{ files.values }}
  </div>

  <div>
    <Stats_de_base v-bind:data="data_csv"></Stats_de_base>
  </div>

  <div>
    <Swarmplot_formulaire v-bind:data="data_csv" v-bind:colonnes="colonnes"></Swarmplot_formulaire>
  </div>

  <div>
    <Formulaire_boxplot v-bind:data="data_csv" v-bind:colonnes="colonnes"></Formulaire_boxplot>
  </div>


</template>

<script setup lang="ts">
import * as PaPa from 'papaparse';
import Stats_de_base from './components/stats_de_base.vue';
import Swarmplot_formulaire from './components/swarmplot_formulaire.vue';
import Formulaire_boxplot from './components/formulaire_boxplot.vue';

const runtimeConfig = useRuntimeConfig()
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;
console.log("bck_end_base_url_ runtimeConfig.backend_url_public", bck_end_base_url_)
const files = ref([]);
let colonnes = ref([""]);
let data_csv = ref([]);
var filename = "";
var data = ref();
watch(files, Read_File);


function Read_File() {

  const csv_file = files.value[0];
  // console.log("file", csv_file);
  let reader = new FileReader();
  reader.readAsText(csv_file);
  reader.onload = () => {
    const csv_string: string = reader.result as string;
    const parser = PaPa.parse(csv_string, { delimiter: ";" });
    data_csv.value = PaPa.parse(csv_string, { delimiter: ";", header: true }).data;
    colonnes.value = parser.data[0] as [string];
  }
}

</script>
