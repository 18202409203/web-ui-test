<template>
    <div>
        <el-row>
            <div id="calendar_navigator"></div>
        </el-row>
        <el-row>
            <main-chart ref="navor"></main-chart>
        </el-row>
    </div>
</template>

<script>
import * as d3 from 'd3'
import axios from 'axios'
import mainChart from './bubble.vue'

export default {
    components: { mainChart },
    data() {
        return {
            dataSet: [],
            WIDTH: 960,
            HEIGHT: 200,
            CELL_SIZE: 20,
            CURRENT_YEAR: 2015,
            EQUIPMENT_STOP_NUM_MAX: 100
        };
    },
    methods: {
        fetchData () {
            let vm = this
            // fetch data
            axios.get("/static/" + vm.CURRENT_YEAR + ".json").then(function (response) {
                if(response.status === 200) {
                    vm.dataSet = response.data
                    vm.EQUIPMENT_STOP_NUM_MAX = vm.dataSet[0].equipmentstopnum
                    for (let i = 0; i < vm.dataSet.length; i ++) {
                        if (vm.dataSet[i].equipmentstopnum > vm.EQUIPMENT_STOP_NUM_MAX ) {
                            vm.EQUIPMENT_STOP_NUM_MAX = vm.dataSet[i].equipmentstopnum
                        }
                    }
                    vm.paint()
                } else {
                    console.log('error')
                }
            }).catch(error => {
                console.log(error)
            })
        },
        generateToolTip () {
        // Tooltip Object
        this.tooltip = d3.select("#calendar_navigator")
            .append("div").attr("id", "tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style('background-color', '#fff')
            .style('border', '2px solid #ccc')
            .style('padding', '10px')
            .text("a simple tooltip");
        },
        paint() {
            // paint function
            let vm = this;
            var svg = d3.select("#calendar_navigator")
                .selectAll("svg")
                .data(d3.range(vm.CURRENT_YEAR, vm.CURRENT_YEAR + 1))
                .enter()
                .append("svg")
                .style("width", '100%')
                .attr("height", vm.HEIGHT)
                .append("g")
                // .attr( "transform", "translate(" + (vm.WIDTH - vm.CELL_SIZE * 53) / 2 + "," + (vm.HEIGHT - vm.CELL_SIZE * 7 - 1) + ")" );
                .attr( "transform", "translate(" + vm.CELL_SIZE * 2 + "," + vm.CELL_SIZE * 2 + ")" );

            svg.append("text")
                .attr(
                  "transform",
                  "translate(-6," + vm.CELL_SIZE * 3.5 + ")rotate(-90)"
                )
                .attr("font-family", "sans-serif")
                .attr("font-size", 15)
                .attr("text-anchor", "middle")
                .text(function(d) {
                    return d;
                });

            var chartContainer = svg
                .append("g")
                .attr("fill", "none")
                .attr("stroke", "#ccc")

            var rect = svg
                .append("g")
                .attr("fill", "none")
                .attr("stroke", "#ccc")
                .selectAll("rect")
                .data(function(d) {
                    return d3.timeDays(new Date(vm.CURRENT_YEAR, 0, 1), new Date(vm.CURRENT_YEAR + 1, 0, 1));
                })
                .enter()
                .append("rect")
                .attr("width", vm.CELL_SIZE)
                .attr("height", vm.CELL_SIZE)
                .attr("x", function(d) {
                    return d3.timeWeek.count(d3.timeYear(d), d) * vm.CELL_SIZE;
                })
                .attr("y", function(d) {
                    return d.getDay() * vm.CELL_SIZE;
                })
                .datum(d3.timeFormat("%Y-%m-%d"));

            svg.append("g")
                .attr("fill", "none")
                .attr("stroke", "#000")
                .selectAll("path")
                .data(function(d) {
                    return d3.timeMonths(new Date(vm.CURRENT_YEAR, 0, 1), new Date(vm.CURRENT_YEAR + 1, 0, 1));
                })
                .enter()
                .append("path")
                .attr("d", pathMonth);

            // color
            var color = d3.scaleQuantile ()
                .domain(d3.range(1, vm.EQUIPMENT_STOP_NUM_MAX))
                .range(d3.schemeReds[9]);

            // brush
            // svg.append("g")
            // .call(d3.brush()
            // .extent([[0, 0], [1060, 140]])
            // .on("brush", brushed).on("end", brushended));

            // function brushed() {

            // }
            // function brushended() {

            // }

            // data 
            var data = d3
                .nest()
                .key(function(d) {
                    return d.date;
                })
                .rollup(function(d) {
                    return (d[0].equipmentstopnum);
                })
                .object(vm.dataSet);

            rect.filter(function(d) {
                    return d in data; // 日期存在于取得数据中
                })
                .attr("fill", function(d) {
                    return color(data[d]);
                })

            //  Tooltip
            // mouse over
            rect.on("mouseover", mouseover);
            function mouseover(d) {
                vm.tooltip.style("visibility", "visible");
                var equipment_stop_num = (data[d] !== undefined) ? (data[d]) : (0);
                var tips_text = "Date: " + d + " </br> StopNum: " + equipment_stop_num;
                vm.tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                vm.tooltip.html(tips_text)
                    // 相对于 body 的位置
                    // .style("left", (d3.event.pageX) + "px")
                    // .style("top", (d3.event.pageY) + "px")
                    .style("left", d3.event.layerX + vm.CELL_SIZE + "px")
                    .style("top", d3.event.layerY + vm.CELL_SIZE +  "px")
                d3.select(this)
                   .style("stroke", "black")
                   .style("stroke-width", "2px")
            }
            // mouse out
            rect.on("mouseout", mouseout);
            function mouseout (d) {
                vm.tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                var $tooltip = $("#tooltip");
                $tooltip.empty();
                d3.select(this)
                   .style("stroke", "")
                   .style("stroke-width", "")
            }

            // click
            rect.on("click", handleClick);
            function handleClick (d) {
                console.log(d)
                // 触发子组件取数函数
                vm.$refs.navor.fetchData(d)
            }

            // month path
            function pathMonth(t0) {
                var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                  d0 = t0.getDay(),
                  w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
                  d1 = t1.getDay(),
                  w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
                return ( "M" + (w0 + 1) * vm.CELL_SIZE + "," + d0 * vm.CELL_SIZE + "H" + w0 * vm.CELL_SIZE + "V" + 7 * vm.CELL_SIZE + "H" + w1 * vm.CELL_SIZE + "V" + (d1 + 1) * vm.CELL_SIZE +       "H" + (w1 + 1) * vm.CELL_SIZE + "V" + 0 + "H" + (w0 + 1) * vm.CELL_SIZE + "Z");
            }

            var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
                .data(function(d) {
                    return d3.timeMonths(new Date(vm.CURRENT_YEAR, 0, 1), new Date(vm.CURRENT_YEAR + 1, 0, 1)); })
                .enter().append("text")
                .text(monthTitle)
                .attr("x", function(d, i) {
                    var week = d3.timeFormat('%U')
                    var year = d3.timeFormat('%Y')
                    // var month = d3.timeFormat('%m')
                    var week_diff = week(d) - week(new Date(year(d), 0, 1) ); 
                    var month_padding = week_diff * vm.CELL_SIZE
                    return month_padding;
                })
                .attr("y", function(d, i) {
                    return -5
                })
                .attr("class", "month-title")
                .attr("d", monthTitle);
            function monthTitle (t0) {
                return t0.toLocaleString("en-us", { month: "short" });
            }
        }
    },
    mounted() {
        this.fetchData();
        if (document.getElementById('tooltip') === null) {
            this.generateToolTip(); // 只一次
        }
    }
};
</script>

<!--
<style>
.brush{fill:#FF0;}
.brush .extent{fill-opacity: .825;}
.brush .background{fill: red;}
</style>
-->

