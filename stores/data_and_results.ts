import { defineStore } from 'pinia'

export const useMyData_and_resultsStore = defineStore({
  id: 'myData_and_resultsStore',
  state: () => ({data_csv: [] as unknown[], colonnes: [] as string[], results: [] as Resultats[]}),
  actions: {
    set_data_csv(new_data_csv: []) {
      this.data_csv = new_data_csv
    },

    set_colonnes(new_colonnes: string[]) {
      this.colonnes = new_colonnes
    },

    add_result(result: Resultats) {
      this.results.push(result)
    },

    get_relevant_resultat(endpoint_: string) {
      const relevant_res = this.results.filter((value) => value.endpoint_called == endpoint_)
      return relevant_res[relevant_res.length - 1]
    }
  }
})

// TODO: Add the logic in the components so that if the data file hasn't changed, the last result is displayed on opening the component
class Resultats {
  endpoint_called: string;
  parameters: Object;
  result: string;
  name_fig: string;

  constructor(endpoint_called: string, parameters: Object, result: string, name_fig: string) {
    this.endpoint_called = endpoint_called;
    this.parameters = parameters;
    this.result = result
    this.name_fig = name_fig
  };

  make_name_for_export() {
    return this.endpoint_called + this.name_fig
  };

}
