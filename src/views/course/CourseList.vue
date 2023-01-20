<template>
  <el-container>
    <el-header height="110">
      <el-card class="idCard">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input
              v-model="condition.course.name"
              placeholder="请输入课程名称"
            />
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
              @click="isVisible = true, course = {'selectedNum':0}"
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
        v-loading="loading"
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
          width="59"
        />
        <el-table-column
          prop="name"
          label="课程名称"
        />
        <el-table-column
          prop="teacherName"
          label="授课教师"
        />
        <el-table-column
          prop="courseDate"
          label="课程时间"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.courseDate | moment }}
          </template>
        </el-table-column>
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
          width="250"
          show-overflow-tooltip
        >
          <template slot-scope="scope">

            <el-button
              size="small"
              @click="editCourse(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteCourse(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="condition.pageNum"
        :page-sizes="[5, 15, 25, 35]"
        :page-size="condition.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totalSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-main>
    <el-dialog
      title="课程管理"
      :visible.sync="isVisible"
      width="40%"
    >
      <el-row>
        <el-col :span="4">
          课程名称：
        </el-col>
        <el-col :span="16">
          <el-input v-model="course.name" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          授课教师：
        </el-col>
        <el-col :span="16">
          <el-select v-model="course.teacherId" placeholder="请选择授課教師">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          选课人数：
        </el-col>
        <el-col :span="16">
          <el-input v-model="course.selectedNum" disabled />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          最多选课人数：
        </el-col>
        <el-col :span="16">
          <el-input v-model="course.maxNum" />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="manageCourse()">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { batchDeleteCourse, editCourseDetail, pageCourseList } from '@/api/attendance/course'
import { assertNormalMessage, assertSuccessMessage } from '@/utils/message'
import { pageTeacherList } from '@/api/attendance/teacher'

export default {
  name: 'CourseList',
  data() {
    return {
      isVisible: false,
      loading: true,
      tableData: [],
      teacherList: [],
      condition: {
        pageNum: 0,
        pageSize: 15,
        course: {}
      },
      course: {},
      totalSize: 10,
      multipleSelection: []
    }
  },
  created() {
    this.handleCurrentChange(1)
    this.getTeacherList()
  },
  methods: {
    getTeacherList() {
      pageTeacherList({
        pageNum: 1,
        pageSize: 1000
      }).then(res => {
        this.teacherList = res.teacherList
      })
    },
    manageCourse() {
      editCourseDetail({
        'id': this.course.id,
        'info': this.course.info,
        'maxNum': this.course.maxNum,
        'name': this.course.name,
        'selectedNum': this.course.selectedNum,
        'teacherId': this.course.teacherId
      }).then(res => {
        this.handleCurrentChange(1)
        this.isVisible = false
      })
    },
    editCourse(course) {
      this.isVisible = true
      this.course = course
    },
    deleteCourse(id) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.loading = true
        batchDeleteCourse([id]).then(res => {
          this.handleCurrentChange(1)
          assertSuccessMessage('删除成功!')
        })
      }).catch(() => {
        assertNormalMessage('已取消删除')
      })
    },
    refreshPage() {
      this.loading = true
      this.condition.course = {}
      this.handleCurrentChange(1)
    },
    searchPage() {
      this.handleCurrentChange(1)
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
      pageCourseList(this.condition).then(res => {
        this.loading = false
        this.totalSize = res.totalSize
        this.tableData = res.pageCourseDtoList
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val
      pageCourseList(this.condition).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.pageCourseDtoList
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.idCard{
  height: 100px;
  margin-top: 10px;
  width: 95%;
}
.el-row{
  margin-top: 10px;
}
</style>
