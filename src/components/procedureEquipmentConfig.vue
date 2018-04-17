<template>
  <div>
    <el-row>
        <div style="margin: 25px auto;">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="指标快速查询">
          <!-- <el-input v-model="input" @keyup.enter.native="handleFilter" placeholder="请输入..."></el-input>yuxiaoran 2018-3-17 添加回车查询功能 -->
         <el-input v-model="input" @keyup.enter.native="handleFilter" placeholder="请输入..."></el-input><!--yuxiaoran 2018-3-17 添加回车查询功能-->
         <input type="text" style="display:none" /> 
        <!-- yuxiaoran 2018-3-23 修复回车键自动退出功能 -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleConfig">配置</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="handleBack">返回</el-button>
        </el-form-item> -->
      </el-form>
        </div>
    </el-row>
    <el-row>
      <div>
      <el-col :span="7">
        <el-table :data="tableData1" border height="680" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" width="65"></el-table-column>
          <el-table-column prop="dcode" label="设备编码" width="150"></el-table-column>
          <el-table-column prop="dname" label="设备名称"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="6">
        <el-table :data="tableData2" border height="680" highlight-current-row style="width: 100%" @current-change="table1CurrentChange">
          <el-table-column prop="procedureid" label="工序编号" width="120"></el-table-column>
          <el-table-column prop="procedurename" label="工序名称"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="11">
        <el-table :data="tableData3" border height="680" style="width: 100%">
          <el-table-column type="index" width="65"></el-table-column>
          <el-table-column label="设备编码" prop="equipmentcode" width="150"></el-table-column>
          <el-table-column label="设备名称" prop="equipmentname" width="180"></el-table-column>
          <el-table-column label="工序" prop="procedurename" width="160"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      ip: 'http://219.216.80.110:8080',
      input: '',
      selectedRows: [],
      currentRow: null,
      allEquip: [],
      tableData1: [],
      tableData2: [],
      tableData3: []
    }
  },
  computed: {
    insertData () {
      let arr = []
      for (let i = 0; i < this.selectedRows.length; i++){
        let tmp = {}
        tmp.equipmentcode = this.selectedRows[i].dcode
        // tmp.name = this.selectedRows[i].dname
        tmp.procedureid = this.currentRow.procedureid
        // tmp.procedurename = this.currentRow.procedurename
        arr.push(tmp)
      }
      return arr
    }
  },
  methods: {
    // handleBack() {
    //   this.$router.push('/IndexMonitor')
    // },
    handleFilter () {
      if (this.input !== ''){
        let tmp = []
        for (let i = 0; i < this.allEquip.length; i++){
          if (this.allEquip[i].dcode.indexOf(this.input) >= 0 || this.allEquip[i].dname.indexOf(this.input) >= 0){
            tmp.push(this.allEquip[i])
          }
        }
        this.tableData1 = tmp
      } else {
        this.tableData1 = this.allEquip
      }
    },
    //  handleFilter () {
    //     if (this.input != ''){
    //       let tmp = []
    //       for (let i = 0; i < this.notMatchIndex.length; i++){
    //         if (this.notMatchIndex[i].dcode.indexOf(this.input) >= 0 || this.notMatchIndex[i].dname.indexOf(this.input) >= 0){
    //           tmp.push(this.notMatchIndex[i])
    //         }
    //       }
    //       this.notMatchIndexTableData = tmp
    //     } else {
    //       this.notMatchIndexTableData = this.notMatchIndex
    //     }
    //   },
    handleConfig () {
      if (this.selectedRows.length === 0) {
        this.$alert('请选择设备', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        })
      } else if (this.currentRow === null) {
        this.$alert('请选择工序', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        })
      } else {
        var vm = this
        axios.post(this.ip + '/tk/equipProcedureConfig/insertEquipmentProcedureConfig', this.insertData).then((response) => {
          vm.getProcedureEquip(vm.currentRow.procedureid)
          vm.getAllNotMatchEquip()
          vm.$notify({
            type: 'success',
            message: '配置成功!'
          })
        }).catch((response) => {
          vm.getProcedureEquip(vm.currentRow.procedureid)
          vm.getAllNotMatchEquip()
          vm.$notify({
            message: '配置失败',
            type: 'error'
          })
          console.log(response)
        })
      }
    },
    handleSelectionChange (selection) {
      this.selectedRows = selection
    },
    getProcedureDescribe () {
      var vm = this
      axios.get(this.ip + '/xt/indexMonitor/selectProcedureDescribeInformation').then(function (response) {
        if(response.status === 200){
          vm.tableData2 = response.data
        } else {
          vm.tableData2 = []
        }
      }).catch(function (error) {
        vm.tableData2 = []
        console.log(error)
      })
    },
    getAllNotMatchEquip () {
      var vm = this
      axios.get(this.ip + '/lmtest/equipment/selectNotMatchProcedureEquipment').then(function (response) {
        if(response.status === 200){
          vm.allEquip = response.data
          vm.tableData1 = response.data
        } else {
          vm.allEquip = []
          vm.tableData1 = []
        }
        vm.selectedRows = []
      }).catch(function (error) {
        vm.allEquip = []
        vm.tableData1 = []
        vm.selectedRows = []
        console.log(error)
      })
    },
    getProcedureEquip (procedureid) {
      var vm = this
      axios.get(this.ip + '/tk/equipProcedureConfig/selectByProcedureId/' + procedureid).then(function (response) {
        if(response.status === 200){
          vm.tableData3 = response.data
        } else {
          vm.tableData3 = []
        }
      }).catch(function (error) {
        vm.tableData3 = []
        console.log(error)
      })
    },
    table1CurrentChange (currentRow, oldCurrentRow) {
      this.currentRow = currentRow
      this.getProcedureEquip(currentRow.procedureid)
    },
    handleDelete(row) {
      var vm = this
      axios.delete(this.ip + '/tk/equipProcedureConfig/deleteByEquipmentCode/' + row.indexid).then((response) => {
        vm.getProcedureEquip(row.procedureflag)
        vm.getAllNotMatchEquip()
        vm.$notify({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(function (error) {
        vm.$notify({
          message: '删除失败',
          type: 'error'
        })
        console.log(error)
      })
    }
  },
  mounted () {
    this.getProcedureDescribe()
    this.getAllNotMatchEquip()
  }
}
</script>

<style scoped>
.el-tag {
  height: 34px;
  line-height: 32px;
  font-size: 100%;
  padding: 0px 10px;
}
.index-card {
  margin: 8px auto;
  padding: 0;
}
.index-card2 {
  margin: 8px auto;
  padding-bottom: 10px;
}
.demo-form-inline {
  padding: 0;
  margin: 0;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
