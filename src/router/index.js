import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import pec from '../components/procedureEquipmentConfig.vue'
import timelines from '../components/timelines.vue'
import test from '../components/test.vue'
import flow from '../components/flowchart.vue'
import calendar from '../components/calendarNav_new.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/pec',
      name: 'pec',
      component: pec
    },
    {
      path: '/tl',
      name: 'tl',
      component: timelines
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/flow',
      name: 'flow',
      component: flow
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: calendar
    },
  ]
})
