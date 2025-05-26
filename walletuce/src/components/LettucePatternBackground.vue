<template>
  <v-app>
    <div class="lettuce-bg">
      <slot />
    </div>
  </v-app>
</template>

<style>
.lettuce-bg {
  height: 100vh;
  width: 100vw;
  background-image: url("@/assets/lettuce-patern.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
