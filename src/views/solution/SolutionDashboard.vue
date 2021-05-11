<template>
  <div class="app-container">
    <el-row v-for="(type,index) in typeList" :key="type.id">
      <el-col v-if="solutionList[index].length !=0" :span="6"><div class="gutter">{{ type.solution_type }}</div></el-col>
      <el-row :gutter="12" style="width: 100%">
        <el-col v-for="solution in solutionList[index]" :key="solution.id" :span="5">
          <el-card shadow="always" align="center" style="margin-top: 5px" @click.native="SolutionVersionList(solution.id)">
            {{ solution.name }}
          </el-card>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>

import axios from 'axios'

export default {
  data() {
    return {
      typeList: [],
      solutionList: []
    }
  },
  created() {
    this.getAllData()
  },
  methods: {
    getAllData() {
      const url = '/solutionType/findAll'
      axios.get(url).then(res => {
        this.typeList = res.data
        const solution_url = '/solution/getSolutionByType'
        this.typeList.forEach((type, index) => {
          this.solutionList.push([])
          axios.get(solution_url, {
            params: {
              type: type.solution_type
            }
          }).then(res => {
            res.data.forEach((item) => {
              this.solutionList[index].push(item)
            })
          })
        })
      })
      // console.log(this.solutionList)
    },
    SolutionVersionList(id) {
      this.$router.push(`/solution/list/${id}`)
    }
  }
}
</script>
 <style>
 .el-row {
   margin-top: 5px;
   margin-bottom: 5px;
   height: auto;
   display: flex;
   flex-wrap: wrap
 }
 </style>
