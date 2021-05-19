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
        <el-button style="margin-left: 20px" type="success" icon="el-icon-refresh" size="mini" @click="getSolutionVersion(currentPage,pageSize)">刷新</el-button>
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
      <el-table-column prop="name" label="版本名称" width="180" align="center" />
      <el-table-column prop="solution" label="所属解决方案" width="180" align="center" />
      <el-table-column prop="version" label="版本号" width="180" align="center" />
      <el-table-column prop="status" label="发布状态" width="100" align="center" />
      <el-table-column :show-overflow-tooltip="true" prop="brief" label="简介" align="center" />
      <el-table-column
        v-slot="scope"
        label="操作"
        width="120"
        align="center"
      >
        <template>
          <el-button type="text" size="small" round @click="editDialogFormVisible = true,beforeEdit(scope.row)">编辑</el-button>
          <el-dialog custom-class="customWidth" title="编辑解决方案版本" :visible.sync="editDialogFormVisible" :close-on-click-modal="false">
            <el-form :model="editSolutionVersion" :label-position="labelPosition" label-width="15%">
              <el-form-item label="解决方案">
                <el-select v-model="editSolutionVersion.solution" filterable placeholder="选择解决方案" value-key="id" style="width: 30%" @change="getEditSolutionColumn">
                  <el-option
                    v-for="solution in solutions"
                    :key="solution.id"
                    :label="solution.name"
                    :value="solution"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="版本名称:">
                <el-input v-model="editSolutionVersion.name" />
              </el-form-item>
              <el-form-item label="版本号:">
                <el-input v-model="editSolutionVersion.version" />
              </el-form-item>
              <el-form-item label="发布状态:">
                <el-select v-model="editSolutionVersion.status" placeholder="选择发布状态" value-key="id" style="width: 25%" @change="getEditStatusColumn">
                  <el-option
                    v-for="status in statusList"
                    :key="status.value"
                    :label="status.label"
                    :value="status.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="简介:">
                <el-input v-model="editSolutionVersion.brief" type="textarea" :rows="2" />
              </el-form-item>
              <el-form-item label="浏览权限:">
                <el-checkbox-group v-model="editSolutionVersion.read_role">
                  <el-checkbox v-for="role in roles" :key="role" :label="role" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="编辑权限:">
                <el-checkbox-group v-model="editSolutionVersion.write_role">
                  <el-checkbox v-for="role in roles" :key="role" :label="role" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="配套文件:" style="width: 100%">
                <el-button type="primary" size="mini" align="right" tooltip-effect="dark" @click="addEditItem">添加文件</el-button>
              </el-form-item>
              <el-table :data="editSolutionVersion.fileList" style="width:100%; " stripe border empty-text="暂无文件" size="mini">
                <el-table-column label="序号" type="index" width="80" align="center" />
                <el-table-column label="产品" align="center" width="120">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.product"
                      filterable
                      size="mini"
                      style="width: 90px;"
                      placeholder="选择产品"
                    >
                      <el-option
                        v-for="product in products"
                        :key="product.productValue"
                        :label="product.label"
                        :value="product.productValue"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="类型" align="center" width="120">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.kind"
                      filterable
                      size="mini"
                      style="width: 90px;"
                      placeholder="选择类型"
                    >
                      <el-option
                        v-for="kind in kinds"
                        :key="kind.kindValue"
                        :label="kind.label"
                        :value="kind.kindValue"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column v-slot="scope" label="" align="center" width="120">
                  <el-button
                    type="text"
                    size="small"
                    round
                    align="center"
                    @click="searchFile(scope.row,scope.row.product,scope.row.kind)"
                  >搜索文件</el-button>
                </el-table-column>
                <el-table-column v-slot="scope" label="文件" align="center" width="150">
                  <template>
                    <el-select
                      v-model="scope.row.fileInfo"
                      filterable
                      size="mini"
                      style="width: 100px;"
                      placeholder="选择文件"
                      value-key="Key"
                      @change="getFileColumn"
                    >
                      <el-option
                        v-for="file in scope.row.searchFiles"
                        :key="file.Key"
                        :label="file.FileName"
                        :value="file"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="描述" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.description" />
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <el-button type="text" size="small" round @click="delEditItem(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-form-item label="修改备注:">
                <el-input v-model="editSolutionVersion.edit_comment" type="textarea" :rows="2" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="editDialogFormVisible = false,handleEdit(editSolutionVersion)">确 定</el-button>
            </div>
          </el-dialog>
          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            :title="`是否删除：【${scope.row.name}】？`"
            @onConfirm="delVersion(scope.row)"
          >
            <el-button slot="reference" type="text" size="small">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <!--新增按钮-->
    <el-col :span="1" class="grid">
      <el-button type="primary" icon="el-icon-plus" size="mini" round @click="addDialogFormVisible = true,getSolutions()">新增</el-button>
      <el-dialog custom-class="customWidth" title="新建解决方案版本" :visible.sync="addDialogFormVisible" :close-on-click-modal="false">
        <el-form :model="solutionVersion" :label-position="labelPosition" label-width="15%">
          <el-form-item label="解决方案:">
            <el-select v-model="solutionVersion.solution" filterable placeholder="选择解决方案" value-key="id" style="width: 30%" @change="getSolutionColumn">
              <el-option
                v-for="solution in solutions"
                :key="solution.id"
                :label="solution.name"
                :value="solution"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="版本名称:">
            <el-input v-model="solutionVersion.name" />
          </el-form-item>
          <el-form-item label="版本号:">
            <el-input v-model="solutionVersion.version" />
          </el-form-item>
          <el-form-item label="发布状态:">
            <el-select v-model="solutionVersion.status" placeholder="选择发布状态" value-key="id" style="width: 25%">
              <el-option
                v-for="status in statusList"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="简介:">
            <el-input v-model="solutionVersion.brief" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="浏览权限:">
            <el-checkbox-group v-model="solutionVersion.read_role">
              <el-checkbox v-for="role in roles" :key="role" :label="role" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="编辑权限:">
            <el-checkbox-group v-model="solutionVersion.write_role">
              <el-checkbox v-for="role in roles" :key="role" :label="role" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="配套文件:" style="width: 100%">
            <el-button type="primary" size="mini" align="right" tooltip-effect="dark" @click="addItem">添加文件</el-button>
          </el-form-item>
          <el-table :data="solutionVersion.fileList" style="width:100%; " stripe border empty-text="暂无文件" size="mini">
            <el-table-column label="序号" type="index" width="80" align="center" />
            <el-table-column label="产品" align="center" width="120">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.product"
                  filterable
                  size="mini"
                  style="width: 90px;"
                  placeholder="选择产品"
                >
                  <el-option
                    v-for="product in products"
                    :key="product.productValue"
                    :label="product.label"
                    :value="product.productValue"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center" width="120">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.kind"
                  filterable
                  size="mini"
                  style="width: 90px;"
                  placeholder="选择类型"
                >
                  <el-option
                    v-for="kind in kinds"
                    :key="kind.kindValue"
                    :label="kind.label"
                    :value="kind.kindValue"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-slot="scope" label="" align="center" width="120">
              <el-button
                type="text"
                size="small"
                round
                align="center"
                @click="searchFile(scope.row,scope.row.product,scope.row.kind)"
              >搜索文件</el-button>
            </el-table-column>
            <el-table-column v-slot="scope" label="文件" align="center" width="150">
              <template>
                <el-select
                  v-model="scope.row.fileInfo"
                  filterable
                  size="mini"
                  style="width: 100px;"
                  placeholder="选择文件"
                  value-key="Key"
                  @change="getFileColumn"
                >
                  <el-option
                    v-for="file in scope.row.searchFiles"
                    :key="file.Key"
                    :label="file.FileName"
                    :value="file"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="描述" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.description" />
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="text" size="small" round @click="delItem(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogFormVisible = false,handleAdd(solutionVersion)">确 定</el-button>
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
import { products, kinds, roleOptions } from '../../api/configs.js'
import { s3, bucket } from '../../utils/s3.js'

export default {
  components: { Loading },
  data() {
    return {
      s3: null,
      bucket: '',
      labelPosition: 'left',
      isLoading: true,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      totalData: [],
      solutions: [],
      solution: {},
      solutionVersion: {},
      roles: roleOptions,
      file: {},
      editSolutionVersion: {},
      statusList: [
        {
          value: '测试',
          label: '测试'
        },
        {
          value: '预发布',
          label: '预发布'
        }, {
          value: '发布',
          label: '发布'
        }
      ],
      products: [],
      kinds: [],
      fileList: [],
      sels: [],
      addDialogFormVisible: false,
      editDialogFormVisible: false
    }
  },
  created() {
    this.getSolutionVersion(this.currentPage, this.pageSize)
    this.products = products
    this.kinds = kinds
    this.bucket = bucket
    this.s3 = s3()
    this.$set(this.solutionVersion, 'read_role', [])
    this.$set(this.solutionVersion, 'write_role', [])
  },
  methods: {
    search(key) {
      this.$message.success('功能暂未实现，关键词：' + key)
    },
    selsChange(sels) {
      this.sels = sels
    },
    indexMethod(index) {
      return index + 1 + this.pageSize * (this.currentPage - 1)
    },
    getSolutions() {
      const url = '/solution/findAll'
      axios.get(url).then(res => {
        this.solutions = res.data
        // console.log(this.types)
      })
    },
    getSolutionVersion(currentPage, pageSize) {
      const url = '/solutionVersion/findAll'
      this.isLoading = true
      axios.get(url).then(res => {
        this.totalData = res.data
        const totalSize = res.data.length
        this.tableData = res.data.slice(pageSize * (currentPage - 1), (pageSize * currentPage >= totalSize) ? totalSize : (pageSize * currentPage))
        // console.log(this.tableData)
        this.isLoading = false
      })
    },
    addItem() {
      const item = {}
      this.fileList.push(item)
      this.$set(this.solutionVersion, 'fileList', this.fileList)
    },
    addEditItem() {
      const item = {}
      this.editSolutionVersion.fileList.push(item)
      // this.fileList.push(item)
      // this.$set(this.editSolutionVersion, 'fileList', this.fileList)
    },
    delItem(index) {
      this.solutionVersion.fileList.splice(index, 1)
    },
    delEditItem(index) {
      console.log(index)
      this.editSolutionVersion.fileList.splice(index, 1)
    },
    searchFile(row, product, kind) {
      const params = {
        Bucket: this.bucket,
        Delimiter: '',
        Prefix: product + '/' + kind
      }
      const self = this
      if (product !== '' && kind !== '') {
        this.s3.listObjects(params, function(err, data) {
          if (err) {
            console.log(err, err.stack)// an error occurred
          } else {
            if (data && data.Contents) {
              data.Contents.forEach((file) => {
                const FileName = file.Key.replace(data.Prefix + '/', '')
                self.$set(file, 'FileName', FileName)
              })
              self.$set(row, 'searchFiles', data.Contents)
              // console.log(row.searchFiles)
            }
          }
        })
      } else {
        this.$message.warning('选择产品或类型内容再搜索')
      }
    },
    handleAdd(solutionVersion) {
      // console.log(solutionVersion)
      const url = '/solutionVersion/insertSoVer'
      this.isLoading = true
      const files = []
      solutionVersion.fileList.forEach((file) => {
        files.push({
          'kind': file.kind,
          'product': file.product,
          'fileName': file.fileInfo.FileName,
          'key': file.fileInfo.Key,
          'description': file.description
        })
      })
      axios.post(url, {
        name: solutionVersion.name,
        version: solutionVersion.version,
        solution_id: solutionVersion.solution.id,
        solution: solutionVersion.solution.name,
        status: solutionVersion.status,
        brief: solutionVersion.brief,
        read_role: JSON.stringify(solutionVersion.read_role),
        write_role: JSON.stringify(solutionVersion.write_role),
        files: JSON.stringify(files),
        edit_comment: ''
      }).then(res => {
        // console.log(res)
        this.isLoading = false
        if (res.status === 200) {
          this.$message.success('新建解决方案【' + solutionVersion.name + '】成功')
          this.getSolutionVersion(this.currentPage, this.pageSize)
          this.$set(this.solutionVersion, 'name', '')
          this.$set(this.solutionVersion, 'version', '')
          this.$set(this.solutionVersion, 'solution', {})
          this.$set(this.solutionVersion, 'status', '')
          this.$set(this.solutionVersion, 'brief', '')
          this.$set(this.solutionVersion, 'read_role', '')
          this.$set(this.solutionVersion, 'write_role', '')
          this.$set(this.solutionVersion, 'fileList', [])
          this.$set(this.solutionVersion, 'files', '')
          this.$set(this.solutionVersion, 'edit_comment', '')
        } else {
          this.$message.error(res.status)
        }
      })
    },
    beforeEdit(item) {
      this.getSolutions()
      this.$set(this.editSolutionVersion, 'id', item.id)
      this.$set(this.editSolutionVersion, 'name', item.name)
      this.$set(this.editSolutionVersion, 'version', item.version)
      const solution = { 'id': item.solution_id, 'name': item.solution }
      this.$set(this.editSolutionVersion, 'solution', solution)
      this.$set(this.editSolutionVersion, 'status', item.status)
      this.$set(this.editSolutionVersion, 'brief', item.brief)
      this.$set(this.editSolutionVersion, 'read_role', JSON.parse(item.read_role))
      this.$set(this.editSolutionVersion, 'write_role', JSON.parse(item.write_role))
      this.$set(this.editSolutionVersion, 'files', JSON.parse(item.files))
      this.$set(this.editSolutionVersion, 'edit_comment', item.edit_comment)
      const fileList = []
      JSON.parse(item.files).forEach((file) => {
        fileList.push({
          'product': file.product,
          'kind': file.kind,
          'fileInfo': { 'FileName': file.fileName, 'Key': file.key },
          'description': file.description
        })
      })
      this.$set(this.editSolutionVersion, 'fileList', fileList)
      console.log(this.editSolutionVersion)
    },
    getFileColumn(file) {
      this.file = file
    },
    getSolutionColumn(solution) {
      this.solutionVersion.solution = solution
    },
    getEditSolutionColumn(solution) {
      this.editSolutionVersion.solution = solution
    },
    getEditStatusColumn(status) {
      this.editSolutionVersion.status = status
    },
    handleEdit(editSolutionVersion) {
      const url = '/solutionVersion/updateSoVer'
      this.isLoading = true
      const files = []
      editSolutionVersion.fileList.forEach((file) => {
        files.push({
          'kind': file.kind,
          'product': file.product,
          'fileName': file.fileInfo.FileName,
          'key': file.fileInfo.Key,
          'description': file.description
        })
      })
      axios.put(url, {
        id: editSolutionVersion.id,
        name: editSolutionVersion.name,
        version: editSolutionVersion.version,
        solution_id: editSolutionVersion.solution.id,
        solution: editSolutionVersion.solution.name,
        status: editSolutionVersion.status,
        brief: editSolutionVersion.brief,
        read_role: JSON.stringify(editSolutionVersion.read_role),
        write_role: JSON.stringify(editSolutionVersion.write_role),
        files: JSON.stringify(files),
        edit_comment: editSolutionVersion.edit_comment
      }).then(res => {
        this.isLoading = false
        if (res.status === 200) {
          this.$message.success('编辑解决方案【' + editSolutionVersion.name + '】成功')
          this.getSolutionVersion(this.currentPage, this.pageSize)
          this.$set(this.editSolutionVersion, 'name', '')
          this.$set(this.editSolutionVersion, 'version', '')
          this.$set(this.editSolutionVersion, 'solution', {})
          this.$set(this.editSolutionVersion, 'status', '')
          this.$set(this.editSolutionVersion, 'brief', '')
          this.$set(this.editSolutionVersion, 'read_role', '')
          this.$set(this.editSolutionVersion, 'write_role', '')
          this.$set(this.editSolutionVersion, 'fileList', [])
          this.$set(this.editSolutionVersion, 'files', '')
          this.$set(this.editSolutionVersion, 'edit_comment', '')
        } else {
          this.$message.error(res.status)
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getSolutionVersion(this.currentPage, this.pageSize)
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSolutionVersion(this.currentPage, this.pageSize)
      // console.log(`当前页: ${val}`)
    },
    delVersion(solutionVersion) {
      const url = '/solutionVersion/deleteSoVer'
      this.isLoading = true
      axios.delete(url, {
        params: {
          id: solutionVersion.id
        }
      }).then(res => {
        // console.log(res.headers)
        this.isLoading = false
        this.$message.warning('成功删除解决方案版本【' + solutionVersion.name + '】!')
        this.getSolutionVersion(this.currentPage, this.pageSize)
      })
    },
    handleBatchDelete() {
      const ids = this.sels.map(item => item.id).join()
      this.$confirm('删除选择的所有解决方案版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true
        const url = '/solutionVersion/batchDeleteSoVer'
        axios.post(url, {
          ids: ids
        }).then(res => {
          // console.log(res)
          this.isLoading = false
          if (res.status === 200) {
            this.getSolutionVersion(this.currentPage, this.pageSize)
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
.el-form-item__label {
  font-size: 12px;
}
.customWidth{
  width:80%;
}
</style>
