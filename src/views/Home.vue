<template>
<div>
<div class="container" v-show="!showAdd && indexOfEditedItem === -1">
  <h1>{{ settings.header[lang] }}</h1>
  <router-link :to="{ name: 'Settings'}">
    <span class="material-icons goToSettings">
      settings
    </span>
  </router-link>

  <ul class="list-group" ref="ul">
    <Li v-for="[num, prod] in products.entries()" :key="num" :prodObj="prod" :num="num"
    :settings="settings" :lang="lang" @click="clickListEntry(num)" />
  </ul>
  <h2 ref="sumText" v-show="products.length">{{ s.totalSum[lang] }}: {{ sum }} {{ settings.currency || '₴' }}.</h2>

  <section class="buttonSection d-flex justify-content-between pe-1">
      <img src="@\assets\deleteAll.png"  v-show="products.length" alt="clear list" style="width:29%" @click="askIfDeleteAll">
      <img src="@\assets\add.png" alt="add product" :class="{single: !products.length}" @click="showAdd = true">
      <img src="@\assets\copy2.png" v-show="products.length" alt="copy list to clipboard" @click="copyListToClipboard">
  </section>
</div>


<div v-if="showAdd">
  <AddEdit :editedProductIndex="-1" :products="products" @goback="showAdd = false"/>
</div>

<div v-if="indexOfEditedItem !== -1">
  <AddEdit :editedProductIndex="indexOfEditedItem" :products="products" @goback="indexOfEditedItem = -1"/>
</div>

<ModalEditProduct v-if="showEditModalInd !== -1" :prodInd="showEditModalInd" :lang="lang" :vueObj="vueObj"
@close="showEditModalInd = -1" @copy="onProductCopy" @edit="onProductEdit" @remove="onProductRemove" />

<Modal type="alert" v-if="alert.isShown" :text="alert.text" @close="alert.isShown = false" />
<Modal type="confirm" v-if="confirm.isShown" :text="confirm.text" @close="confirm.isShown = false" @confirm="confirm.fn" />
  
</div>
</template>

<script>
import ls from '../composables/LocalStorage.js';
import fn from '../composables/Functions.js'
import s from '../composables/Strings.js';
import AddEdit from '../components/AddEdit.vue';
import Li from '../components/ListEntry.vue';
import ModalEditProduct from '../components/modals/ModalEditProduct.vue';
import Modal from '../components/modals/Modal.vue';


export default {
  name: 'Home',

  components: { AddEdit, Li, ModalEditProduct, Modal },

  data() {
    return {
      s, settings: ls.getSettings(), lang: ls.getLang(),
      showAdd: false, indexOfEditedItem: -1, products: ls.getProducts(),
      showEditModalInd: -1, alert: { isShown: false, text: '' },
      confirm: { isShown: false, text: 'asshole', fn: () => null }
    }
  },

  computed: {
    sum() { return this.products.reduce((sum, prod) => sum + Number(prod.cost), 0) },
    vueObj() { return this; }
  },
  
  methods: {
    askIfDeleteAll() { fn.askIfDeleteAll(this) },
    deleteAll() { fn.deleteAll(this) },

    copyListToClipboard() { fn.copyListToClipboard(this) },

    clickListEntry(ind) {
      this.showEditModalInd = ind;
    },

    onProductCopy(ind) {
      fn.copyItemToClipboard(this, ind);
    },

    onProductEdit(ind) {
      fn.showEdit(ind, this);
    },

    onProductRemove(ind) {
      fn.removeProduct(ind, this);
    }
  }
}
</script>

<style>
  .material-icons.goToSettings {
    position:absolute;
    top:5px;
    right:5px;
    left:auto;
  }

  .buttonSection img {
    filter:sepia(50%);
    width:30%;
    height: 30%;
  }

  .buttonSection img.single {
    margin: 0 auto;
  }

</style>
