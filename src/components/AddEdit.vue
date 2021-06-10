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
            <input v-model="inputProdName" @keyup.enter="confirmAddOrEditProduct" ref="nameInp" id="nameInp" type="text" class="form-control" autocomplete="off" @focus="onNameInputFocusChange(true)" @blur="onNameInputFocusChange(false)" @keyup="onProductNameKeyup">
            <label for="floatingInput">{{ s.inputProdName[lang] }}</label>
            <Datalist ref="datalist" v-show="useDatalist && isNameInpFocused" />
        </div>
        <div class="form-floating mb-1">
            <input v-model="inputProdPrice" @input="autoCalc" @keyup.enter="confirmAddOrEditProduct" type="number" class="form-control">
            <label for="floatingInput">{{ `${s.inputProdPrice[lang]} (${currency}/${units[unit][lang]})` }}</label>
        </div>
        <div class="form-check ms-3">
            <input v-model="isApprox" class="form-check-input" type="checkbox">
            <label class="form-check-label" for="flexCheckDefault">
                {{ s.approxDescription[lang] }}
            </label>
        </div>
        <div class="form-floating mb-1">
            <input v-model="inputProdQuantity" @input="autoCalc" @keyup.enter="confirmAddOrEditProduct" :disabled="calcType === '1'" type="number" class="form-control">
            <label for="floatingInput">{{ `${s.inputProdQuantity[lang]} (${units[unit][lang]})` }}</label>
        </div>
        <div class="form-floating mb-1">
            <input v-model="inputProdCost" @input="autoCalc" @keyup.enter="confirmAddOrEditProduct" :disabled="calcType === '0'" type="number" class="form-control">
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
export default {
    props: ['editedProductIndex', 'products'],
    components: { Modal, Datalist },

    data() {
        return {
            s, lang: ls.getLang(), inputProdName: '', inputProdPrice: '', inputProdQuantity: '',
            inputProdCost: '', isApprox: false, calcType: '0', unit: 0, units: [[]], useCustomUnits: false,
            useDatalist: false, currency: '₴', isNameInpFocused: false, alert: { isShown: false, text: '' }
        }
    },
    
    created() {
        const { units, useCustomUnits, useDatalist, currency } = ls.getSettings();
        this.units = units;
        if(this.$props.editedProductIndex === -1) {
            var { unitName, calcType, isApprox } = ls.getLastUsed();
        } else {
            var { calcType, cost, isApprox, name, price, quantity,
                unitName } = this.products[this.$props.editedProductIndex];
            this.inputProdName = name, this.inputProdPrice = price,
            this.inputProdQuantity = quantity, this.inputProdCost = cost;
        }

        const unit = units.findIndex(u => u.includes(unitName));
        if(unit !== -1) this.unit = unit;
        this.useCustomUnits = useCustomUnits;
        this.useDatalist = useDatalist;
        if(currency) this.currency = currency;
        if (calcType === '1' || calcType === '0') this.calcType = calcType;
        this.isApprox = isApprox || false;
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

        onNameInputFocusChange(isFocused) {
            if(isFocused) this.isNameInpFocused = true;
            else if(this.isNameInpFocused) setTimeout(() => this.isNameInpFocused = false, 200);
        }
    },

    watch: {
        unit() {
            ls.setLastUsed(this);
        },

        calcType() {
            ls.setLastUsed(this);
        },

        isApprox() {
            ls.setLastUsed(this);
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