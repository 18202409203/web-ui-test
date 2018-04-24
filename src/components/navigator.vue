<template>
    <div class="bg">
        <div class="title">
           <span>导航</span>
        </div>
        <router-link to="/pec">
            <div class="nav">
                <span>工艺配置</span>
            </div>
        </router-link>
        <router-link to="/tl">
            <div class="nav">
                <span>时间线</span>
            </div>
        </router-link>
        <router-link to="/calendar">
            <div class="nav">
                <span>日历导航</span>
            </div>
        </router-link>
        <router-link to="/test">
            <div class="nav">
                <span>测试</span>
            </div>
        </router-link>
        <router-link to="/flow">
            <div class="nav">
                <span>流程图</span>
            </div>
        </router-link>
    </div>
</template>
<script>
export default {
  data() {
      return {

      }
  },
  methods: {
      handleclick () {

      }
  }
}
</script>

<style>
.title {
    width: 100%;
    background: #fff;
}
.nav {
    width: 100%;
    height: 30px;
}
.bg {
    background: #ddd;
    height: 100%;
    overflow: auto;
}
</style>
<style scoped>
a {
    text-decoration: none;
}
.router-link-active .nav{
    text-decoration: none;
    background: steelblue;
}
</style>

