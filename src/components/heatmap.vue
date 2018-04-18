<template>
  <div>
      <el-row>
        <calendar-nav @select="handleClick"></calendar-nav>
      </el-row>
  </div>
</template>

<script>
import calendarNav from './calendarNav.vue'

export default {
  data () {
      return {
          
      }
  },
  methods:{
      handleClick (val) {
          console.log(val)
      }
  },
  components: { calendarNav }
}
</script>

