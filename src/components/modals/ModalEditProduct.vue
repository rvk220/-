<template>
<div>
<button type="button" ref="modalButton" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" style="display:none;">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" ref="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header p-1">
        <h5 class="modal-title" id="exampleModalLabel">
          {{ s.modalEditProductHeader[lang] }}:
        </h5>
      </div>
      <div class="modal-body pt-0 pb-1">
        {{ vueObj.$refs.ul.children[prodInd].innerHTML }}
      </div>
			<div class="buttonSection addRemoveButtonsDiv">
				<img src="@/assets/remove1.png" style="width:22%" @click="clickRemove">
				<img src="@/assets/edit1.png" style="width:21%" @click="clickEdit">
        <img style="width:21%;" src="@/assets/copy1.png" @click="clickCopy">
			</div>
      <div class="modal-footer pt-1">
        <button type="button" ref="closeBtn" class="btn btn-secondary" data-bs-dismiss="modal">
            {{ s.cancel[lang] }}
        </button>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import s from '@/composables/Strings.js';
export default {
    props: ['prodInd', 'lang', 'vueObj'],
    
    data() { return { s }},

    mounted() {
      this.$refs.modalButton.click();
      this.$refs.modal.addEventListener('hidden.bs.modal', () => {
        this.$emit('close');
      });
    },

    methods: {
      clickCopy() {
        this.$emit('copy', this.prodInd);
        this.$refs.closeBtn.click();
      },

      clickRemove() {
        this.$emit('remove', this.prodInd);
        this.$refs.closeBtn.click();
      },

      clickEdit() {
        this.$emit('edit', this.prodInd);
        this.$refs.closeBtn.click();
      }
    }
}
</script>

<style scoped>


  .modal-content {
    background-color: rgb(245, 237, 220);
  }

  div .modal-header h5 {
    font-size: 1.1em;
  }

  .addRemoveButtonsDiv img {
    margin: 0 10px;
  }
</style>