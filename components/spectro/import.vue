<template>
    <div>
      <VFileInput v-model="files" label="Selectionner fichier" multiple></VFileInput>
    </div>
    <!-- <div>{{label_carb}}</div> -->
    <div v-if="label_carb.length>0" v-for="(filename, index) in files"> {{ filename["name"] }}  {{label_carb[index]}}</div>
    <v-btn color="primary" @click="visual_and_qaqc_carbonates"> go </v-btn>
    <v-btn color="primary" @click="downloadBlob"> Enregistrer sous </v-btn>

    <!-- <div v-html="str_html"></div>
    <div id="4061cd63-1c99-42d0-931f-f8d5cc537a04" class="plotly-graph-div" style="height:100%; width:100%;"></div>

    <span h-ref="~/assets/first_figure.html">f</span>
    <span v-html="fig_html"></span>
    <div> hello brooooo </div>
    {{fig_html}} -->

 
  </template>
  
  <script lang="ts" setup>
  import * as PaPa from 'papaparse';
  import { useMySpectraStore } from '~/stores/data_and_results';
  // import Plotly from plotly

  const runtimeConfig = useRuntimeConfig();
  const backend_green_url_public = runtimeConfig.public.backend_green_url_public;
  
  const store = useMySpectraStore();
  const str_html = "<div> hi my guy</div>"
  
  //   let props_from_parent = defineProps({
  //     colonnes: {
  //         type: Array,
  //         required: true,
  //     },
  //     data_csv: {
  //       type: Array,
  //       required: true,
  //     }
  // })
  
  // const files = ref([]);
  // let colonnes = ref([""]);
  
  // let data_csv = ref([]);
  
  const files = ref([]);
  let txt_file_raw : Ref<Array<string>> = ref([]);
  const fig_html = ref("L'api n'a pas répondu. Soit elle a buggé soit elle n'est pas allumée.");
  const label_carb = ref([]);
  let fig_name : string = "";
  watch(files, Read_Files);


  async function Read_Files() {
    txt_file_raw.value = []
    label_carb.value = []

    files.value.forEach(txt_file => {
      console.log("file", txt_file);
      console.log("file", files.value);
      let reader = new FileReader();
      reader.readAsText(txt_file);
      reader.onload = async () => {
        const csv_string: string = reader.result as string;
        const parser = PaPa.parse(csv_string);
        const new_data_csv = PaPa.parse(csv_string).data;
        txt_file_raw.value.push(csv_string)      
      };
    });
  }

  async function visual_and_qaqc_carbonates() {
    const file_name_list = files.value.map((file_dict)=>file_dict["name"]);
    console.log("file_name_list", file_name_list)
    const { data, status } = await useFetch(backend_green_url_public+'/QaqcCarbonates', {
        method: 'POST',
        body: {"string_asp_list": txt_file_raw.value, "file_name_list": file_name_list},
        onResponse({ request, response, options }) {
          console.log(typeof(response._data))
          // fig_html.value = response._data
          fig_html.value = response._data["fig"]
          fig_name = response._data["fig_name"]
          console.log(response._data["indice_carbonate"])
          label_carb.value = response._data["indice_carbonate"]
        },
        onResponseError({ request, response, options }) {
          // Handle the response errors
        }
        });
      
  }

  function downloadBlob() {
    // fixed content for now
    const content = fig_html.value

    // fixed filename for now
    const filename = 'export_' + fig_name + '.html'

    // Fixed content type for now
    const contentType = 'text/csv;charset=utf-8;'

    // Create a blob
    var blob = new Blob([content], { type: contentType });
    console.log(blob)
    var url = URL.createObjectURL(blob);

    // Create a link to download it
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
  };
  
  </script>
  