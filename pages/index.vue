<template>
  <v-navigation-drawer>
    <v-list>
      <v-list>
        <v-list-item>
          <v-switch v-model="show_stat_formulaire" color="primary" label="Statistiques de base"></v-switch>
        </v-list-item>
        <v-list-item>
          <v-switch v-model="show_swarmplot" color="primary" label="Swarmplot"></v-switch>
        </v-list-item>
        <v-list-item>
          <v-switch v-model="show_boxplot" color="primary" label="Boxplots"></v-switch>
        </v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>


  <div>
    <VFileInput v-model="files" label="Selectionner fichier"></VFileInput>
  </div>

  <div v-if="show_stat_formulaire">
    <Formulaire_stats_de_base v-bind:data="data_csv"></Formulaire_stats_de_base>
  </div>

  <div v-if="show_swarmplot">
    <Formulaire_swarmplot v-bind:data="data_csv" v-bind:colonnes="colonnes"></Formulaire_swarmplot>
  </div>

  <div v-if="show_boxplot">
    <Formulaire_boxplot v-bind:data="data_csv" v-bind:colonnes="colonnes"></Formulaire_boxplot>
  </div>


</template>

<script setup lang="ts">
import * as PaPa from 'papaparse';
import Formulaire_swarmplot from './components/formulaire_swarmplot.vue';
import Formulaire_boxplot from './components/formulaire_boxplot.vue';
import Formulaire_stats_de_base from './components/formulaire_stats_de_base.vue';

let show_stat_formulaire = ref(true)
let show_swarmplot = ref(false)
let show_boxplot = ref(false)


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
  console.log("file", csv_file);
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
