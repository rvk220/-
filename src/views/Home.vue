<template>
<div class="container">
  <h1>{{ s.h1Home[lang] }}</h1>
  <router-link :to="{ name: 'Settings'}">
    <span class="material-icons goToSettings">
      settings
    </span>
  </router-link>
</div>
  
  <div class="container" style="height:200%;">
    <section class="buttonSection">
      <div>
        <span class="material-icons">
          clear
        </span>
      </div>
      <div>
        <span class="material-icons">
          add_circle_outline
        </span>
      </div>
      <div>
        <span class="material-icons">
          copy_all
        </span>
      </div>
    </section>
  </div>
</template>

<script>
import s from '../composables/Strings.js';

export default {
  name: 'Home',

  data() {
    return {
      s, lang: 0
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

  .buttonSection {
    display: flex;
    justify-content: space-between;
    margin: 0 50px;
  }

  .buttonSection div {
    display: inline-block;
  }

  .buttonSection span {
    position:static;
  }
</style>
