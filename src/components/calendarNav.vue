<template>
  <div>
      <el-row>
      <!-- 年份选择 -->
        <el-date-picker
          @change="handleChange"
          v-model="currentYearDate"
          align="right"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </el-row>
      <el-row>
        <div id="calendar_nav" ></div>
      </el-row>
  </div>
</template>

<script>
import * as d3 from 'd3'
import axios from 'axios'

export default {
  data () {
      return {
          currentYearDate: new Date(),
          currentYear: new Date().getFullYear(),
          data_calendar_nav: [],
          EQUIPMENT_STOP_NUM_MAX: 100,
          tooltip: {}
      }
  },
  watch: {
  },
  methods: {
      handleChange (val) {
          this.currentYear = Number(val)
          this.remove()
          this.paint()
      },
      remove () {
          d3.select('svg').remove()
      },
      generateToolTip () {
          //  Tooltip Object
          this.tooltip = d3.select("body")
            .append("div").attr("id", "tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .text("a simple tooltip");
      },
      paint () {
            var vm = this
            // copy code here after
            const cellSize = 15
            const height = cellSize * 6 + 20 * 2 + 30
            const width = cellSize * 7 * 12 + 100
        
            // var no_months_in_a_row = Math.floor(width / (cellSize * 7));
            var no_months_in_a_row = 12;
            var shift_up = cellSize * 3;
        
            var day = d3.timeFormat("%w"), // day of the week
                day_of_month = d3.timeFormat("%e"), // day of the month
                day_of_year = d3.timeFormat("%j"),
                week = d3.timeFormat("%U"), // week number of the year
                month = d3.timeFormat("%m"), // month number 几月就是几
                year = d3.timeFormat("%Y"),
                percent = d3.format(".1%"),
                format = d3.timeFormat("%Y-%m-%d");
        
            var calendar_nav = d3.select('#canlender_nav')
                .style("height", height + 'px')
                .style("width", '100%')
        
            var svg = d3.select("#calendar_nav").selectAll("svg")
                .data(d3.range(vm.currentYear, vm.currentYear + 1))
                .enter().append("svg")
                // .attr("width", width)
                .attr("height", height)
                .attr("class", "RdYlGn auto_width")
                .append("g")
        
            // day cell
            var rect = svg.selectAll(".day")
                .data(function(d) { 
                  return d3.timeDays(new Date(vm.currentYear, 0, 1), new Date(vm.currentYear + 1, 0, 1));
                })
                .enter().append("rect")
                .attr("class", "day")
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("x", function(d) {
                  var month_padding = 1.2 * cellSize*7 * ((month(d)-1) % (no_months_in_a_row));
                  return day(d) * cellSize + month_padding; 
                })
                .attr("y", function(d) { 
                  var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) ); // 日 在第几行
                  // var row_level = Math.ceil(month(d) / (no_months_in_a_row));
                  var row_level = 1 // 月份第几行
                  return (week_diff*cellSize) + row_level*cellSize*8 - cellSize/2 - shift_up;
                })
                .datum(format);
        
            // month titles
            var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
                  .data(function(d) {
                    return d3.timeMonths(new Date(vm.currentYear, 0, 1), new Date(vm.currentYear + 1, 0, 1)); })
                  .enter().append("text")
                  .text(monthTitle)
                  .attr("x", function(d, i) {
                    var month_padding = 1.2 * cellSize*7* ((month(d)-1) % (no_months_in_a_row));
                    return month_padding;
                  })
                  .attr("y", function(d, i) {
                    var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) ); // 当前周与本月一号周差
                    // var row_level = Math.ceil(month(d) / (no_months_in_a_row));
                    var row_level = 1
                    return (week_diff*cellSize) + row_level*cellSize*8 - cellSize - shift_up;
                  })
                  .attr("class", "month-title")
                  .attr("d", monthTitle);
        
            // year titles
            // var year_titles = svg.selectAll(".year-title")  // 2018
            //       .data(function(d) {
            //         return d3.timeYears(new Date(vm.currentYear, 0, 1), new Date(vm.currentYear + 1, 0, 1)); })
            //       .enter().append("text")
            //       .text(yearTitle)
            //       .attr("x", function(d, i) { return width/2 - 100; })
            //       .attr("y", function(d, i) { return cellSize*5.5 - shift_up; })
            //       .attr("class", "year-title")
            //       .attr("d", yearTitle);
        
            // fetch data
            axios.get("/static/" + vm.currentYear + ".json").then(function (response) {
                if(response.status === 200){
                  // 得到数据
                  vm.data_calendar_nav = response.data
                  // 处理数据成为MAP结构
                  var data = d3.nest()
                      .key(function(d) { return d.date; })
                      .rollup(function(d) { return d[0].equipmentstopnum })
                      // .entries(vm.data_calendar_nav)
                      .map(vm.data_calendar_nav);
                  // 自适应取得 故障设备 的 最大数量
                  vm.EQUIPMENT_STOP_NUM_MAX = vm.data_calendar_nav[0].equipmentstopnum
                  for (let i = 0; i < vm.data_calendar_nav.length; i ++) {
                      if (vm.data_calendar_nav[i].equipmentstopnum > vm.EQUIPMENT_STOP_NUM_MAX ) {
                          vm.EQUIPMENT_STOP_NUM_MAX = vm.data_calendar_nav[i].equipmentstopnum
                      }
                  }
                  // 量子化 定义 颜色转换函数
                  var color = d3.scaleQuantize()
                      .domain([1, vm.EQUIPMENT_STOP_NUM_MAX])
                      .range(d3.range(1,11,1).map(function(d) { return "q" + d + "-11"; }));
        
                    // 赋值颜色
                    rect.attr("class", function(d) { return "day " + color(data['$' + d]); })
                        // .select("title")
                        // .text(function(d) { return d + ": " + (data['$' + d]); });
              
                    //  Tooltip
                    rect.on("mouseover", mouseover);
                    function mouseover(date) {
                      let d = '$' + date
                      vm.tooltip.style("visibility", "visible");
                      var equipment_stop_num = (data[d] !== undefined) ? (data[d]) : (0);
                      var purchase_text = date + ": " + equipment_stop_num;
              
                      vm.tooltip.transition()
                                  .duration(200)
                                  .style("opacity", .9);
                      vm.tooltip.html(purchase_text)
                                  .style("left", (d3.event.pageX)+30 + "px")
                                  .style("top", (d3.event.pageY) + "px"); 
                    }
                    rect.on("mouseout", mouseout);
                    function mouseout (date) {
                      let d = '$' + date
                      vm.tooltip.transition()
                              .duration(500)
                              .style("opacity", 0);
                      var $tooltip = $("#tooltip");
                      $tooltip.empty();
                    }
                    // click
                    rect.on("click", handleClick);
                    function handleClick (d) {
                        console.log(d)
                    }
                } else {
                  console.log('error')
                }
            }).catch(function (error) {
              console.log(error)
            })
        
            // display data
        
            function dayTitle (t0) {
              return t0.toString().split(" ")[2];
            }
            function monthTitle (t0) {
              return t0.toLocaleString("en-us", { month: "short" });
            }
            function yearTitle (t0) {
              return t0.toString().split(" ")[3];
            }
        
        
            // copy code here before
      }
  },
  mounted() {
      this.generateToolTip()
      this.paint()
  },
};
</script>

    <style>

      #calendar_nav{
        padding: 0;
        margin-left: 20px;
        /* width: 100%; */
        /* height: 110px; */
        /* overflow: hidden; */
        /* margin: 0 auto; */
      }
      .background {
        fill: #eee;
      }

      line {
        stroke: #fff;
      }

      text.active {
        fill: red;
      }

      .day {
        fill: #fff;
        stroke: #ccc;
      }

      .month {
        fill: none;
        stroke: #fff;
        stroke-width: 4px;
      }

      /* color ranges */
      .RdYlGn .q11-11{fill:rgb(165,0,38)}
      .RdYlGn .q10-11{fill:rgb(215,48,39)}
      .RdYlGn .q9-11{fill:rgb(244,109,67)}
      .RdYlGn .q8-11{fill:rgb(253,174,97)}
      .RdYlGn .q7-11{fill:rgb(254,224,139)}
      .RdYlGn .q6-11{fill:rgb(255,255,191)}
      .RdYlGn .q5-11{fill:rgb(217,239,139)}
      .RdYlGn .q4-11{fill:rgb(166,217,106)}
      .RdYlGn .q3-11{fill:rgb(102,189,99)}
      .RdYlGn .q2-11{fill:rgb(26,152,80)}
      .RdYlGn .q1-11{fill:rgb(0,104,55)}
      .RdYlGn .q0-11{fill:rgb(255,255,255)}

      /* hover info */
      #tooltip {
        background-color: #fff;
        border: 2px solid #ccc;
        padding: 10px;
      }

      svg:not(:root) {
        overflow: auto;
        padding: 0;
      }
      
      .auto_width {
        width: 100%;
      }
    </style>