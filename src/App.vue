<template>
<div>
    <h1>Закупівля</h1>
</div>
  <router-view/>
</template>

<style>
  html body {
    max-height: 100vh;
    overflow: auto;
    background-image: url('./assets/background.jpg');
    background-size:300vh;
    font-family: ‘Oswald’, sans-serif;
  }

  #app {
    max-width: 600px;
    margin: 0 auto;
    height: 100vh;
  }

  #app h1 {
    font-size: 2rem;
    text-align: center;
    margin: 5px 0px 0px;
    color: #0000cc;
    filter:sepia(50%);
    margin-bottom: 0.5rem;
  }
</style>
