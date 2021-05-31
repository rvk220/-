<template>
  <div class="autocomplete mt-0">
      <div class="autocomplete-items">
          <div v-for="str in filteredAndEditedArray" v-html="str" :key="str" @click="choose"></div>
      </div>
  </div>
</template>

<script>
import ls from '../composables/LocalStorage.js'
export default {
    data() {
        return {
          datalistEntries: ls.getDatalist().map(word => [word, word.toLowerCase()]),
          filteredAndEditedArray: []
        }
    },

    methods: {
        onkeyup(e) {
          if(!e.target.value) return this.filteredAndEditedArray = [];
          const inputLC = e.target.value.toLowerCase(), result = [];
          for(const [word, wordLC] of this.datalistEntries) {
            if(!wordLC.indexOf(inputLC)) {
                const l1 = inputLC.length, l2 = word.length;
                result.push(`<strong>${word.slice(0, l1)}</strong>${word.slice(inputLC.length, l2)}`);
            }
          }
          this.filteredAndEditedArray = result;
        },

        choose(e) {
          this.$parent.inputProdName = e.target.textContent;
        }
    },

    mounted() {
      setTimeout(() => this.onkeyup({ target: document.getElementById('nameInp') }), 10);
    }
}
</script>

<style scoped>
* { box-sizing: border-box; }
.autocomplete {
  position: relative;
}
.autocomplete-items {
  z-index: 99;
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  border-top: none;
  z-index: 99;
  left: 0;
  right: 0;
}
.autocomplete-items div {
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
  border-bottom: 1px solid #d4d4d4;
}
.autocomplete-items div:last-child {
  border-radius: 0.25rem;
}
</style>