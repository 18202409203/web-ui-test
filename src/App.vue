<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <el-col :span="2">
      <navigator></navigator>
    </el-col>
    <el-col :span="22">
      <router-view/>
    </el-col>
  </div>
</template>

<script>
import navigator from '../src/components/navigator.vue'
export default {
  name: 'App',
  components: { navigator }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
