<template>
  <div class="app-container">
    <span>【{{ solutionVersion.name }}】版本详情：</span>
    <br>
    <br>
    <el-form :model="solutionVersion" :label-position="labelPosition" label-width="10%" :row-style="{height:'10px'}" size="mini">
      <el-form-item label="名称:">
        <span>{{ solutionVersion.name }}</span>
      </el-form-item>
      <el-form-item label="解决方案:">
        <span>{{ solutionVersion.solution }}</span>
      </el-form-item>
      <el-form-item label="版本号:">
        <span>{{ solutionVersion.version }}</span>
      </el-form-item>
      <el-form-item label="简介:">
        <span>{{ solutionVersion.brief }}</span>
      </el-form-item>
      <el-form-item label="配套文件:">
        <el-table :data="JSON.parse(solutionVersion.files)">
          <el-table-column prop="product" label="产品" align="center" />
          <el-table-column prop="kind" label="文件类型" align="center" />
          <el-table-column prop="fileName" label="文件名" align="center" />
          <el-table-column prop="version" label="版本号" align="center" />
          <el-table-column prop="description" label="说明" align="center" />
          <el-table-column
            v-slot="scope"
            label="操作"
            width="160"
            align="center"
          >
            <el-button type="text" size="small" round @click="download(scope.row.key)">下载</el-button>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="downloadAll(solutionVersion.files)">全部下载</el-button>
        <el-button type="primary" @click="export2Excel(solutionVersion)">导出配套关系</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { s3, bucket } from '../../utils/s3'
import moment from 'moment'

export default {
  data() {
    return {
      s3: null,
      bucket: '',
      triggerDelay: 100,
      removeDelay: 1000,
      solutionVersion: this.$route.params,
      labelPosition: 'left'
    }
  },
  created() {
    this.s3 = s3()
    this.bucket = bucket
  },
  methods: {
    downloadAll(filesString) {
      this.$message({
        message: '开始下载所有配套文件，请耐心等待',
        type: 'success'
      })
      const fileList = JSON.parse(filesString)
      // console.log(fileList)
      fileList.forEach((file, index) => {
        this.download(file.key, index * this.triggerDelay, this.removeDelay)
      })
    },
    download(key) {
      const params = {
        Bucket: this.bucket,
        Key: key
      }
      const self = this
      const url = this.s3.getSignedUrl('getObject', params)
      setTimeout(function() {
        const frame = document.createElement('iframe') // 创建a对象
        frame.setAttribute('style', 'display: none')
        frame.setAttribute('src', url)
        frame.setAttribute('id', 'iframeName')
        document.body.appendChild(frame)
        setTimeout(function() {
          const node = document.getElementById('iframeName')
          node.parentNode.removeChild(node)
        }, self.removeDelay)
      }, this.triggerDelay)
    },
    export2Excel(solutionVersion) {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../excel/Export2Excel')
        const tHeader = ['产品', '文件类型', '文件名', '版本号', '说明']
        const filterVal = ['product', 'kind', 'fileName', 'version', 'description']
        const list = JSON.parse(solutionVersion.files)
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, solutionVersion.name + '配套版本' + moment(new Date()).format('YYYYMMDDHHmmss'))
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
