<template>
  <!-- This is from: https://medium.com/@rahulpawar1212/accept-user-input-of-multiple-items-or-keywords-in-the-vue-input-box-with-tag-input-mechanisms-b359527c2d3f
   https://github.com/RahulPawar1212/vue_chips_copypaste_excel/blob/master/src/components/chiptest.vue -->
  <div class="input-box">
    <!-- Render existing chips -->
    <v-chip
      v-for="(chip, index) in chips"
      :key="index"
      close
    
      class="chip"
    >
      {{ chip }}
      <span @click.stop="removeChip(index)" class="close-icon"> x </span>
    </v-chip>

    <!-- Input field for new chips -->
    <input
      v-model="currentText"
      @input="checkForComma"
      @paste.stop.prevent="handlePaste"
      class="inner-input"
      placeholder="Enter text..."
    />
  </div>
</template>

<style>
.input-box {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 4px;
  max-width: 400px;
  flex-wrap: wrap;
}

.chip {
  margin-right: 5px;
}

.inner-input {
  border: none;
  outline: none;
  flex-grow: 1;
}

.v-chip .v-icon {
  z-index: 2;
}

.close-icon {
  margin-left: 5px;
  cursor: pointer;
  background-color: #b0b0b0;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  }
</style>

<script>
export default {
  data() {
    return {
      chips: [],           // Array to hold the chips
      currentText: ''     // The current text in the input field
    }
  },
  methods: {
    checkForComma() {
      if (this.currentText.endsWith(',')) {
        const newChip = this.currentText.slice(0, -1).trim(); // Remove comma and whitespace
        if (newChip) { // Avoid adding empty chips
          this.chips.push(newChip);
        }
        this.currentText = ''; // Reset the input field
      }
    },
    handlePaste(event) {
      const pastedData = event.clipboardData.getData('text');
      const items = pastedData.split(/[\n,]+/).map(item => item.trim());
      //const items = pastedData.split(',').map(item => item.trim()); // to handle comma seperated list
      items.forEach(item => {
        if (item) {
          this.chips.push(item);
        }
      });
    },
    removeChip(index) {
      this.chips.splice(index, 1);
    }
  }
}
</script>