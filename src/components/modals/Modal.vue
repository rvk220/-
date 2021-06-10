
<template>
<div>
  <button type="button" ref="modalButton" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" style="display:none;"></button>

<!-- Modal -->
<div class="modal fade" ref="modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body pb-0">
        {{ text }}
      </div>
      <div class="modal-footer">
        <button ref="closeBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
        </button>
        <button type="button" v-if="type === 'confirm'" @click="onConfirm" class="btn btn-primary">
            Confirm
        </button>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
export default {
    props: ['text', 'type'],

    methods: {
      onConfirm() {
        this.$emit('confirm');
        this.$refs.closeBtn.click();
      }
    },

    mounted() {
      this.$refs.modalButton.click();
      this.$refs.modal.addEventListener('hidden.bs.modal', () => this.$emit('close'));
    }
}
</script>