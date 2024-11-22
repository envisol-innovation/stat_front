<template>
    <h1> Boxplot : Contribution des composés à leur somme </h1>
    
    <!-- <v-select v-model="list_elements" :items="colonnes" label="Éléments à analyser"> </v-select> -->
    <v-select v-model="boxplot_sum_element" :items="props_from_parent.colonnes" label="Somme à analyser"> </v-select>
    <v-select v-model="selected_list_elements" :items="props_from_parent.colonnes" label="Éléments dans la somme à analyser" multiple>
      <template v-slot:prepend-item>
        <v-list-item @click="toggle">
          <v-list-item-action>
            <v-icon :color="selected_list_elements.length > 0 ? 'indigo darken-4' : ''"></v-icon>
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
  
    <v-btn color="success" @click="post_boxplot">Boxplot !</v-btn>

    <div v-if="status_post">
      <!-- Status = {{status_post}} {{ typeof(status_post.value) }} {{ status_post.value == 'pending' }} -->
      <v-progress-circular v-if="status_post == 'pending'"
        color="green"
        indeterminate
      ></v-progress-circular>
    </div>

    <div v-if="img_boxplot != '' && status_post.value != 'pending'">
      <img v-bind:src="`data:image/jpg;base64,${img_boxplot}`" />
    </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const bck_end_base_url_ = runtimeConfig.public.backend_url_public;

let selected_list_elements = ref([]);


function toggle() {
  if (selected_list_elements.value.length == props_from_parent.colonnes.length) {
    selected_list_elements.value = []
  } else {
    selected_list_elements.value = props_from_parent.colonnes.slice()
  }
}



let props_from_parent = defineProps({
    data: {
        type: Array,
        required: true,
    },
    colonnes: {
      type: Array,
      required: true,
    }
});


let boxplot_sum_element = ref("");
let img_boxplot = ref("")

let status_post = ref()
watch(status_post, ()=>{console.log("status_post", status_post)})

async function post_boxplot() {
  const { data, status } = await useFetch(bck_end_base_url_+'/EDABoxPlot', {
    method: 'POST',
    body: {"dataframe": props_from_parent.data, "list_elements": selected_list_elements.value, "sum_element": boxplot_sum_element.value},
    onResponse({ request, response, options }) {
      img_boxplot.value = response._data["fig"];
    },
    onResponseError({ request, response, options }) {
      // Handle the response errors
  }
 

  });
  status_post.value = status
}
</script>
