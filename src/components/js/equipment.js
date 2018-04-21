import * as d3 from 'd3'
export function Equipment (equipData) {

    this.data = equipData.value.data // 数据
    this.total = equipData.value.total // 停歇总时间
    this.count = equipData.value.count // 停歇原因类别个数
    this.name = equipData.key // 设备名称
    this.max = d3.max(this.data, d => Number(d.stopTime) ) // 最长停歇时间
}

Equipment.prototype.init = function (_this){
    let vm = this
    console.log(vm.max)
    // scale font size / radius
    var fontScale = d3.scaleLinear()
        .domain([0, 24 * 30])
        .range([10 ,20])
    // radius
    var innerRadius = fontScale(vm.total),
        radius = 3 * innerRadius;
    
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.width; });
    
    // var tip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([0, 0])
    //     .html(function(d) {
    //         return d.value.data.label + ": <span style='color:orangered'>" + d.data.stopTime + "</span>";
    //     });

    // 基于_this画图
    var svg = _this
    
    // svg.call(tip);

    // 12 colors
    const colorScale = d3.scaleOrdinal()
        .range(d3.schemePaired);
    const colorValue = d => d.stopCauseCode;
    // 半径 scale
    const radiusScale = d3.scaleLinear()
        .domain([0, vm.max])
        .range([innerRadius, radius])
    // 数据处理
    var data_new = []
    for (let d of vm.data) {
        let temp = {'id': '', 'color': '', 'stopTime': 0, 'width': 0, 'label': ''}
        temp.id     =  d.procedureId; // 停歇原因id
        temp.color  =  colorScale(colorValue(d)); // 以某种规则去配色,按照 停歇原因 渐变色
        // d.weight = +d.weight; // 权重
        // temp.stopTime  = +d.stopTime; // 半径长度
        temp.stopTime  = radiusScale(+d.stopTime); // 半径长度
        temp.width  = +d.stopTime; // 角度是一个维度
        temp.label  =  d.stopCauseName; // 停歇原因
        data_new.push(temp)
    };
    console.log(data_new)
      
    // 内边线
    var arc = d3.arc()
        .innerRadius(innerRadius)
        // .outerRadius(radius)
        .outerRadius(function (d) { 
            console.log(d)
            console.log(radius, vm.max)
            return d.data.stopTime
        });
    var path = svg.selectAll(".solidArc")
        .data(pie(data_new))
        .enter().append("path")
        .attr("fill", function(d) { return d.data.color; })
        .attr("class", "solidArc")
        .attr("stroke", "gray")
        .attr("d", arc)
      //   .on('mouseover', tip.show)
      //   .on('mouseout', tip.hide);
  
    // var outlineArc = d3.arc()
    //     .innerRadius(innerRadius)
    //     .outerRadius(radius);

    // // 外线轮廓
    // var outerPath = svg.selectAll(".outlineArc")
    //     .data(pie(data_new))
    //     .enter().append("path")
    //     .attr("fill", "none")
    //     .attr("stroke", "gray")
    //     .attr("class", "outlineArc")
    //     .attr("d", outlineArc); 


    svg.append("svg:text")
        .attr("class", "aster-stopTime")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style('font-size', function () {return fontScale(vm.total) + 'px'})
        .text(Math.round(vm.total));
}