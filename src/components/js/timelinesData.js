export default function getRandomData(_data = []) {

    const NGROUPS = _data.length // 工艺流程数
    // const MAXCATEGORIES = 12
    //   MINTIME = new Date(startTime); // 起始日期
    //   MAXTIME = new Date(endTime); // 结束日期
  
    // const nCategories = Math.ceil(MAXCATEGORIES)
    const categoryLabels = [
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
          {stopCode: '1000', stopName: '启动'},
          {stopCode: null, stopName: '未知故障'}
      ];
  
    return [...Array(NGROUPS).keys()].map(i => ({
      group: _data[i].key.split(',')[1], // 工艺名
      data: getGroupData(_data[i].values) // 工艺数据
    }));

    function getGroupData(d) {
      return [...d.keys()].map(i => ({
        label: d[i].key.split(',')[1], // 设备名
        data: getSegmentsData(d[i].value) // 设备数据
      }));
  
      function getSegmentsData(d) {
        const nSegments = d.statusCount // 故障个数
  
        return [...Array(nSegments).keys()].map(i => {
        
          const start = d.statusData[i].startTime
          const end = d.statusData[i].endTime
          return {
            timeRange: [start, end],
            val: function() {
                for (let j = 0; j < categoryLabels.length; j ++){
                    console.log(d.statusData[i].stopCauseCode, categoryLabels[j].stopCode)
                    if (d.statusData[i].stopCauseCode == categoryLabels[j].stopCode){
                        return categoryLabels[j].stopName
                    }
                }
                return d.statusData[i].stopCauseCode
            }()
            //labelVal: is optional - only displayed in the labels
          };
        });
  
      }
    }
  }