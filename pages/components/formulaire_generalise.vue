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

const init_form = store.get_relevant_resultat(props_from_parent.endpoint_name) ;
const init_form_params = init_form.parameters ;


let array_of_champs = [] as Ref<keyof Parameters>[]

for (let i =0; i < props_from_parent.champs.length; i++) {
  let champ : Champ = props_from_parent.champs[i];
  let name : keyof Parameters = champ.name;
  array_of_champs.push(ref(init_form_params[name as keyof Parameters]))      // https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
}

type Champ = {
  label: string,
  name: keyof Parameters,
  multiple: boolean,
}


// Post
const runtimeConfig = useRuntimeConfig();
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;

const status_post = ref("");

async function post_form() {
  const { data: res, status } = await useFetch(bck_end_base_url_ + props_from_parent.endpoint_name, {
    method: 'POST',
    body: { "dataframe": store.data_csv, "nom_classifier": swarmplot_nom_classifier, "nom_elem": swarmplot_nom_elem },
    onRequest({}){
      status_post.value = "pending";
    },
    onResponse({ request, response, options }) {
      img_swarmplot.value = response._data["fig"];
      const res = new Resultat(
        endpoint_name,
        { "swarmplot_nom_classifier": swarmplot_nom_classifier.value, "swarmplot_nom_elem": swarmplot_nom_elem.value },
        response._data["fig"],
        response._data["name_fig"]
      );
      store.add_result(res);
      status_post.value = "done"
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
    }
  });
};


</script>

<style>

</style>