<template>
  <div style="padding:30px;">
    <router-view />
    <div>
      <!--el-button style="margin-left: 10px;" size="small" type="success" @click="listFiles">查看文件</el-button-->
      <div v-if="fileData">
        <el-table :data="fileData.Contents" border highlight-current-row style="width:100%">
          <el-table-column label="文件名称" width="900" >
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.FileName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="文件大小" width="100">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.ShowSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleDownload(fileData.Name, scope.row.Key)"
              >下载</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(fileData.Name, scope.row.Key)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { s3, bucket } from '../../../../utils/s3'

export default {
  data() {
    return {
      s3: null,
      fileData: null,
      bucket: bucket
    }
  },
  created() {
    this.s3 = s3()
    this.bucket = bucket
    this.initFileList()
  },
  methods: {
    initFileList() {
      const params = {
        Bucket: this.bucket,
        Delimiter: '',
        Prefix: this.$route.name
      }
      const self = this
      this.s3.listObjects(params, function(err, data) {
        if (err) {
          console.log(err, err.stack)// an error occurred
        } else {
          if (data && data.Contents) {
            // console.log(data)
            // self.fileData = [...data.Contents]
            self.fileData = data
            self.fileData.Contents.forEach((file) => {
              const FileName = file.Key.replace(data.Prefix + '/', '')
              self.$set(file, 'FileName', FileName)
              // const ShowSize = Math.round(file.Size / 1024 / 1024 * 100) / 100
              if (file.Size <= 1024) {
                self.$set(file, 'ShowSize', String(file.Size) + ' B')
              } else if (file.Size > 1024 && file.Size <= 1024 * 1024) {
                self.$set(file, 'ShowSize', String(Math.round(file.Size / 1024 * 100) / 100) + ' KB')
              } else if (file.Size > 1024 * 1024 && file.Size <= 1024 * 1024 * 1024) {
                self.$set(file, 'ShowSize', String(Math.round(file.Size / 1024 / 1024 * 100) / 100) + ' MB')
              } else {
                self.$set(file, 'ShowSize', String(Math.round(file.Size / 1024 / 1024 / 1024 * 100) / 100) + ' GB')
              }
            })
          }
        }
      })
    },
    handleDelete(bucket, key) {
      const params = {
        Bucket: bucket,
        Key: key
      }
      const self = this
      this.s3.deleteObject(
        params, function(err, data) {
          if (err) {
            console.log(err, err.stack) // an error occurred
            self.$message.error('删除文件' + key + '失败')
          } else {
            self.$message({
              message: '删除文件' + key + '成功',
              type: 'success'
            })
            self.initFileList()
          }
        })
    },
    handleDownload(bucket, key) {
      const params = {
        Bucket: bucket,
        Key: key
      }
      // this.s3.getObject(
      //   params, function(err, data) {
      //     if (err) console.log(err, err.stack) // an error occurred
      //     else console.log(data) // successful response
      //   })
      var url = this.s3.getSignedUrl('getObject', params)
      // console.log('The URL is', url)
      this.$message({
        message: '开始下载文件' + key + '，请耐心等待',
        type: 'success'
      })
      const a = document.createElement('a')
      a.href = url
      a.click()
    }
  }
}
</script>
