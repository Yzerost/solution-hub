<template>
  <div class="app-container">
    <transition name="fade">
      <loading v-if="isLoading" />
    </transition>
    <!--搜索框-->
    <el-row>
      <el-col :span="3" class="grid">
        <el-input v-model="input" placeholder="请输入内容" size="mini" />
      </el-col>
      <el-col :span="16" class="grid">
        <el-button type="success" icon="el-icon-search" size="mini" @click="search(input)">搜索</el-button>
        <el-button style="margin-left: 20px" type="success" icon="el-icon-refresh" size="mini" @click="getSolutionType(currentPage,pageSize)">刷新</el-button>
      </el-col>
    </el-row>
    <br>
    <!--表格数据及操作-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      style="width: 100%"
      stripe
      tooltip-effect="dark"
      @selection-change="selsChange"
    >
      <!--勾选框-->
      <el-table-column type="selection" width="55" />
      <!--索引-->
      <el-table-column type="index" :index="indexMethod" label="序号" width="80" align="center" />
      <el-table-column prop="solution_type" label="名称" width="180" align="center" />
      <el-table-column prop="description" label="简介" align="center" />
      <el-table-column
        v-slot="scope"
        label="操作"
        width="160"
        align="center"
      >
        <template>
          <el-button type="text" size="small" round @click="editDialogFormVisible = true,beforeEdit(scope.row)">编辑</el-button>
          <el-dialog title="编辑类型" :visible.sync="editDialogFormVisible" :close-on-click-modal="false">
            <el-form :model="solutionType">
              <el-form-item label="类型名称">
                <el-input v-model="solutionType.solution_type" autocomplete="off" />
              </el-form-item>
              <el-form-item label="类型描述">
                <el-input v-model="solutionType.description" autocomplete="off" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="editDialogFormVisible = false,handleEdit(solutionType)">确 定</el-button>
            </div>
          </el-dialog>
          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            :title="`是否删除类型：【${scope.row.solution_type}】？`"
            @onConfirm="handleDelete(scope.row.id)"
          >
            <el-button slot="reference" type="text" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <!--新增按钮-->
    <el-col :span="1" class="grid">
      <el-button type="primary" icon="el-icon-plus" size="mini" round @click="addDialogFormVisible = true">新增</el-button>
      <el-dialog title="添加类型" :visible.sync="addDialogFormVisible" :close-on-click-modal="false">
        <el-form :model="solutionType">
          <el-form-item label="类型名称">
            <el-input v-model="solutionType.solution_type" autocomplete="off" />
          </el-form-item>
          <el-form-item label="类型描述">
            <el-input v-model="solutionType.description" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogFormVisible = false,handleAdd(solutionType)">确 定</el-button>
        </div>
      </el-dialog>

    </el-col>
    <!--批量删除按钮-->
    <el-col :span="1" class="grid" style="margin-left: 50px">
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="mini"
        round
        :disabled="sels.length === 0"
        @click="handleBatchDelete()"
      >批量删除</el-button>
    </el-col>
    <br>
    <!--分页条-->
    <!--el-pagination background layout="prev, pager, next" :total="tableData.length" /-->
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
      currentPage: 1,
      pageSize: 10,
      sels: [],
      input: '',
      tableData: [],
      totalData: [],
      solutionType: {},
      addDialogFormVisible: false,
      editDialogFormVisible: false
    }
  },
  created() {
    this.getSolutionType(this.currentPage, this.pageSize)
  },
  methods: {
    search(key) {
      this.$message.success('功能暂未实现，关键词：' + key)
    },
    selsChange(sels) {
      this.sels = sels
    },
    getSolutionType(currentPage, pageSize) {
      const url = '/solutionType/findAll'
      this.isLoading = true
      axios.get(url).then(res => {
        this.totalData = res.data
        const totalSize = res.data.length
        this.tableData = res.data.slice(pageSize * (currentPage - 1), (pageSize * currentPage >= totalSize) ? totalSize : (pageSize * currentPage))
        this.isLoading = false
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSolutionType(this.currentPage, this.pageSize)
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSolutionType(this.currentPage, this.pageSize)
      // console.log(`当前页: ${val}`)
    },
    indexMethod(index) {
      return index + 1 + this.pageSize * (this.currentPage - 1)
    },
    handleAdd(item) {
      const url = '/solutionType/insertSolutionType'
      this.isLoading = true
      axios.post(url, {
        solution_type: item.solution_type,
        description: item.description
      }).then(res => {
        // console.log(res)
        this.isLoading = false
        if (res.status === 200) {
          this.$message.success('新建类型' + item.solution_type + '成功')
          this.getSolutionType(this.currentPage, this.pageSize)
          this.$set(this.solutionType, 'solution_type', '')
          this.$set(this.solutionType, 'description', '')
        } else {
          this.$message.error(res.status)
        }
      })
    },
    beforeEdit(item) {
      this.$set(this.solutionType, 'id', item.id)
      this.$set(this.solutionType, 'solution_type', item.solution_type)
      this.$set(this.solutionType, 'description', item.description)
    },
    handleEdit(item) {
      // console.log(item)
      const url = '/solutionType/updateSolutionType'
      this.isLoading = true
      axios.put(url, {
        id: item.id,
        solution_type: item.solution_type,
        description: item.description
      }).then(res => {
        // console.log(res)
        this.isLoading = false
        if (res.status === 200) {
          this.$message.success('修改类型' + item.solution_type + '成功')
          this.getSolutionType(this.currentPage, this.pageSize)
        } else {
          this.$message.error(res.status)
        }
      })
    },
    handleDelete(id) {
      const url = '/solutionType/deleteSolutionType'
      this.isLoading = true
      axios.delete(url, {
        params: {
          id: id
        }
      }).then(res => {
        // console.log(res.headers)
        this.isLoading = false
        this.$message.warning('成功删除类型' + id + '!')
        this.getSolutionType(this.currentPage, this.pageSize)
      })
    },
    handleBatchDelete() {
      const ids = this.sels.map(item => item.id).join()
      this.isLoading = true
      this.$confirm('删除选择的所有类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = '/solutionType/batchDeleteSolutionType'
        this.isLoading = false
        axios.post(url, {
          ids: ids
        }).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.getSolutionType(this.currentPage, this.pageSize)
          }
        })
      })
    }
  }
}
</script>
<style>
.el-pagination {
  padding-top: 20px;
  text-align: center;
}
.el-table__body-wrapper::-webkit-scrollbar {
  /*width: 0;宽度为0隐藏*/
  width: 0px;
}
</style>
