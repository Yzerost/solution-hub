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
        <el-button style="margin-left: 20px" type="success" icon="el-icon-refresh" size="mini" @click="getSolution(currentPage,pageSize)">刷新</el-button>
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
      <el-table-column prop="name" label="名称" width="180" align="center" />
      <el-table-column prop="type" label="类型" width="100" align="center" />
      <el-table-column prop="description" label="简介" align="center" />
      <el-table-column
        v-slot="scope"
        label="操作"
        width="160"
        align="center"
      >
        <template>
          <el-button type="text" size="small" round @click="editDialogFormVisible = true,beforeEdit(scope.row)">编辑</el-button>
          <el-dialog title="编辑解决方案" :visible.sync="editDialogFormVisible" :close-on-click-modal="false">
            <el-form :model="editSolution">
              <el-form-item label="解决方案类型">
                <el-select v-model="editSolution.type.solution_type" placeholder="选择类型" value-key="id" style="width: 120px" @change="getEditColumn">
                  <el-option
                    v-for="type in types"
                    :key="type.id"
                    :label="type.solution_type"
                    :value="type"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="解决方案名称">
                <el-input v-model="editSolution.name" autocomplete="off" />
              </el-form-item>
              <el-form-item label="类型描述">
                <el-input v-model="editSolution.description" autocomplete="off" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="editDialogFormVisible = false,handleEdit(editSolution)">确 定</el-button>
            </div>
          </el-dialog>
          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            :title="`是否删除：【${scope.row.name}】？`"
            @onConfirm="handleDelete(scope.row)"
          >
            <el-button slot="reference" type="text" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <!--新增按钮-->
    <el-col :span="1" class="grid">
      <el-button type="primary" icon="el-icon-plus" size="mini" round @click="addDialogFormVisible = true,getTypes()">新增</el-button>
      <el-dialog title="添加解决方案" :visible.sync="addDialogFormVisible" :close-on-click-modal="false">
        <el-form :model="solution">
          <el-form-item label="解决方案类型">
            <el-select v-model="selectType" placeholder="选择类型" value-key="id" style="width: 120px" @change="getColumn">
              <el-option
                v-for="type in types"
                :key="type.id"
                :label="type.solution_type"
                :value="type"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="解决方案名称">
            <el-input v-model="solution.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="解决方案简介">
            <el-input v-model="solution.description" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogFormVisible = false,handleAdd(solution)">确 定</el-button>
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
      selectType: {},
      editSolution: {
        id: '',
        type: {
          id: '',
          solution_type: '',
          description: ''
        },
        name: '',
        description: ''

      },
      types: [],
      sels: [],
      input: '',
      tableData: [],
      totalData: [],
      solution: {},
      addDialogFormVisible: false,
      editDialogFormVisible: false
    }
  },
  created() {
    this.getSolution(this.currentPage, this.pageSize)
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getSolution(this.currentPage, this.pageSize)
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSolution(this.currentPage, this.pageSize)
      // console.log(`当前页: ${val}`)
    },
    indexMethod(index) {
      return index + 1 + this.pageSize * (this.currentPage - 1)
    },
    getTypes() {
      const url = '/solutionType/findAll'
      axios.get(url).then(res => {
        this.types = res.data
        // console.log(this.types)
      })
    },
    getColumn(type) {
      this.selectType = type
    },
    getEditColumn(type) {
      this.editSolution.type = type
    },
    search(key) {
      this.$message.success('功能暂未实现，关键词：' + key)
    },
    selsChange(sels) {
      this.sels = sels
    },
    getSolution(currentPage, pageSize) {
      const url = '/solution/findAll'
      this.isLoading = true
      axios.get(url).then(res => {
        this.totalData = res.data
        const totalSize = res.data.length
        this.tableData = res.data.slice(pageSize * (currentPage - 1), (pageSize * currentPage >= totalSize) ? totalSize : (pageSize * currentPage))
        this.isLoading = false
      })
    },
    handleAdd(item) {
      const url = '/solution/insertSolution'
      // console.log(this.selectType)
      this.isLoading = true
      axios.post(url, {
        type_id: this.selectType.id,
        type: this.selectType.solution_type,
        name: item.name,
        description: item.description
      }).then(res => {
        // console.log(res)
        this.isLoading = false
        if (res.status === 200) {
          this.$message.success('新建解决方案【' + item.name + '】成功')
          this.getSolution(this.currentPage, this.pageSize)
          this.selectType = {}
          item.name = ''
          item.description = ''
        } else {
          this.$message.error(res.status)
        }
      })
    },
    beforeEdit(item) {
      this.$set(this.editSolution, 'id', item.id)
      this.$set(this.editSolution.type, 'id', item.type_id)
      this.$set(this.editSolution.type, 'solution_type', item.type)
      this.$set(this.editSolution, 'name', item.name)
      this.$set(this.editSolution, 'description', item.description)
      this.getTypes()
      // console.log(item)
      // console.log(this.editSolution.type)
    },
    handleEdit(item) {
      // console.log(item)
      const url = '/solution/updateSolution'
      this.isLoading = true
      axios.put(url, {
        id: item.id,
        type_id: this.editSolution.type.id,
        type: this.editSolution.type.solution_type,
        name: item.name,
        description: item.description
      }).then(res => {
        // console.log(res)
        this.isLoading = false
        if (res.status === 200) {
          this.$message.success('修改解决方案' + item.name + '成功')
          this.getSolution(this.currentPage, this.pageSize)
        } else {
          this.$message.error(res.status)
        }
      })
    },
    handleDelete(solution) {
      const url = '/solution/deleteSolution'
      this.isLoading = true
      axios.delete(url, {
        params: {
          id: solution.id
        }
      }).then(res => {
        // console.log(res.headers)
        this.isLoading = false
        this.$message.warning('成功删除解决方案【' + solution.name + '】!')
        this.getSolution(this.currentPage, this.pageSize)
      })
    },
    handleBatchDelete() {
      const ids = this.sels.map(item => item.id).join()
      this.$confirm('删除选择的所有解决方案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true
        const url = '/solution/batchDeleteSolution'
        axios.post(url, {
          ids: ids
        }).then(res => {
          // console.log(res)
          this.isLoading = false
          if (res.status === 200) {
            this.getSolution(this.currentPage, this.pageSize)
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
