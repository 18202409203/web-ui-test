<template>
    <div>
        <div id="timelines" style="width: 1500px;"></div>
    </div>
</template>

<script>
import * as d3 from 'd3'
import TimelinesChart from 'timelines-chart'
import axios from 'axios'
import getRandomData from '../components/js/timelinesData.js'

export default {
    data () {
        return {
            ip: 'http://219.216.80.110:8080',
            rawData: [],
            categoryLabels: [
                {stopCode: '1000', stopName: '启动'},
                {stopCode: '0001', stopName: '机械故障'},
                {stopCode: '0002', stopName: '电气故障'},
                {stopCode: '0003', stopName: '生产故障'},
                {stopCode: '0004', stopName: '停紧'},
                {stopCode: '0005', stopName: '待开'},
                {stopCode: '0006', stopName: '计划停'},
                {stopCode: '0007', stopName: '烘炉'},
                {stopCode: '0008', stopName: '待料'},
                {stopCode: '0009', stopName: '限开'},
                {stopCode: '0010', stopName: '检修待开'},
                {stopCode: '0011', stopName: '计划待开'},
                {stopCode: '0012', stopName: '停产'},
                {stopCode: '0013', stopName: '待煤气'},
                {stopCode: '0014', stopName: '淌炉压炉'},
                {stopCode: '0015', stopName: '烟机震动'},
                {stopCode: '0016', stopName: '检修'},
                {stopCode: '0017', stopName: '大中修'},
                {stopCode: '0018', stopName: '计划定修'},
                {stopCode: '0019', stopName: '其他'},
                {stopCode: '0020', stopName: '未知故障'}
            ]
        }
    },
    methods:{
        fetchData() {
            axios.get(this.ip + '/lyj/stoptime/getEquipTimeLineByDateScopAndProcedureid/2017-1-1/2017-6-1/all').then(response => {
                if(response.status === 200) {
                    this.rawData = response.data
                    let data = d3.nest()
                        .key(d => {return d.procedureId + ',' + d.procedureName})
                        .key(d => {return d.equipmentCode + ',' + d.equipmentName})
                        .rollup(d => {
                            return {
                                statusCount: d.length,
                                statusData: d
                            }
                        })
                        .entries(this.rawData)
                    // console.log(data)
                    TimelinesChart()
                        .data(getRandomData(data))
                        // *******************************************//
                        .zColorScale(
                            d3.scaleOrdinal() // 按顺序依次对应 停歇原因 和 颜色
                                .domain(function(){
                                    return this.categoryLabels.map( (d, i)=> d.stopName)
                                })
                                .range([...d3.schemeCategory10,...d3.schemePaired])
                        )
                        //********************************************//
                        (document.getElementById('timelines'));
                    // d3.select('#timelines').select('svg')
                    //     .attr('width', '1500')
                }
            })
        }
    },
    components: { },
    mounted() {
        this.fetchData()
        // TimelinesChart()
        //     .data(getRandomData(true))
        //     .zQualitative(true)
        //     // .zColorScale()
        //     (document.getElementById('timelines'));
    }
}
</script>


