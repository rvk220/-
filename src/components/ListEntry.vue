<template>
  <li class="list-group-item p-1 mb-1 lh-sm">{{ liText }}</li>
</template>

<script>
import s from '../composables/Strings.js';
export default {
    props: ['prodObj', 'num', 'lang', 'settings'],

    computed: {
      liText: function() {
        const { settings, lang } = this.$props;
        const currency = settings.currency || '₴';
        let { name, price, cost, isApprox, unitName, quantity } = this.prodObj;
        if(!name) name = s.defaultProdName[lang];
        return `${this.num + 1}) ${name} ${(() => {
          if(!price || (quantity == 1 && ['шт', 'pcs'].includes(unitName))) {
            return '';
          } else if(quantity == 0) {
            return ` (${price} ${currency}/${unitName})`;
          } else {
            return ` (${price} ${currency}/${unitName}, ${isApprox ? '≈ ' : ''}${quantity} ${unitName})`;
          }
        })()} – ${cost} ${currency}`;
      }
    }
}
</script>

<style scoped>
  li:not(:last-child):after{
	  content: ";";
  }
  li:last-child:after{
	  content: ".";
  }
</style>