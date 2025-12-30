<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup></script>

<style>
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/inter.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

body {
  font-family: 'Inter', sans-serif;
}
</style>
