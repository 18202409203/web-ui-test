<template>
  <div class="container-flowchart">
    <div class="panel-body points demo flow_chart" id="points">
      <div class="animation"><div id="node_id_001" class="point_V" ><el-badge value='设备' class="item">原矿</el-badge></div></div>
      <div class="animation"><div id="node_id_002" class="point_V">筛分</div></div>
      <div class="animation"><div id="node_id_003" class="point_V">粉矿</div></div>
      <div class="animation"><div id="node_id_004" class="point_V">块矿</div></div>
      <div class="animation"><div id="node_id_005" class="point_L"><el-badge is-dot class="item">强磁磨矿</el-badge></div></div>
      <div class="animation"><div id="node_id_006" class="point_L">竖炉焙烧</div></div>
      <div class="animation"><div id="node_id_007" class="point">弱磁磨矿</div></div>
      <div class="animation"><div id="node_id_008" class="point">废石</div></div>
      <div class="animation"><div id="node_id_009" class="point_L">强磁选别</div></div>
      <div class="animation"><div id="node_id_010" class="point_L">弱磁选别</div></div>
      <div class="animation"><div id="node_id_011" class="point_L">中矿浓缩</div></div>
      <div class="animation"><div id="node_id_012" class="point_L">反浮选</div></div>
      <div class="animation"><div id="node_id_013" class="point_L">精矿浓缩</div></div>
      <div class="animation"><div id="node_id_014" class="point_L">尾矿浓缩</div></div>
      <div class="animation"><div id="node_id_015" class="point">精矿过滤</div></div>
      <div class="animation"><div id="node_id_016" class="point">精矿库</div></div>
      <div class="animation"><div id="node_id_017" class="point">尾矿库</div></div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { jsPlumb } from 'jsplumb'
require('../assets/css/demo.css')
require('../assets/css/jsplumb.css')
export default {
  data() {
    return {
      data: {
        location: [
          ['node_id_001', '原矿', 1, 9], ['node_id_002', '筛分', 5.5, 9], ['node_id_003', '粉矿', 11, 1], ['node_id_004', '块矿', 11, 16],
          ['node_id_005', '强磁磨矿', 19, 1], ['node_id_006', '竖炉焙烧', 16, 16], ['node_id_007', '弱磁磨矿', 20, 11], ['node_id_008', '废石', 21, 22],
          ['node_id_009', '强磁选别', 27, 1], ['node_id_010', '弱磁选别', 27, 15], ['node_id_011', '中矿浓缩', 34, 10], ['node_id_012', '反浮选', 42.5, 10],
          ['node_id_013', '精矿浓缩', 42.5, 1], ['node_id_014', '尾矿浓缩', 42.5, 19], ['node_id_015', '精矿过滤', 51, 1.6], ['node_id_016', '精矿库', 51, 8],
          ['node_id_017', '尾矿库', 51, 15]
        ],
        line: [
          ['node_id_001_source_0', 'node_id_002_target_0'], ['node_id_002_source_0', 'node_id_003_target_0'],
          ['node_id_002_source_1', 'node_id_004_target_0'], ['node_id_003_source_0', 'node_id_005_target_0'],
          ['node_id_004_source_0', 'node_id_006_target_0'], ['node_id_006_source_0', 'node_id_007_target_0'],
          ['node_id_006_source_1', 'node_id_008_target_0'], ['node_id_005_source_0', 'node_id_009_target_0'],
          ['node_id_007_source_0', 'node_id_010_target_0'], ['node_id_010_source_0', 'node_id_011_target_0'],
          ['node_id_010_source_1', 'node_id_014_target_2'], ['node_id_009_source_0', 'node_id_013_target_0'],
          ['node_id_009_source_1', 'node_id_014_target_1'], ['node_id_011_source_0', 'node_id_012_target_0'],
          ['node_id_012_source_0', 'node_id_013_target_1'], ['node_id_012_source_1', 'node_id_014_target_0'],
          ['node_id_013_source_0', 'node_id_015_target_0'], ['node_id_015_source_0', 'node_id_016_target_0'],
          ['node_id_014_source_0', 'node_id_017_target_0']
        ]
      },
    }
  },
  methods: {
    twinkle () {
      $('#node_id_001').addClass("prompt")
    },
    createFlow (flowData) {
      const color = 'gray'
      var instance = jsPlumb.getInstance({
        Connector: [ 'Flowchart', { stub: [15, 15], gap: 7, cornerRadius: 5, alwaysRespectStubs: true } ],
        Endpoint: ['Dot', { radius: 3 }],
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        PaintStyle: { strokeWidth: 2, stroke: '#445566' },
        EndpointStyle: { radius: 9, fill: color },
        HoverPaintStyle: { stroke: '#ec9f2e', strokeWidth: 4 },
        EndpointHoverStyle: { fill: '#ec9f2e', stroke: '#acd' },
        ConnectionOverlays: [
          ['Arrow', {
            location: 1,
            id: 'arrow',
            length: 11,
            width:11,
          }]
        ],
        Container: 'points',
      })
      // 通用源连接点
      var sourceEndpoint = {
        endpoint: ["Dot", { radius:7 }],
        paintStyle: {stroke: "#7AB02C", fill: color},
        maxConnections: -1,
        isSource: true,
      }
      // 特例源连接点
      var sourceEndpoint_special = {
        endpoint: ["Dot", { radius:7 }],
        paintStyle: {stroke: "#7AB02C", fill: color},
        maxConnections: -1,
        connector: ['Flowchart', { stub: [160, 50], gap: 7, cornerRadius: 5, alwaysRespectStubs: true }],
        isSource: true,
      }
      // 目标连接点
      var targetEndpoint = {
        endpoint: "Dot",
        paintStyle: { fill: color, radius: 7 },
        maxConnections: -1,
        dropOptions: { hoverClass: "hover", activeClass: "active" },
        isTarget: true,
      }

      var _addEndpoints = function (toId, sourceAnchors, targetAnchors, sourceEndpoint, targetEndpoint) {
        for (var i = 0; i < sourceAnchors.length; i++) {
          var sourceUUID = toId + '_source_' + i
          instance.addEndpoint(toId, sourceEndpoint, {
            anchor: sourceAnchors[i], uuid: sourceUUID
          })
        }
        for (var j = 0; j < targetAnchors.length; j++) {
          var targetUUID = toId + '_target_' + j
          instance.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID })
        }
      }

      instance.batch(() => {
        var node1 = _addEndpoints('node_id_001', ['Right'], [], sourceEndpoint, targetEndpoint)
        var node2 = _addEndpoints('node_id_002', [[1, 0.25, 1, 0],[1, 0.75, 1, 0]], ['Left'], sourceEndpoint, targetEndpoint)
        var node3 = _addEndpoints('node_id_003', ['Right'], ['Left'], sourceEndpoint, targetEndpoint)
        var node4 = _addEndpoints('node_id_004', ['Right'], ['Left'], sourceEndpoint, targetEndpoint)
        var node5 = _addEndpoints('node_id_005', ['Right'], ['Left'], sourceEndpoint, targetEndpoint)
        var node6 = _addEndpoints('node_id_006', ['Top', 'Bottom'], ['Left'], sourceEndpoint, targetEndpoint)
        var node7 = _addEndpoints('node_id_007', ['Right'], ['Left'], sourceEndpoint, targetEndpoint)
        var node8 = _addEndpoints('node_id_008', [], ['Left'], sourceEndpoint, targetEndpoint)
        var node9 = _addEndpoints('node_id_009', [[1, 0.25, 1, 0], [1, 0.75, 1, 0]], ['Left'], sourceEndpoint_special, targetEndpoint)
        var node10 = _addEndpoints('node_id_010', [[1, 0.25, 1, 0], [1, 0.75, 1, 0]], ['Left'], sourceEndpoint, targetEndpoint)
        var node11 = _addEndpoints('node_id_011', ['Right'], ['Left'], sourceEndpoint, targetEndpoint)
        var node12 = _addEndpoints('node_id_012', ['Top', 'Bottom'], ['Left'], sourceEndpoint, targetEndpoint)
        var node13 = _addEndpoints('node_id_013', ['Right'], [[0, 0.25, -1, 0], 'Bottom'], sourceEndpoint, targetEndpoint)
        var node14 = _addEndpoints('node_id_014', ['Right'], ['Top', [0, 0.25, -1, 0], [0, 0.75, -1, 0]], sourceEndpoint, targetEndpoint)
        var node15 = _addEndpoints('node_id_015', ['Bottom'], ['Left'], sourceEndpoint, targetEndpoint)
        var node16 = _addEndpoints('node_id_016', [], ['Top'], sourceEndpoint, targetEndpoint)
        var node17 = _addEndpoints('node_id_017', [], ['Bottom'], sourceEndpoint, targetEndpoint)

        for (const i of flowData.line) {
          const uuid = [`${i[0]}`, `${i[1]}`]
          instance.connect({
            uuids: uuid,
          })
        }
        
        for (let i of flowData.location) {
          $(`#${i[0]}`).css('left', i[2] * 20)
          $(`#${i[0]}`).css('top', i[3] * 20)
        }
      })

      var vm = this
      // 原矿
      instance.on(jsPlumb.getSelector('#node_id_001'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201001'
        window.localStorage.procedureName = '原矿信息'
      })
      // 筛分
      instance.on(jsPlumb.getSelector('#node_id_002'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201002'
        window.localStorage.procedureName = '筛分过程'
      })
      // 粉矿
      instance.on(jsPlumb.getSelector('#node_id_003'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201003'
        window.localStorage.procedureName = '粉矿生产过程'
      })
      // 块矿
      instance.on(jsPlumb.getSelector('#node_id_004'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201004'
        window.localStorage.procedureName = '块矿生产过程'
      })
      // 强磁磨矿
      instance.on(jsPlumb.getSelector('#node_id_005'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201005'
        window.localStorage.procedureName = '强磁磨矿过程'
      })
      // 竖炉焙烧
      instance.on(jsPlumb.getSelector('#node_id_006'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201006'
        window.localStorage.procedureName = '竖炉焙烧过程'
      })
      // 弱磁磨矿
      instance.on(jsPlumb.getSelector('#node_id_007'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201007'
        window.localStorage.procedureName = '弱磁磨矿过程'
      })
      // 强磁选别
      instance.on(jsPlumb.getSelector('#node_id_009'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201009'
        window.localStorage.procedureName = '强磁选别过程'
      })
      // 弱磁选别
      instance.on(jsPlumb.getSelector('#node_id_010'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201010'
        window.localStorage.procedureName = '弱磁选别过程'
      })
      // 中矿浓缩
      instance.on(jsPlumb.getSelector('#node_id_011'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201011'
        window.localStorage.procedureName = '中矿浓缩过程'
      })
      // 反浮选
      instance.on(jsPlumb.getSelector('#node_id_012'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201012'
        window.localStorage.procedureName = '反浮选过程'
      })
      // 精矿浓缩
      instance.on(jsPlumb.getSelector('#node_id_013'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201013'
        window.localStorage.procedureName = '精矿浓缩过程'
      })
      // 尾矿浓缩
      instance.on(jsPlumb.getSelector('#node_id_014'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201014'
        window.localStorage.procedureName = '尾矿浓缩过程'
      })
      // 精矿过滤
      instance.on(jsPlumb.getSelector('#node_id_015'), "click", function (conn) {
        // vm.$router.replace({ path: '/procedure' })
        vm.$router.push({ path: '/procedure' })
        window.localStorage.procedureFlag = '0201015'
        window.localStorage.procedureName = '精矿过滤过程'
      })
      jsPlumb.fire('jsPlumbLoaded', instance)
    },
  },
  mounted () {
    jsPlumb.ready(() => {
      this.createFlow(this.data)
    })
    this.twinkle()
  }
}
</script>

<style scoped>
.container-flowchart {
  width: 1140px;
  /*height:100%;*/
  /*border: 1px solid red; */
  margin: 0 auto;
}
.animation {
  position: relative;
}
.animation .prompt{
  border: 1px solid red;
  -webkit-animation: borderAn 1.5s infinite;
  animation: borderAn 1.5s infinite;
}
@-webkit-keyframes borderAn{
  0%{
    border-color: transparent;
  }
  50%{
    border-color: red;
  }
  100%{
    border-color: transparent;
  }
}
@keyframes borderAn{
  0%{
    border-color: transparent;
  }
  50%{
    border-color: red;
  }
  100%{
    border-color: transparent;
  }
}
</style>
