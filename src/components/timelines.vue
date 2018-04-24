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
            rawData: []
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
                        .zQualitative(true)
                        // .zColorScale()
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


