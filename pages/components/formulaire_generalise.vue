<template>
  <h1>{{name}}</h1>
  <div>
    <h1>{{ selectedPropsSet.name }}</h1>
    <div v-for="(champ, index) in selectedPropsSet.champs" :key="index">
      <v-select v-model="array_of_champs[index].value" :items="store.colonnes" :label="champ.label"></v-select>
    </div>
    <button @click="post_form">Submit</button>
  </div>
</template>

<script lang="ts" setup>
import { useMyData_and_resultsStore, Resultat } from '~/stores/data_and_results';
import type { Parameters } from '~/stores/data_and_results';

let props_from_parent = defineProps<{endpoint_name: string}>();

const store = useMyData_and_resultsStore();
const props_sets = [
  {
    name: 'boxplot',
    endpoint_name: "/EDABoxPlot",
    champs: [
      { label: "Elements à analyser", name: "list_elements", multiple: true },
      { label: "Catégorie à analyser", name: "sum_element", multiple: false },
    ],
  },
  {
    name: 'swarmplot',
    endpoint_name: "/EDASwarmPlot",
    champs: [
      { label: "Somme à analyser", name: "nom_classifier", multiple: true },
      { label: "Elements dans la somme à analyser", name: "nom_elem", multiple: true },
    ],
  },
  {
    name: "stats_de_base",
    endpoint_name: "/BasicStatistics",
    champs: [],
  },
];

const name = ref(props_sets.values["name"]);
const selectedPropsSet = ref(props_sets[2]); //basic_stat is used by default.

const init_form = store.get_relevant_resultat(selectedPropsSet.value.endpoint_name) ;
const init_form_params = init_form.parameters ;


let array_of_champs = [] as Ref<keyof Parameters>[]
watch(() => array_of_champs, () => { console.log(array_of_champs.values) });

for (let i = 0; i < selectedPropsSet.value.champs.length; i++) {
  let champ = selectedPropsSet.value.champs[i];
  let name: keyof Parameters = champ.name;
  array_of_champs.push(ref(init_form_params[name as keyof Parameters]));      // https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
}

// Post
const runtimeConfig = useRuntimeConfig();
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;

const status_post = ref("");

// const init_post = store.get_relevant_resultat(endpoint_name) ;
// const init_post_params = init_post.parameters ;


// const swarmplot_nom_classifier = ref(init_post_params.swarmplot_nom_classifier);
// const swarmplot_nom_elem = ref(init_post_params.swarmplot_nom_elem);
// const img = ref(init_post.result);

async function post_form() {
  let body: any = { "dataframe": store.data_csv };
  selectedPropsSet.value.champs.forEach((champ, index) => {
    body[champ.name] = array_of_champs[index].value;
  });

  const { data: res, status } = await useFetch(bck_end_base_url_ + selectedPropsSet.value.endpoint_name, {
    method: 'POST',
    body: body,
    // body: { "dataframe": store.data_csv, "nom_classifier": swarmplot_nom_classifier, "nom_elem": swarmplot_nom_elem },
    onRequest({}) {
      status_post.value = "pending";
    },
    onResponse({ request, response, options }) {
      img.value = response._data["fig"];
      const res = new Resultat(
        selectedPropsSet.value.endpoint_name,
        body,
        response._data["fig"],
        response._data["name_fig"]
      );
      // if (response._data["fig"]) {
      //   img_swarmplot.value = response._data["fig"];
      //   const res = new Resultat(
      //     selectedPropsSet.value.endpoint_name,
      //     body,
      //     response._data["fig"],
      //     response._data["name_fig"]
      //   );
      //   store.add_result(res);
      // } else {
      //   // Gérer les réponses sans figure
      //   const res = new Resultat(
      //     selectedPropsSet.value.endpoint_name,
      //     body,
      //     null,
      //     null
      //   );
      // store.add_result(res);
      store.add_result_from_response(response._data);
      status_post.value = "done";
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
    }
  });
};
</script>


<style>

</style>