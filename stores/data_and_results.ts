import { defineStore } from 'pinia'

export const useMyData_and_resultsStore = defineStore({
  id: 'myData_and_resultsStore',
  // state: () => {return {data_csv: [""], colonnes: [""], results: [               // le return est important !
  //   new Resultat("EDASwarmPlot", {"swarmplot_nom_elem": "", "swarmplot_nom_classifier": ""}, "", ""),
  //   new Resultat("EDABoxPlot", {"boxplot_sum_element": "", "boxplot_list_elements": [""]}, "", "")
  // ]}},

  state: () => {
    return {               // le return est important !
      data_csv: [] as unknown[],
      colonnes: [] as string[],
      results: [] as Resultat[]
    }
  },

  actions: {
    set_data_csv(new_data_csv: unknown[]) {
      this.data_csv = new_data_csv;
      // if the file changes then no need to save the previous analysis in this store. if we want to keep them, maybe add an "archive" store?
      this.results = [] as Resultat[];
    },

    set_colonnes(new_colonnes: string[]) {
      this.colonnes = new_colonnes
    },

    
    add_result(result: Resultat) {
      this.results.push(result)
    },

    
    add_result_from_response(result: any) {
      this.results.push(result)
    },

    get_relevant_resultat(endpoint_: string) : Resultat {
      const relevant_res = this.results.filter((value) => value.endpoint_called == endpoint_);
      console.log("relevant_res", relevant_res);
      if (relevant_res.length == 0) {
        return new Resultat(
          endpoint_,
          {
            swarmplot_nom_classifier: "",
            swarmplot_nom_elem:"",
            boxplot_sum_element:"",
            boxplot_selected_list_elements: [],
            visual_element:""
          },
          "",
          ""
        )
      }
      else {
        return relevant_res[relevant_res.length - 1]
      };
    }
  }
})

// TODO: Add the logic in the components so that if the data file hasn't changed, the last result is displayed on opening the component
export class Resultat {
  endpoint_called: string;
  parameters: Parameters;
  result: string;
  name_fig: string;

  constructor(endpoint_called: string, parameters: Parameters, result: string, name_fig: string) {
    this.endpoint_called = endpoint_called;
    this.parameters = parameters;
    this.result = result;
    this.name_fig = name_fig;
  };

  make_name_for_export() {
    return this.endpoint_called + this.name_fig
  };
}


export type Parameters = {
  swarmplot_nom_elem?: string;
  swarmplot_nom_classifier?: string;
  boxplot_sum_element?: string;
  boxplot_selected_list_elements?: Array<string>;
  visual_element?: string;
  modelisation_compound_to_visualize?: string;
  modelisation_projection?: number;
}

// type ParametersBoxplot = {
// } 

// type ParametersStats = {
//   nom_elem: string;
//   nom_classifier: string;
// } 