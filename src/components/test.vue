<template>
  <div>
      <span>测试</span>
      <div id="chart" ></div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'non-vue-line-chart',
  mounted() {
    // const svg = d3.select('#chart')
    //   .append('svg')
    //   .attr('width', 500)
    //   .attr('height', 270)
    //   .append('g')
    //   .attr('transform', 'translate(0, 10)');
    // const x = d3.scaleLinear().range([0, 430]);
    // const y = d3.scaleLinear().range([210, 0]);
    // d3.axisLeft().scale(x);
    // d3.axisTop().scale(y);
    // x.domain(d3.extent(data, (d, i) => i));
    // y.domain([0, d3.max(data, d => d)]);
    // const createPath = d3.line()
    //   .x((d, i) => x(i))
    //   .y(d => y(d));
    // svg.append('path').attr('d', createPath(data));
  },
};
</script>
<style lang="sass" scoped>
svg
  margin: 25px;
  path
    fill: none
    stroke: #76BF8A
    stroke-width: 3px
</style>