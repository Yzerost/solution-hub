<template>
  <div id="fileManager">
    <div id="upload">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-preview="handlePreview"
        :before-upload="beforeUploadFile"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :on-success="handleFileSuccess"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" style="margin-top: 15px; margin-left: 15px" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 15px" size="small" type="primary" @click="chooseFiles">选择文件夹</el-button>
        <div v-show="false">
          <input id="file" ref="file" type="file" webkitdirectory directory multiple="multiple" @change="handleFileUpload($event)">
        </div>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
      <div class="fileList">
        <div v-for="(item,index) in fileList" :key="index">
          <el-select
            v-model="productValueList[index]"
            style="margin-left: 15px; margin-top: 10px; width: 120px;"
            placeholder="产品选择"
          >
            <el-option
              v-for="product in products"
              :key="product.productValue"
              :label="product.label"
              :value="product.productValue"
            />
          </el-select>
          <el-select v-model="kindValueList[index]" placeholder="分类选择" style="width: 120px">
            <el-option
              v-for="kind in kinds"
              :key="kind.kindValue"
              :label="kind.label"
              :value="kind.kindValue"
            />
          </el-select>
          <span style="font-size: 14px; display:-moz-inline-box; display:inline-block; width:40%;padding-left: 30px">{{ item.name }} </span>
          <span style="font-size: 14px; display:-moz-inline-box; display:inline-block; width:10%">{{ item.ShowSize }} </span>
          <div class="bar">
            <el-progress :text-inside="true" :stroke-width="18" status="exception" :show-text="true" :percentage="item.uploadPercent" />
          </div>
          <div style="display: inline-block;margin-right: auto;">
            <span @click="removeFile(item,index)">[x]</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { s3, bucket } from '../../../utils/s3'
import { products, kinds } from '../../../api/configs.js'

export default {
  name: 'App',
  data() {
    return {
      collapsed: false,
      s3: null,
      bucket: '',
      productValueList: [],
      products: [],
      kindValueList: [],
      productValue: '',
      kinds: [],
      kindValue: '',
      fileList: []
    }
  },
  created() {
    this.s3 = s3()
    this.bucket = bucket
    this.products = products
    this.kinds = kinds
  },
  methods: {
    // 触发文件夹选择
    chooseFiles(e) {
      document.getElementById('file').click()
    },
    // 选择文件夹，将文件加入到列表中
    handleFileUpload(event) {
      const folderFileList = document.getElementById('file').files
      const length = folderFileList.length
      for (let i = 0; i < length; i++) {
        // eslint-disable-next-line no-new-object
        const file = new Object()
        // 直接获取的folderFileList[i]是File类型，和el-upload获取的内容不一致，需要重新封装
        // this.$set(file, 'ShowSize', Math.round(folderFileList[i].size / 1024 / 1024 * 100) / 100)
        if (folderFileList[i].size <= 1024) {
          this.$set(file, 'ShowSize', String(folderFileList[i].size) + ' B')
        } else if (folderFileList[i].size > 1024 && folderFileList[i].size <= 1024 * 1024) {
          this.$set(file, 'ShowSize', String(Math.round(folderFileList[i].size / 1024 * 100) / 100) + ' KB')
        } else if (folderFileList[i].size > 1024 * 1024 && folderFileList[i].size <= 1024 * 1024 * 1024) {
          this.$set(file, 'ShowSize', String(Math.round(folderFileList[i].size / 1024 / 1024 * 100) / 100) + ' MB')
        } else {
          this.$set(file, 'ShowSize', String(Math.round(folderFileList[i].size / 1024 / 1024 / 1024 * 100) / 100) + ' GB')
        }
        this.$set(file, 'raw', folderFileList[i])
        this.$set(file, 'name', folderFileList[i].name)
        this.$set(file, 'uploadFlag', true)
        console.log(file)
        this.fileList.push(file)
      }
      // folderFileList.forEach((file) => {
      //   this.fileList.push(file)
      //   this.$set(file, 'showSize', Math.round(file.size / 1024 / 1024 * 100) / 100)
      // })
    },
    beforeUploadFile(file) {
      this.$set(file, 'uploadFlag', true)
    },
    handleChange(file, fileList) {
      this.fileList = fileList
      if (file.size <= 1024) {
        this.$set(file, 'ShowSize', String(file.size) + ' B')
      } else if (file.size > 1024 && file.size <= 1024 * 1024) {
        this.$set(file, 'ShowSize', String(Math.round(file.size / 1024 * 100) / 100) + ' KB')
      } else if (file.size > 1024 * 1024 && file.size <= 1024 * 1024 * 1024) {
        this.$set(file, 'ShowSize', String(Math.round(file.size / 1024 / 1024 * 100) / 100) + ' MB')
      } else {
        this.$set(file, 'ShowSize', String(Math.round(file.size / 1024 / 1024 / 1024 * 100) / 100) + ' GB')
      }
      this.$set(file, 'uploadFlag', true)
      // console.log(file)
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
    },
    removeFile(item, index) {
      this.fileList.splice(index, 1)
    },
    handlePreview(file) {
    },
    handleFileSuccess(response, file, fileList) {
      this.fileList = fileList
      this.fileList.forEach((item) => {
        item.progressFlag = true
        // eslint-disable-next-line eqeqeq
        if (item.status == 'success') {
          item.successFlag = true
        } else {
          item.successFlag = false
        }
      })
    },
    submitUpload() {
      // const AWS = require('aws-sdk')
      // var bucketRegion = 'ap-northeast-1'
      // var IdentityPoolId = 'ap-northeast-1:43ee37c0-72d7-4d81-ad58-90b3e4762000'
      //
      // AWS.config.update({
      //   region: bucketRegion,
      //   credentials: new AWS.CognitoIdentityCredentials({
      //     IdentityPoolId: IdentityPoolId
      //   })
      // })
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].uploadFlag) {
          console.log('begin to uploadFile', this.fileList[i].name)
          // const startTime = new Date()
          // console.log('key is : ', this.productValueList[i] + '/' + this.kindValueList[i] + '/' + this.fileList[i].name)
          const params = {
            // Bucket: 'tenant:solutionhub',
            Bucket: this.bucket,
            Key: this.productValueList[i] + '/' + this.kindValueList[i] + '/' + this.fileList[i].name,
            Body: this.fileList[i].raw
          }
          const options = { partSize: 200 * 1024 * 1024, queueSize: 1 }
          var upload = this.s3.upload(params, options, function(err, data) {
            console.log(err, data)
          })
          // var upload = new AWS.S3.ManagedUpload({
          //   partSize: 200 * 1024 * 1024, queueSize: 1,
          //   params: {
          //     // Bucket: 'tenant:solutionhub',
          //     Bucket: 'yzerost',
          //     Key: this.productValueList[i] + '/' + this.kindValueList[i] + '/' + this.fileList[i].name,
          //     Body: this.fileList[i].raw
          //   }
          // }
          // )
          const promise = upload.promise()
          const self = this
          promise.then(
            function(data) {
              self.$set(self.fileList[i], 'uploadFlag', false)
            },
            function(err) {
              return console.log('upload failed', err.message)
            }
          )
          upload.on('httpUploadProgress', progress => {
            this.$set(this.fileList[i], 'uploadPercent', Math.round((100 * progress.loaded) / progress.total))
            // console.log(this.fileList[i].name, ' uploadPercent is', this.fileList[i].uploadPercent)
            if (this.fileList[i].uploadPercent >= 100) {
              this.fileList[i].uploadPercent = 100
            }
          })
        }
      }
    },
    listFiles() {
      // eslint-disable-next-line no-undef
      var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: 'yzerost' }
      })
      var params = {
        Bucket: 'yzerost', /* required */
        Delimiter: '',
        Prefix: 'CloudOS'
      }
      s3.listObjects(params, function(err, data) {
        if (err) console.log(err, err.stack) // an error occurred
        // else console.log(data) // successful response
      })
    }
  }
}

</script>

<style>
@import url("//unpkg.com/element-ui@2.0.5/lib/theme-chalk/index.css");
.bar {
  width: 20%;
  display: inline-block;
  margin-right: auto;
}
</style>
