<template>
  <div>
    <h1>{{ s.aboutApp[lang] }}</h1>
    <div><router-link :to="{ name: 'Settings'}">
        <span class="material-icons">
            arrow_back_ios_new
        </span>
    </router-link></div>
    <div class="container">
        <p class="info p-1 mb-1" v-html="s.aboutInfo[lang]"></p>
    </div>
  </div>
</template>

<script>
import s from '../composables/Strings.js';
import ls from '../composables/LocalStorage.js'
export default {
    data() {
        return { s, lang: ls.getLang() }
    }
}
</script>

<style scoped>
    .info {
        line-height: 2;
    }
</style>