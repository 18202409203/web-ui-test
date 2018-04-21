<template>
    <div>
        <div id="bubble_container" style="border: red 1px solid;"></div>
        <div id="nanding" style="border: 1px solid green;height: 500px;width: 100%;"></div>
    </div>
</template>

<script>
import * as d3 from 'd3'
import { legendColor } from 'd3-svg-legend'
import tip from 'd3-tip'
import axios from 'axios'
import {Equipment} from '../components/js/equipment.js'

export default {
    data () {
        return {
            temp: 0,
            ip: 'http://219.216.80.110:8080/',
            dataSet: [], // 原始数据
            dataNest: [], // 处理后的数据
            DATE: new Date(),
            width_bubble: 1000,
            height_bubble: 750,
            innerWidth: 0,
            innerHeight: 0,
            margin: {}
        }
    },
    methods: {
        init () {
            // console.log(this.temp)
        },
        paint () {
            // paint
            let vm = this
            // xAxis
            const xValue = (d) => {
                for( let i = 0; i < vm.procedures.length; i ++) {
                    if (vm.procedures[i].procedureid === d.value.data[0].procedureId) {
                        return i
                    }
                }
            };
            const xLabel = 'Procedures';
            // yAxis
            const yValue = d => {
                return Number(d.value.total)
            };
            const yLabel = 'Stop Time';
            // color legend
            const colorValue = d => d.value.data[0].equipmentType;
            const colorLabel = 'Equipment Types';
            // canvas settings
            const margin = { left: 90, right: 200, top: 4, bottom: 125 };
            vm.margin = margin
            const svg = d3.select('#bubble_container')
                .append('svg')
                .attr('width', vm.width_bubble)
                .attr('height', vm.height_bubble)
            const width = svg.attr('width');
            const height = svg.attr('height');
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;
            vm.innerWidth = innerWidth
            vm.innerHeight = innerHeight
            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top+60})`);
            const xAxisG = g.append('g')
                .attr('transform', `translate(0, ${innerHeight})`);
            const yAxisG = g.append('g');
            const colorLegendG = g.append('g')
                .attr('transform', `translate(${innerWidth + 90}, 140)`);
            // text labels
            g.append('text')
                .attr('class', 'subtitle')
                .attr('x', 170)
                .attr('y', margin.top-40)
           	    .style('font-weight', 'bold')
                .text('Equipment\'s Stop Time on ' + vm.DATE + ' Based on Procedure');
            xAxisG.append('text')
                .attr('class', 'axis-label')
                .attr('x', innerWidth / 2)
                .attr('y', 50)
                .text(xLabel);
            yAxisG.append('text')
                .attr('class', 'axis-label')
                .attr('x', -innerHeight / 2)
                .attr('y', -60)
                .attr('transform', `rotate(-90)`)
                .style('text-anchor', 'middle')
                .text(yLabel);
            colorLegendG.append('text')
                .attr('class', 'legend-label')
                .attr('x', -50)
                .attr('y', -60)
                .text(colorLabel);
            const xScale = d3.scaleLinear();
            const yScale = d3.scaleLinear();
            const colorScale = d3.scaleOrdinal()
                .range(d3.schemePaired); // 12 colors
            const xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(15)
                .tickPadding(10)
                .tickSize(-innerHeight)
                .tickFormat(d3.format("0"));
            const yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(15)
                .tickPadding(22)
                .tickSize(-innerWidth)
                .tickFormat(d3.format("0"));
            const colorLegend = legendColor()
                .scale(colorScale)
                .shape('circle');
            // const row = d => {
            //   d.year = +d.year;
            //   d.EventDescription = +d.EventDescription;
            //   return d;
            // };
            xScale
                .domain([1, vm.procedures.length])
                .range([0, innerWidth])
                .nice();
            yScale
                .domain(d3.extent(vm.dataNest, yValue))
                .range([innerHeight, 0])
                .nice();
            // scale 映射 圆 半径
            var r_scale = d3.scaleLinear()
                .domain([0, 24 * 30])
                .range([10, 20])
            // tips
            var tips = tip()
                .attr('class', 'd3-tip')
                .offset([0, 0])
                .html(function(d) {
                    return "Equipment Name: <span style='color:orangered'>" + d.key + "</span>";
                });
            svg.call(tips)
            // circle
            var circle = g.selectAll('circle').data(vm.dataNest)
                .enter().append('circle')
                .attr('cx', d => xScale(xValue(d))) // x procedure
                .attr('cy', d => yScale(yValue(d))) // y by equipment
                .attr('fill', d => colorScale(colorValue(d)))
                .attr('fill-opacity', 0.8)
                .attr('r', d => r_scale( yValue(d) ) )
            // pie of equipment
            g.selectAll('circle').each(function (d) {
                vm.paintEquipment(d, this)
            })

            xAxisG.call(xAxis);
            yAxisG.call(yAxis);
            // legend
            colorLegendG.call(colorLegend)
                .selectAll('.cell text')
                .attr('dy', '0.1em');
            // event
            circle.on('mouseover', tips.show)
            circle.on('mouseout', tips.hide)
            circle.on('click', circleClick)
            function circleClick (d) {
                console.log(d)
                vm.paintEquipment(d, this)
            }
        },
        // paint equipment
        paintEquipment (d, _this){
            let vm = this
            let equip = new Equipment(d)
            console.log(_this.cx)
            var _svg = d3.select('#bubble_container').append('svg')
                .attr("width", 100)
                .attr("height", 100)
                .style('position', 'absolute')
                // .style('left', _this.cx.animVal.value + vm.innerWidth + 'px')
                // .style('top', _this.cy.animVal.value + vm.innerHeight + 'px')
                .style('left', _this.cx.animVal.value + vm.margin.left - 50 + 'px')
                .style('top', _this.cy.animVal.value + vm.margin.top + 10 + 'px')
                .append("g")
                .attr("transform", "translate(" + Number(100 / 2) + "," + Number(100 / 2) + ")")
            equip.init(_svg)
        },
        // fetch data
        fetchData (date) {
            this.DATE = date
            let vm = this
            d3.select('#bubble_container svg').remove()
            axios.get(this.ip + 'lyj/stoptime/getStopTimeOnEquipByDateAndProcedureid/' + '2015-01-01' + '/' + '2015-02-01' + '/all').then(response => {
                if(response.status === 200) {
                    // console.log(response.data)
                    this.dataSet = response.data
                    // 数据处理
                    this.dataNest = d3.nest()
                        .key(function(d) {return d.equipmentName})
                        .rollup(function (d) {return{
                            count: d.length,
                            total: d3.sum(d, function(v) {return v.stopTime}),
                            data: d
                        }})
                        .entries(vm.dataSet)
                    console.log(this.dataNest)
                    this.paint()
                } else if (response.status === 204) {
                    this.dataSet = []
                    this.paint()
                }
            }).catch(error => {
                console.log(error)
            })
        },
        // 取工艺
        getProcedureDescribe () {
            var vm = this
            axios.get(this.ip + '/xt/indexMonitor/selectProcedureDescribeInformation').then(function (response) {
                if(response.status === 200){
                    vm.procedures = response.data
                    console.log(vm.procedures)
                } else {
                    vm.procedures = []
                }
            }).catch(function (error) {
                vm.procedures = []
                console.log(error)
            })
       },
    },
    mounted() {
        this.init()
        this.getProcedureDescribe()
    }
}
</script>
<style>
    #bubble_container {
        width: 100%;
        height: 750px;
        position: relative;
    }
</style>
<style>
  .domain {
    display: none;
  }
  .tick line {
    stroke: #fff;
  }
  .tick text, .legendCells text {
    fill: #423e3c;
    font-size: 9pt;
    font-family: sans-serif;
  }
  .axis-label, .legend-label {
    fill: #343331;
    font-size: 14pt;
    font-family: sans-serif;
  }
  .subtitle {
    font-size: 16pt;
  	font-family: sans-serif;
  	alignment-baseline: middle;
  	fill: #434343;
}
.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}

/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: "\25BC";
  position: absolute;
  text-align: center;
}

/* Style northward tooltips differently */
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}
</style>
<style>
.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.bar {
  fill: orange;
}

.solidArc:hover {
  fill: orangered ;
}

.solidArc {
    -moz-transition: all 0.3s;
    -o-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
}

.x.axis path {
  display: none;
}

.aster-score { 
  line-height: 1;
  font-weight: bold;
  font-size: 500%;
}

svg {
    overflow: visible;
}
</style>


