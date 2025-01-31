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
    
      <div v-if="storeNav.show_swarmplot">
        <Formulaire_swarmplot></Formulaire_swarmplot>
      </div>
    
      <div v-if="storeNav.show_boxplot">
        <Formulaire_boxplot></Formulaire_boxplot>
      </div>  
  </template>
  
  <script setup lang="ts">
  
  import { useMyData_and_resultsStore } from '~/stores/data_and_results';
  import { useMyNavStore } from '~/stores/nav';
  import Formulaire_swarmplot from '~/components/formulaire_swarmplot.vue';
  import Formulaire_boxplot from '~/components/formulaire_boxplot.vue';
  import Formulaire_stats_de_base from '~/components/formulaire_stats_de_base.vue';
  import File_import from '~/components/file_import.vue';
  
  const store = useMyData_and_resultsStore();
  const storeNav = useMyNavStore();
  
  </script>
  