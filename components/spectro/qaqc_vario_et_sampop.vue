<template>
  <div>
    <VFileInput v-model="files" label="Selectionner fichier"></VFileInput>
  </div>
  <div>range horizontal
    <input v-model.number="range_horizontal" label="range horizontal"></input>
  </div>
  <div>range vertical
    <input v-model="range_vertical" label="range vertical"></input>
  </div>
  <div>variance
    <input v-model="variance" label="variance"></input>
  </div>
  <div>nugget effect
    <input v-model="nugget_effect" label="nugget effect"></input>
  </div>
  <!-- <div>{{label_carb}}</div> -->
  <v-btn color="primary" @click="vario_and_qaqc"> Go </v-btn>
  <!-- <v-btn color="primary" @click="downloadBlob"> Enregistrer sous </v-btn> -->
  <div>
    res_vario
    {{ res_vario }}

  </div>
</template>

<script lang="ts" setup>
import * as PaPa from 'papaparse';
import { useMySpectraStore } from '~/stores/data_and_results';
// import Plotly from plotly

const runtimeConfig = useRuntimeConfig();
const backend_swag_url_public = runtimeConfig.public.backend_swag_url_public;

const store = useMySpectraStore();


const files = ref([]);
const range_horizontal : Ref<number> = ref(-1);
const range_vertical : Ref<number> = ref(1);
const variance : Ref<number> = ref(-1);
const nugget_effect : Ref<number> = ref(0);
let txt_file_raw : Ref<Array<unknown>> = ref([]);
const fig_html = ref("L'api n'a pas répondu. Soit elle a buggé soit elle n'est pas allumée.");
const res_vario = ref();
let fig_name : string = "";
watch(files, Read_Files);


async function Read_Files() {
  txt_file_raw.value = []
  res_vario.value = []

  files.value.forEach(txt_file => {
    console.log("file", txt_file);
    console.log("file", files.value);
    let reader = new FileReader();
    reader.readAsText(txt_file);
    reader.onload = async () => {
      const csv_string: string = reader.result as string;
      const parser = PaPa.parse(csv_string, { delimiter: ";" });
      const new_data_csv = PaPa.parse(csv_string, { delimiter: ";", header: true }).data;

      txt_file_raw.value = new_data_csv
    };
  });
}

async function vario_and_qaqc() {
  const { data, status } = await useFetch(backend_swag_url_public+'/VariogramCalculatorApi', {
      method: 'POST',
      body: {
        "dataframe": txt_file_raw.value,
        "ref_variogram_params": {
          "range": [range_horizontal.value, range_vertical.value],
          "nugget_effect": nugget_effect.value,
          "variance": variance.value
        }
      },
      onResponse({ request, response, options }) {
        console.log(typeof(response._data))
        // fig_html.value = response._data
        res_vario.value = response._data["res"]
      },
      onResponseError({ request, response, options }) {
        // Handle the response errors
      }
    }
  );
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
