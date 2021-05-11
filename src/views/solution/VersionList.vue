<template>
  <div class="app-container">
    <span>【{{ solution.name }}】版本列表：</span>
    <transition name="fade">
      <loading v-if="isLoading" />
    </transition>
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      stripe
      tooltip-effect="dark"
      @selection-change="selsChange"
    >
      <el-table-column type="index" :index="indexMethod" label="序号" width="80" align="center" />
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column prop="version" label="版本号" align="center" />
      <el-table-column
        v-slot="scope"
        label="操作"
        width="160"
        align="center"
      >
        <el-button type="text" size="small" round @click="versionDetail(scope.row)">详情</el-button>
      </el-table-column>
    </el-table>
    <br>
    <!--分页条-->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import axios from 'axios'
import Loading from '@/components/loading'

export default {
  components: { Loading },
  data() {
    return {
      isLoading: true,
      solution: this.$route.params,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      totalData: []
    }
  },
  created() {
    // console.log(this.$route.params)
    this.getSolutionListByID(this.solution.id, this.pageSize, this.currentPage)
  },
  methods: {
    getSolutionListByID(id, pageSize, currentPage) {
      const url = '/solutionVersion/getSoVerBySoId'
      this.isLoading = true
      axios.get(url, {
        params: {
          'solution_id': id
        }
      }).then(res => {
        this.totalData = res.data
        const totalSize = res.data.length
        this.tableData = res.data.slice(pageSize * (currentPage - 1), (pageSize * currentPage >= totalSize) ? totalSize : (pageSize * currentPage))
        this.isLoading = false
        // console.log(this.versionList)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSolutionListByID(this.solution.id, this.currentPage, this.pageSize)
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSolutionListByID(this.solution.id, this.currentPage, this.pageSize)
      // console.log(`当前页: ${val}`)
    },
    indexMethod(index) {
      return index + 1 + this.pageSize * (this.currentPage - 1)
    },
    selsChange(sels) {
      this.sels = sels
    },
    versionDetail(solutionVersion) {
      // console.log(solutionVersion)
      this.$router.push({ name: 'versionDetail', params: solutionVersion })
    }
  }
}
</script>
