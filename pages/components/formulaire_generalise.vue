<template>
  <h1>{{name}}</h1>
  <div v-for="i in champs.length">
    <v-select v-model="array_of_champs[i].value" :items="store.colonnes" :label="champs[i].label"></v-select>
  </div>
</template>

<script lang="ts" setup>
import { useMyData_and_resultsStore, Resultat } from '~/stores/data_and_results';
import type { Parameters } from '~/stores/data_and_results';


let props_from_parent = defineProps<{name: string, endpoint_name: string, champs: Champ[]}>();


const store = useMyData_and_resultsStore();

const init_swarmplot = store.get_relevant_resultat(props_from_parent.endpoint_name) ;
const init_swarmplot_params = init_swarmplot.parameters ;


let array_of_champs = [] as Ref<keyof Parameters>[]

for (let i =0; i < props_from_parent.champs.length; i++) {
  let champ : Champ = props_from_parent.champs[i];
  let name : string = champ.name;
  array_of_champs.push(ref(init_swarmplot_params[name as keyof Parameters]))      // https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
}

type Champ = {
  label: string,
  name: string,
  multiple: boolean,
}

</script>

<style>

</style>