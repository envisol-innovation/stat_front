<template>
  <div>
    <VFileInput v-model="file" label="Selectionner fichier"></VFileInput>
  </div>
  <div>
    <VFileInput v-model="file_grid" label="Selectionner fichier grid"></VFileInput>
  </div>
  <div>range horizontal
    <input v-model.number="range_horizontal" label="range horizontal"></input>
  </div>
  <div>range median
    <input v-model.number="range_median" label="range median"></input>
  </div>
  <div>range vertical
    <input v-model.number="range_vertical" label="range vertical"></input>
  </div>
  <div>variance
    <input v-model.number="variance" label="variance"></input>
  </div>
  <div>nugget effect
    <input v-model.number="nugget_effect" label="nugget effect"></input>
  </div>
  <div>direction
    <input v-model.number="direction" label="direction"></input>
  </div>  <!-- <div>{{label_carb}}</div> -->
  <v-btn color="primary" @click="krig"> Go </v-btn>
  <v-btn color="primary" @click="downloadBlob"> Enregistrer sous </v-btn>
  <div>
    res_
    <!-- {{ res_ }} -->
  </div>
  <div v-if="img_krig != ''">
    <NuxtImg sizes="sm:600px md:760px lg:1200px xl:1200px" v-bind:src="`data:image/jpg;base64,${img_krig}`" />
  </div>
</template>

<script lang="ts" setup>
import * as PaPa from 'papaparse';
import { useMySpectraStore } from '~/stores/data_and_results';
// import Plotly from plotly

const runtimeConfig = useRuntimeConfig();
const backend_swag_url_public = runtimeConfig.public.backend_swag_url_public;

const store = useMySpectraStore();


const file = ref([]);
const file_grid = ref([]);
const range_horizontal : Ref<number> = ref(-1);
const range_median : Ref<number> = ref(-1);
const range_vertical : Ref<number> = ref(1);
const variance : Ref<number> = ref(-1);
const nugget_effect : Ref<number> = ref(0);
const direction : Ref<number> = ref(-1);
let txt_file_raw : Ref<Array<unknown>> = ref([]);
let txt_file_grid_raw : Ref<Array<unknown>> = ref([]);
const fig_html = ref("L'api n'a pas répondu. Soit elle a buggé soit elle n'est pas allumée.");
const res_ = ref();
let fig_name : string = "";
const img_krig = ref("");

watch(file, Read_Files);


async function Read_Files() {
  txt_file_raw.value = []
  res_.value = []

  file.value.forEach(txt_file => {
    console.log("file", txt_file);
    console.log("file", file.value);
    let reader = new FileReader();
    reader.readAsText(txt_file);
    reader.onload = async () => {
      const csv_string: string = reader.result as string;
      const parser = PaPa.parse(csv_string, { delimiter: ";" });
      const new_data_csv = PaPa.parse(csv_string, { delimiter: ";", header: true }).data;

      txt_file_raw.value = new_data_csv
    };
  });
  file_grid.value.forEach(txt_file_grid => {
    console.log("file grid", txt_file_grid);
    console.log("file gridgrid", file_grid.value);
    let reader = new FileReader();
    reader.readAsText(txt_file_grid);
    reader.onload = async () => {
      const csv_string: string = reader.result as string;
      const parser = PaPa.parse(csv_string, { delimiter: ";" });
      const new_data_csv = PaPa.parse(csv_string, { delimiter: ";", header: true }).data;

      txt_file_grid_raw.value = new_data_csv
    };
  })
}

async function krig() {
  const { data, status } = await useFetch(backend_swag_url_public+'/Krig', {
      method: 'POST',
      body: {
        "dataframe": txt_file_raw.value,
        "dataframe_grid": txt_file_grid_raw,
        "variogram_params": {
          "range": [range_horizontal.value, range_median.value, range_vertical.value],
          "nugget_effect": nugget_effect.value,
          "variance": variance.value,
          "direction": direction.value
        }
      },
      onResponse({ request, response, options }) {
        console.log(typeof(response._data))
        img_krig.value = response._data["fig"]
        res_.value = response._data["data"]
        console.log("res_.value", res_.value)
      },
      onResponseError({ request, response, options }) {
        // Handle the response errors"
      }
    }
  );
}

function downloadBlobfig() {
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


/**
 * Download contents as a file
 * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
 */
 function downloadBlob() {
  // fixed content for now
  const content = arrayToCsv(res_.value)

  // fixed filename for now
  const filename = 'export_krig.csv'

  // Fixed content type for now
  const contentType = 'text/csv;charset=utf-8;'

  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
};


/**
 * Convert a 2D array into a CSV string
 */
 function arrayToCsv(data){
  console.log("data in array to csv", data);
  let unparsed_data = PaPa.unparse(data, {delimiter: ";"});
  console.log("unparsed_data", unparsed_data);
  return unparsed_data
  // return data.map(row =>
  //   row
  //   .map(String)  // convert every value to String
  //   .map(v => v.replaceAll('"', '""'))  // escape double quotes
  //   .map(v => `"${v}"`)  // quote it
  //   .join(',')  // comma-separated
  // ).join('\r\n');  // rows starting on new lines
}


</script>
