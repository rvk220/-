<template>
    <div>
        <h1>{{ s.h1Settings[lang] }}</h1>
        <div><router-link :to="{ name: 'Home'}">
            <span class="material-icons">
                arrow_back_ios_new
            </span>
        </router-link></div>
        <div class="form-floating mb-1">
            <input type="text" class="form-control" :placeholder="s.header[lang]"
                v-model="header" @blur="setHeader">
            <label for="floatingInput">{{ s.header[lang] }}</label>
        </div>
        <div class="form-floating mb-1">
            <input type="text" class="form-control" :placeholder="s.currency[lang]"
                v-model="currency" @blur="setCurrency">
            <label for="floatingInput">{{ s.currency[lang] }}</label>
        </div>
        <div class="form-floating">
            <select class="form-select" v-model="lang" aria-label="Floating label select example">
                <option value="0">Українська</option>
                <option value="1">Русский</option>
                <option value="2">English</option>
            </select>
            <label for="floatingSelect">{{ s.language[lang] }}</label>
        </div>
        <hr>
        <!-- unit settings: -->
        <div class="form-check ms-2">
            <input class="form-check-input" type="checkbox" v-model="useCustomUnits">
            <label class="form-check-label" for="flexCheckDefault">
                {{ s.useCustomUnits[lang] }}
            </label>
        </div>
        <div v-if="useCustomUnits">
            <div class="mx-2 d-flex unitAndDatalistInputs">
                <div class="col-9 px-2">
                    <input type="text" class="form-control p-1 d-inline"
                    v-model="newUnit" @keydown.enter="addUnit">
                </div>
                <div class="col-3">
                    <button class="btn btn-secondary btn-sm" @click="addUnit">{{ s.add[lang] }}</button>
                </div>
            </div>
            <ul class="d-flex justify-content-between flex-wrap px-0 mx-3 my-2">
                <li v-for="entry in settings.units" class="px-1 mx-1 my-1 badge bg-secondary" :key="entry">     
                    <span>{{ entry[lang] }}</span><span @click="removeUnit" class="px-1">x</span>
                </li>
            </ul>
        </div>
        <hr>
        <!-- datalist settings: -->
        <div class="form-check ms-2">
            <input class="form-check-input" type="checkbox" v-model="useDatalist">
            <label class="form-check-label" for="flexCheckDefault">
                {{ s.useDatalist[lang] }}
            </label>
        </div>
        <div v-if="useDatalist">
            <div class="mx-2 d-flex unitAndDatalistInputs">
                <div class="col-9 px-2">
                    <input type="text" class="form-control p-1 d-inline"
                    v-model="newDatalistEntryInput" @keydown.enter="addDatalistEntry">
                </div>
                <div class="col-3">
                    <button class="btn btn-secondary btn-sm" @click="addDatalistEntry">{{ s.add[lang] }}</button>
                </div>
            </div>
            <ul class="d-flex justify-content-between flex-wrap px-0 mx-3 my-2">
                <li v-for="entry in datalist" class="px-1 mx-1 my-1 badge bg-secondary" :key="entry">     
                    <span>{{ entry }}</span><span @click="removeDatalistEntry" class="px-1">x</span>
                </li>
            </ul>
        </div>
        <hr>
        <h2 class="text-center my-0 py-0">{{ s.backup[lang] }}</h2>
        <div class="container text-center mt-1">
            <label class="form-label">{{ s.restoreSettingsFromAFile[lang] }}:</label>
            <input class="form-control btn-secondary" @change="uploadSettings" type="file" accept=".json">
        </div>
        <div class="container text-center mt-3">
            <label>{{ s.downloadOnDevice[lang] }}:</label>
            <div class="d-flex justify-content-center">
                <button class="btn btn-secondary mx-2 mt-2" @click="downloadSettings">
                    {{ s.download[lang] }}
                </button>
            </div>
        </div>
        <hr>
        <div class="d-flex">
            <button class="btn btn-danger mb-3" @click="clearAllAppSettings">
                Clear all app settings
            </button>
        </div>
    </div>
</template>

<script>
import s from '../composables/Strings.js';
import ls from '../composables/LocalStorage.js';
const settings = ls.getSettings(), lang = ls.getLang();

export default {
    data() {
        return {
            s, settings, lang, useCustomUnits: settings.useCustomUnits, useDatalist: settings.useDatalist,
            header: settings.header[lang], currency: settings.currency || '₴',
            datalist: ls.getDatalist(), newDatalistEntryInput: '', newUnit: ''
        }
    },

    methods: {
        setHeader() {
            this.header = this.header.trim();
            this.settings.header[this.lang] = this.header;
            ls.setSettings(this.settings);
        },

        setCurrency() {
            this.currency = this.currency.trim();
            this.settings.currency = this.currency;
            ls.setSettings(this.settings);
        },

        addUnit() {
            const input = this.newUnit.trim();
            let unit;
            if(!input || this.settings.units.findIndex(u => u.includes(input)) !== -1) return;
            if(['кг', 'кг', 'kg'].includes(input)) {
                unit = ['кг', 'кг', 'kg'];
            } else if(['шт', 'шт', 'pcs'].includes(input)) {
                unit = ['шт', 'шт', 'pcs'];
            } else {
                unit = new Array(3).fill(input);
            }
            this.settings.units.push(unit);
            ls.setSettings(this.settings);
        },

        removeUnit({ target: span }) {
            const clickedItemText = span.parentNode.childNodes[0].textContent;
            this.settings.units = this.settings.units.filter(u => !u.includes(clickedItemText));
            ls.setSettings(this.settings);
        },

        addDatalistEntry() {
            const word = this.newDatalistEntryInput.trim(), datalist = this.datalist;
            if(word && !datalist.includes(word)) {
                datalist.push(word);
                datalist.sort((a, b) => a < b ? -1 : 1);
                ls.setDatalist(datalist);
            }
            this.newDatalistEntryInput = '';
        },

        removeDatalistEntry({ target: span }) {
            const clickedItemText = span.parentNode.childNodes[0].textContent;
            this.datalist = this.datalist.filter(text => text !== clickedItemText);
            ls.setDatalist(this.datalist);
        },

        downloadSettings() {
            ls.downloadSettingsFile();
        },

        uploadSettings(e) {
            ls.uploadSettingsFile(e.target);
        }
    },

    watch: {
        lang: function(lang) {
            ls.setLang(lang);
            this.header = this.settings.header[lang];
        },

        useCustomUnits() {
            this.settings.useCustomUnits = this.useCustomUnits;
            ls.setSettings(settings);
        },

        useDatalist() {
            this.settings.useDatalist = this.useDatalist;
            ls.setSettings(this.settings);
        }
    }
}
</script>

<style scoped>
    div .unitAndDatalistInputs {
        display:inline-block;
        box-shadow: none;
    }

    div .unitAndDatalistInputs input {
        background: rgb(250, 247, 241);
    }

    div .unitAndDatalistInputs button {
        width:90%;
        margin-top: 0.1rem;
    }

    ul li {
        filter:sepia(50%);
        font-size:1rem;
        font-weight: 100;
    }

    ul li span:nth-child(2) {
        margin-left: 1rem;
        color:black;
        background-color: rgb(250, 247, 241);
    }

    div input[type=file] {
        background-color:rgb(158, 152, 141);
        border-radius: 5px;
    }

    .btn-secondary:focus {
        background-color:rgb(158, 152, 141);
    }

    .btn-danger {
        margin: 0 auto;
        filter: sepia(50%);
    }
</style>