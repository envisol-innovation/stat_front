<template>
    <div>
      <VFileInput v-model="files" label="Selectionner fichier"></VFileInput>
    </div>
    <div>
        {{ txt_file_raw }}
    </div>
 
  </template>
  
  <script lang="ts" setup>
  import * as PaPa from 'papaparse';
  import { useMySpectraStore } from '~/stores/data_and_results';
  
  const runtimeConfig = useRuntimeConfig();
  const bck_end_base_url_ = runtimeConfig.public.backend_url_public;
  
  const store = useMySpectraStore();
  
  
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
  let txt_file_raw = ref([])
  
  watch(files, Read_File);
  
  
  async function Read_File() {
    const txt_file = files.value[0];
    console.log("file", txt_file);
    let reader = new FileReader();
    reader.readAsText(txt_file);
    reader.onload = async () => {
      const csv_string: string = reader.result as string;
      const parser = PaPa.parse(csv_string);
      const new_data_csv = PaPa.parse(csv_string).data;
      txt_file_raw.value = csv_string
    //   store.set_data_csv(csv_string);
    //   const new_colonnes = parser.data[0] as [string];
    //   store.set_colonnes(new_colonnes);
  

    // TODO: send string / receive html figure and indice_carbonate
      const { data, status } = await useFetch(bck_end_base_url_+'/QAQCImport', {
      method: 'POST',
      body: {"dataframe": store.data_csv},
      onResponse({ request, response, options }) {
        
      },
      onResponseError({ request, response, options }) {
        // Handle the response errors
      }
      });
    }
  }
  
  </script>
  