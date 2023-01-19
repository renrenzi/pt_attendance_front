<template>
  <el-container>
    <el-header height="120">
      <el-card style="height: 100px;margin-top: 10px" class="idCard">

        <el-row :gutter="10">
          <el-col :span="4">
            <el-select v-model="condition.blogId" placeholder="请选择博客标题">
              <el-option
                v-for="item in blogList"
                :key="item.blogId"
                :label="item.blogTitle"
                :value="item.blogId"
              />
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchPage"
            />

          </el-col>
          <el-col :span="4" :push="14">
            <el-button
              type="success"
              icon="el-icon-refresh-right"
              size="small"
              @click="refreshPage"
            />
            <el-button
              type="primary"
              size="small"
              @click="selectedCourseDialog = true"
            >
              新增
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-header>
    <el-main>
      <el-table
        ref="multipleTable"
        v-loading="fullscreenLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 95%;margin-top: 10px"
        :border="true"
        :header-cell-style="{background:'#e1e4e5',color:'#80878f','text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="userName"
          label="学号"
        />
        <el-table-column
          prop="nickName"
          label="姓名"
        />
        <el-table-column
          prop="courseName"
          label="课程名称"
        />
        <el-table-column
          prop="selectedNum"
          label="选课人数"
        />
        <el-table-column
          prop="maxNum"
          label="最多选课人数"
        />
        <el-table-column
          prop="name"
          label="操作"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleSelectionCourse(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-size="condition.pageSize"
        :page-sizes="[5, 15, 25, 35]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totalSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-main>

    <el-dialog
      title="选课管理"
      :visible.sync="selectedCourseDialog"
      width="35%"
      center
    >
      <el-row type="flex" justify="center">
        <el-col :span="4">
          学号:
        </el-col>
        <el-col :span="20">
          <el-input v-model="selectedCourse.userName" disabled />
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          姓名:
        </el-col>
        <el-col :span="20">
          <el-input v-model="selectedCourse.nickName" disabled />
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          已选课程:
        </el-col>
        <el-col :span="20">
          <el-select v-model="selectedCourse.courseId" placeholder="请选择授課教師">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectedCourseDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateSelectedCourse()">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { pageSelectedCourseList, updateSelectedCourse } from '@/api/attendance/selectedCourse'
import { pageCourseList } from '@/api/attendance/course'

export default {
  name: 'CommentList',
  data() {
    return {
      selectedCourse: {},
      selectedCourseDialog: false,
      fullscreenLoading: false,
      tableData: [],
      condition: {
        pageNum: 1,
        pageSize: 15
      },
      totalSize: 15,
      multipleSelection: [],
      currentPage: 1,
      courseList: []
    }
  },
  created() {
    this.handleCurrentChange(1)
    this.getCourseList()
  },
  methods: {
    handleSelectionCourse(selectedCourse) {
      selectedCourse.oldCourseId = selectedCourse.courseId
      this.selectedCourse = selectedCourse
      this.selectedCourseDialog = true
    },
    updateSelectedCourse() {
      updateSelectedCourse(this.selectedCourse).then(res => {
        this.selectedCourseDialog = false
        this.handleCurrentChange(1)
      })
    },
    getCourseList() {
      pageCourseList({
        'pageNum': 1,
        'pageSize': 1000
      }).then(res => {
        this.courseList = res.pageCourseDtoList
      })
    },
    refreshPage() {
      this.tableData = []
      this.handleCurrentChange(1)
    },
    searchPage() {
      this.tableData = []
      this.loding = true
      this.handleCurrentChange(1)
      this.loding = false
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.condition.pageSize = val
      this.fullscreenLoading = true
      pageSelectedCourseList(this.condition).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.selectedCourseList
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val
      this.fullscreenLoading = true
      pageSelectedCourseList(this.condition).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.selectedCourseList
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    }
  }
}
</script>

<style scoped>
.idCard {
  height: 100px;
  margin-top: 10px;
  width: 95%;
}
.el-row{
  margin-top: 10px;
}
</style>
