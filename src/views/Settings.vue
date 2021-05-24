<template>
    <div>
        <h1>{{ s.h1Settings[lang] }}</h1>
        <div><router-link :to="{ name: 'Home'}">
            <span class="material-icons">
                arrow_back_ios_new
            </span>
        </router-link></div>
        <div class="form-floating mb-1">
            <input type="text" class="form-control" :placeholder="s.header[lang]">
            <label for="floatingInput">{{ s.header[lang] }}</label>
        </div>
        <div class="form-floating">
            <select class="form-select" v-model="lang" aria-label="Floating label select example">
                <option value="0">Українська</option>
                <option value="1">Русский</option>
                <option value="2">English</option>
            </select>
            <label for="floatingSelect">{{ s.language[lang] }}</label>
        </div>
    </div>
</template>

<script>
import s from '../composables/Strings.js';
import ls from '../composables/LocalStorage.js';

export default {
    data() {
        return {
            s, lang: ls.getLang()
        }
    },

    methods: {
        
    },

    watch: {
        lang: ls.setLang
    }
}
</script>

<style>
    div .form-floating {
        width: 95%;
        margin: 0 auto;
    }

    div .form-floating input, div .form-floating select {
        background: rgb(250, 247, 241);
    }

    div .form-floating select {
        width: 100%;
        margin: 0 auto;
        padding-bottom: 10px;
        line-height: 1.1;
    }

    div .form-floating select:focus {
        background: white;
    }
</style>