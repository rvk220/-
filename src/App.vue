<template>
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
    max-width: 400px;
    margin: 0 auto;
    max-height: 100vh;
    position: relative;
  }

  #app h1 {
    font-size: 2rem;
    text-align: center;
    margin: 5px 0px 0px;
    color: #0000cc;
    filter:sepia(50%);
    margin-bottom: 0.5rem;
  }

  .btn:focus, select:focus, a:focus, input:focus {
    box-shadow: none !important;
  }

  div .material-icons {
    position:absolute;
    top:5px;
    left:5px;
    font-size: 2.1rem;
    color:gray;
    filter:sepia(50%);
  }

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
      line-height: 1.2;
      width: 100%;
  }

  div .form-floating select:focus {
      background: white;
  }

  div .form-floating input:disabled, .form-floating input:disabled+label {
    opacity: 50%;
  }

  ul {
    list-style-type: none;
    padding:0;
    margin:0;
  }

  div ul li.list-group-item {
    background-color: rgb(250, 247, 241);
    text-align: justify;
    font-size: 1.5rem;
  }

  div .modal {
    white-space: pre-wrap;
    line-height: 1.5rem;
  }

  div .modal-footer .btn-primary {
      background-color:rgba(0, 0, 255, 0.9);
      filter:sepia(50%);
      margin: 0 auto;
  }

  div .btn-secondary {
    margin: 0 auto;
    background-color: rgb(158, 152, 141);
  }

  div .modal-dialog {
    max-width: 400px;
    margin: 0 2%;
  }

  div .modal-header h5 {
    color: #0000cc;
    filter:sepia(50%);
    text-align: center;
    margin: 0 auto;
  }

  .modal-content div {
    border:none;
  }

  div .modal-content {
    text-align: justify;
    background-color: rgb(250, 247, 241);
  }
</style>
