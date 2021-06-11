
<template>
<div>
  <button type="button" ref="modalButton" data-bs-toggle="modal" data-bs-target="#exampleModal" style="display:none;"></button>

<!-- Modal -->
<div class="modal fade" ref="modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body pb-0">
        {{ text }}
      </div>
      <div class="modal-footer">
        <button ref="closeBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ cancel }}
        </button>
        <button type="button" v-if="type === 'confirm'" @click="onConfirm" class="btn btn-primary">
            {{ confirm }}
        </button>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import ls from '@/composables/LocalStorage.js';
import s from '@/composables/Strings.js';
export default {
    props: ['text', 'type'],

    data() {
      return { lang: ls.getLang(), confirm: '', cancel: '' }
    },

    methods: {
      onConfirm() {
        this.$emit('confirm');
        this.$refs.closeBtn.click();
      }
    },

    created() {
      this.confirm = s.confirm[this.lang];
      this.cancel = this.$props.type === 'confirm' ? s.cancel[this.lang] : s.close[this.lang];
    },

    mounted() {
      this.$refs.modalButton.click();
      this.$refs.modal.addEventListener('hidden.bs.modal', () => this.$emit('close'));
    }
}
</script>

<style scoped>
  
</style>