<template>
  <MenusStatsNavDrawer />

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
  <div v-if="storeNav.show_stat_formulaire">
    <Formulaire_stats_de_base v-bind:data="store.data_csv"></Formulaire_stats_de_base>
  </div>
  <!-- <div v-if="storeNav.show_stat_formulaire">
    <FormulaireGeneralise name="swarmplot" endpoint_name="/EDASwarmPlot" :champs=list_champ_swarmplot :data="store.data_csv"></FormulaireGeneralise>
  </div> -->

  <div v-if="storeNav.show_swarmplot">
    <FormulaireGeneralise name="Swarmplot" endpoint_name="/EDASwarmPlot" :champs=list_champ_swarmplot store_name="MyData_and_resultsStore"></FormulaireGeneralise>
  </div>
  <div v-if="storeNav.show_boxplot">
    <FormulaireGeneralise name="Boxplot" endpoint_name="/EDABoxPlot" :champs=list_champ_boxplot store_name="MyData_and_resultsStore"></FormulaireGeneralise>
  </div>
  <div v-if="storeNav.show_freq_cum">
    <FormulaireGeneralise name="Fréquences cumulées" endpoint_name="/FreqCum" :champs=list_champ_freq_cum store_name="MyData_and_resultsStore"></FormulaireGeneralise>
  </div>
  <div v-if="storeNav.show_hist">
    <FormulaireGeneralise name="Histogramme" endpoint_name="/EDAHistogram" :champs=list_champ_histo store_name="MyData_and_resultsStore"></FormulaireGeneralise>
  </div>

</template>

<script setup lang="ts">

import { useMyData_and_resultsStore } from '~/stores/data_and_results';
import { useMyNavStore } from '~/stores/nav';
import Formulaire_stats_de_base from '~/components/formulaire_stats_de_base.vue';
import File_import from '~/components/file_import.vue';
import type { Champ } from './formulaire_generalise.vue';


const store = useMyData_and_resultsStore();
const storeNav = useMyNavStore();

const list_champ_histo : Ref<Array<Champ>> = ref([
  {label: "Élément à analyser", name: "nom_elem", type_of_champ: "col", default_value: ""},
  {label: "Concentrations séparées par un espace (ex. 0 200 1000) (si vide des valeurs automatiques seront déterminé)", name: "bins", type_of_champ: "num_list", default_value: ""},
  // {label: "Nombre d'étiquette d'échantillon à afficher", name: "number_of_samples_to_show", type_of_champ: "num", default_value: 0}
])
const list_champ_freq_cum : Ref<Array<Champ>> = ref([
  {label: "Élément à analyser", name: "nom_elem", type_of_champ: "col", default_value: ""},
  {label: "Colonne avec les noms d'échantillon", name: "nom_id_sample", type_of_champ: "col", default_value: ""},
  {label: "Nombre d'étiquette d'échantillon à afficher", name: "number_of_samples_to_show", type_of_champ: "num", default_value: 0}
])
const list_champ_swarmplot : Ref<Array<Champ>> = ref([
  {label: "Élément à analyser", name: "nom_elem", type_of_champ: "col", default_value: ""},
  {label: "Catégorie à analyser", name: "nom_classifier", type_of_champ: "col", default_value: ""}
])
const list_champ_boxplot : Ref<Array<Champ>> = ref([
  {label: "Somme à analyser", name: "sum_element", type_of_champ: "col", default_value: ""},
  {label: "Éléments dans la somme à analyser", name: "list_elements", type_of_champ: "col_list", default_value: []}
])

</script>