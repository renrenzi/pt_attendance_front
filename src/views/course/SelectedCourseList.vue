<template>
  <el-container>
    <el-header height="120">
      <el-card style="height: 100px;margin-top: 10px" class="idCard">

        <el-row :gutter="10">
          <el-col :span="4">
            <el-select v-model="condition.selectedCourse.studentId" placeholder="请选择学生">
              <el-option
                v-for="item in studentList"
                :key="item.id"
                :label="item.nickName"
                :value="item.id"
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
              @click="selectedCourseDialog = true, ableFlag = false, selectedCourse = {}"
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
              @click="deleteSelectedCourse(scope.row.id)"
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
          姓名:
        </el-col>
        <el-col :span="20">
          <el-input v-if="ableFlag" v-model="selectedCourse.nickName" disabled />
          <el-select v-else v-model="selectedCourse.studentId" placeholder="请选择学生">
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.nickName"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          已选课程:
        </el-col>
        <el-col :span="20">
          <el-select v-model="selectedCourse.courseId" placeholder="请选择课程">
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
import { batchDeleteSelectedCourse, pageSelectedCourseList, updateSelectedCourse } from '@/api/attendance/selectedCourse'
import { pageCourseList } from '@/api/attendance/course'
import { pageStudentList } from '@/api/attendance/student'
import { assertNormalMessage, assertSuccessMessage } from '@/utils/message'

export default {
  name: 'SelectedCourseList',
  data() {
    return {
      selectedCourse: {},
      selectedCourseDialog: false,
      fullscreenLoading: false,
      ableFlag: true,
      tableData: [],
      condition: {
        pageNum: 1,
        pageSize: 15,
        selectedCourse: {}
      },
      totalSize: 15,
      multipleSelection: [],
      currentPage: 1,
      courseList: [],
      studentList: []
    }
  },
  created() {
    this.handleCurrentChange(1)
    this.getCourseList()
    this.getStudentList()
  },
  methods: {
    deleteSelectedCourse(id) {
      this.$confirm('此操作将永久删除该選課記錄, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.loading = true
        batchDeleteSelectedCourse([id]).then(res => {
          this.handleCurrentChange(1)
          assertSuccessMessage('删除成功!')
        })
      }).catch(() => {
        assertNormalMessage('已取消删除')
      })
    },
    getStudentList() {
      pageStudentList({
        'pageNum': 1,
        'pageSize': 100
      }).then(res => {
        this.studentList = res.studentList
      })
    },
    handleSelectionCourse(selectedCourse) {
      selectedCourse.oldCourseId = selectedCourse.courseId
      this.selectedCourse = selectedCourse
      this.selectedCourseDialog = true
      this.ableFlag = true
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
        'pageSize': 100
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

.el-row {
  margin-top: 10px;
}
</style>
