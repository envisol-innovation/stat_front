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

    <v-card>
      <v-card-text>
        <!-- Maybe this should be hidable? -->
        <h1>Bienvenue sur l'interface pour l'analyse exploratoire de données !</h1>
        Le fichier donné sera traité comme suit :<br>
        - "nd", "<" sont transformés en 0<br>
        - "na" et "-" sont considérés comme non analysé<br>
        Tout autre texte ("non analysé" par exemple) n'est pas pris en compte et faussera les résultats !<br>
      </v-card-text>
    </v-card>
  </div>

  <!-- <div>
    <VFileInput v-model="files" label="Selectionner fichier"></VFileInput>
  </div> -->

  <div>
    <File_import> </File_import>
  </div>

  <div v-if="show_stat_formulaire">
    <Formulaire_stats_de_base v-bind:data="store.data_csv"></Formulaire_stats_de_base>
  </div>

  <div v-if="show_swarmplot">
    <Formulaire_swarmplot v-bind:data="store.data_csv" v-bind:colonnes="store.colonnes"></Formulaire_swarmplot>
  </div>

  <div v-if="show_boxplot">
    <Formulaire_boxplot></Formulaire_boxplot>
  </div>


</template>

<script setup lang="ts">
import * as PaPa from 'papaparse';

import { useMyData_and_resultsStore } from '~/stores/data_and_results';

import Formulaire_swarmplot from './components/formulaire_swarmplot.vue';
import Formulaire_boxplot from './components/formulaire_boxplot.vue';
import Formulaire_stats_de_base from './components/formulaire_stats_de_base.vue';
import File_import from './components/file_import.vue';

const store = useMyData_and_resultsStore();

const runtimeConfig = useRuntimeConfig()
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;


// const files = ref([]);
// let colonnes = ref([""]);
// let data_csv = ref([]);
// var filename = "";
// var data = ref();
// watch(files, Read_File);

let show_stat_formulaire = ref(true)
let show_swarmplot = ref(false)
let show_boxplot = ref(false)

// function Read_File() {

//   const csv_file = files.value[0];
//   console.log("file", csv_file);
//   let reader = new FileReader();
//   reader.readAsText(csv_file);
//   reader.onload = () => {
//     const csv_string: string = reader.result as string;
//     const parser = PaPa.parse(csv_string, { delimiter: ";" });
//     data_csv.value = PaPa.parse(csv_string, { delimiter: ";", header: true }).data;
//     colonnes.value = parser.data[0] as [string];
//   }
// }

</script>
