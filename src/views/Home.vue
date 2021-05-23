<template>
  <div class="goToSettings">
    <button type="button" class="btn btn-sm btn-link">Налаштування</button>
  </div>
  <div class="container" style="height:200%;">
    
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>

<style>
  .goToSettings {
    position:fixed;
    top:0px;
    right:0px;
  }

  .goToSettings .btn {
    color:grey;
  }

  .goToSettings .btn:focus {
    color:grey;
  }

  btn {

  }

  .btn:focus {
    box-shadow: none !important;
  }
</style>
