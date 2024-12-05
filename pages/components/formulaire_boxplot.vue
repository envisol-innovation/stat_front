<template>
    <h1> Boxplot : Contribution des composés à leur somme </h1>
    
    <!-- <v-select v-model="list_elements" :items="colonnes" label="Éléments à analyser"> </v-select> -->
    <v-select v-model="boxplot_sum_element" :items="store.colonnes" label="Somme à analyser"> </v-select>
    <v-select v-model="boxplot_selected_list_elements" :items="store.colonnes" label="Éléments dans la somme à analyser" multiple>
      <template v-slot:prepend-item>
        <v-list-item @click="toggle">
          <v-list-item-action>
            <v-icon :color="boxplot_selected_list_elements.length > 0 ? 'indigo darken-4' : ''"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <div v-if="boxplot_selected_list_elements.length == store.colonnes.length">
                Désélectionner tout
              </div>
              <div v-else>
                Sélectionner tout
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>
    </v-select>
  
    <v-btn color="primary" @click="post_boxplot">Boxplot !</v-btn>

    <div v-if="status_post">
      <!-- Status = {{status_post}} {{ typeof(status_post.value) }} {{ status_post.value == 'pending' }} -->
      <v-progress-circular v-if="status_post == 'pending'"
        color="primary" size="50" width="12"
        indeterminate
      ></v-progress-circular>
    </div>

    <div v-if="status_post == 'error'">
      Erreur !
      Ceci est probablement du a la présence de texte dans les colonnes sélectionnées. Vérifiez si elles sont inclues dans les alertes ci dessus et corrigez le fichier d'entré en conséquence.
      <!-- Status = {{status_post}} {{ typeof(status_post.value) }} {{ status_post.value == 'pending' }} -->
    </div>

    <div v-if="img_boxplot != '' && status_post != 'pending'">
      <NuxtImg sizes="sm:600px md:760px lg:1200px xl:1200px" v-bind:src="`data:image/jpg;base64,${img_boxplot}`" />
    </div>
</template>

<script setup lang="ts">
import { useMyData_and_resultsStore } from '#build/imports';


const runtimeConfig = useRuntimeConfig()
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;

const store = useMyData_and_resultsStore()

const endpoint_name = "/EDABoxPlot"

const init_boxplot = store.get_relevant_resultat(endpoint_name) ;
const init_boxplot_params = init_boxplot.parameters ;

// this mess below is so the compiler knows that boxplot_selected_list_elements is not undefined and thus can call the "length" param in the toggle function
// the "as string[]" is to reassure it that even though boxplot_selected_list_elements is optional on the Parameters type, I'll be careful that it's defined
// before calling it here
const boxplot_selected_list_elements : Ref<Array<string>> = ref(init_boxplot_params.boxplot_selected_list_elements as string[]); 
const boxplot_sum_element = ref(init_boxplot_params.boxplot_sum_element);
const img_boxplot = ref(init_boxplot.result)

let status_post = ref("")

async function post_boxplot() {
  const { data, status } = await useFetch(bck_end_base_url_ + endpoint_name, {
    method: 'POST',
    body: {"dataframe": store.data_csv, "list_elements": boxplot_selected_list_elements.value, "sum_element": boxplot_sum_element.value},
    onRequest({}) {
      status_post.value = "pending";
    },
    onResponse({ request, response, options }) {
      img_boxplot.value = response._data["fig"];
      const res = new Resultat(
        endpoint_name,
        { "boxplot_selected_list_elements": boxplot_selected_list_elements.value, "boxplot_sum_element": boxplot_sum_element.value },
        response._data["fig"],
        response._data["name_fig"]
      );
      store.add_result(res);
      status_post.value = "done";
      console.log("87 here in post boxplot")
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
      console.log("ERROR in post boxplot: ", response);
      status_post.value = "error"

    }
  });
}


watch(() => store.data_csv, () => {reset_everything()});

function reset_everything() {
  boxplot_selected_list_elements.value = [];
  boxplot_sum_element.value = "";
  img_boxplot.value = "";
}

// this should probably be refactored somewhere
function toggle() {
  if (boxplot_selected_list_elements.value.length == store.colonnes.length) {
    boxplot_selected_list_elements.value = []
  } else {
    boxplot_selected_list_elements.value = store.colonnes.slice()
  }
}
</script>
