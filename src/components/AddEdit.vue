<template>
    <div>
        <h1>{{ editedProductIndex === -1 ? s.h1AddProduct[lang] :
            `${s.h1EditProduct[lang]} ${1 + editedProductIndex}` }}</h1>
        <div @click="$emit('goback')">
            <span class="material-icons">
                arrow_back_ios_new
            </span>
        </div>
        <div class="form-floating mb-1 secondary">
            <select v-model="unit" class="form-select" aria-label="Floating label select example">
                <option v-for="[i, name] in units.entries()" :key="i" :value="i">{{ name[lang] }}</option>
            </select>
            <label for="floatingSelect">{{ s.unit[lang] }}</label>
        </div>
        <div class="form-floating mb-1 secondary">
            <select v-model="calcType" class="form-select" aria-label="Floating label select example">
                <option value="0">{{ s.calcType[0][lang] }}</option>
                <option value="1">{{ s.calcType[1][lang] }}</option>
            </select>
            <label for="floatingSelect">{{ s.inputType[lang] }}</label>
        </div>
        <div class="form-floating mb-1">
            <input v-model="inputProdName" id="nameInp" ref="nameInp" type="text" class="form-control" autocomplete="off"
            @focus="isNameInpFocused = true" @blur="onProductNameBlur" @keyup="onProductNameKeyup">
            <label for="floatingInput">{{ s.inputProdName[lang] }}</label>
            <Datalist ref="datalist" v-show="useDatalist && isNameInpFocused" />
        </div>
        <div class="form-floating mb-1">
            <input v-model="inputProdPrice" @input="autoCalc" type="number" class="form-control">
            <label for="floatingInput">{{ `${s.inputProdPrice[lang]} (${currency}/${units[unit][lang]})` }}</label>
        </div>
        <div class="form-check ms-3">
            <input v-model="isApprox" class="form-check-input" type="checkbox">
            <label class="form-check-label" for="flexCheckDefault">
                {{ s.approxDescription[lang] }}
            </label>
        </div>
        <div class="form-floating mb-1">
            <input v-model="inputProdQuantity" @input="autoCalc" :disabled="calcType === '1'" type="number" class="form-control">
            <label for="floatingInput">{{ `${s.inputProdQuantity[lang]} (${units[unit][lang]})` }}</label>
        </div>
        <div class="form-floating mb-1">
            <input v-model="inputProdCost" @input="autoCalc" :disabled="calcType === '0'" type="number" class="form-control">
            <label for="floatingInput"><strong>{{ `${s.inputProdCost[lang]} (${currency})` }}</strong></label>
        </div>
        <div class="d-flex">
            <button @click="confirmAddOrEditProduct" class="btn btn-primary confirmbutton">
                {{ ['Підтвердити', 'Подтвердить','Confirm'][lang] }}
            </button>
        </div>

        <Modal type="alert" v-if="alert.isShown" :text="alert.text" @close="alert.isShown = false" />
    </div>
</template>

<script>
import s from '../composables/Strings.js';
import ls from '../composables/LocalStorage.js';
import fn from '../composables/Functions.js';
import Modal from '../components/modals/Modal.vue';
import Datalist from '../components/Datalist.vue';
const { units, useCustomUnits, useDatalist, currency } = ls.getSettings();
let { unitName, calcType, isApprox } = ls.getLastUsed();
let unit = units.findIndex(u => u.includes(unitName));
if(unit === -1) unit = 0;
const lang = ls.getLang();
export default {
    props: ['editedProductIndex', 'products'],
    components: { Modal, Datalist },

    data() {
        return {
            s, lang: ls.getLang(), inputProdName: '', inputProdPrice: '', inputProdQuantity: '',
            inputProdCost: '', isApprox: isApprox || false, alert: { isShown: false, text: '' },
            units, useCustomUnits, unit: unit || 0, currency: currency || '₴', useDatalist,
            calcType: calcType === '0' || calcType === '1' ? calcType : '0', isNameInpFocused: false
        }
    },

    methods: {
        confirmAddOrEditProduct() {
            const prodObj = fn.getProductObject(this);
            if(!prodObj) return;
            if(this.$props.editedProductIndex === -1) {
                this.products.push(prodObj);
            } else {
                this.products[this.$props.editedProductIndex] = prodObj;
            }
            ls.setProducts(this.products);
            this.$emit('goback');
        },

        autoCalc() {
            fn.autoCalc(this);
        },

        onProductNameKeyup(e) {
           this.$refs.datalist.onkeyup(e);
        },

        onProductNameBlur() {
            setTimeout(() => this.isNameInpFocused = false, 10);
        }
    },

    mounted() {
        if(this.$props.editedProductIndex !== -1) {
            const { calcType, cost, isApprox, name, price, quantity,
                unitName } = this.products[this.$props.editedProductIndex];
            this.calcType = calcType, this.inputProdName = name, this.isApprox = isApprox,
            this.inputProdPrice = price, this.inputProdQuantity = quantity, this.inputProdCost = cost;
            const unit = this.units.findIndex(u => u.includes(unitName));
            if(unit !== -1) this.unit = unit;
        }
    },

    watch: {
        unit(value) {
            ls.setLastUsed({ unitName: units[unit][lang], calcType: this.calcType, isApprox: this.isApprox });
            unit = value; 
        },

        calcType(value) {
            ls.setLastUsed({ unitName: units[unit][lang], calcType: value, isApprox: this.isApprox });
            calcType = value;
        },

        isApprox(value) {
            ls.setLastUsed({ unitName: units[unit][lang], calcType: this.calcType, isApprox: value });
            isApprox = value;
        }
    }
}
</script>

<style scoped>
    div .confirmbutton {
        background-color:rgba(0, 0, 255, 0.9);
        filter:sepia(50%);
        margin: 0 auto;
    }
</style>