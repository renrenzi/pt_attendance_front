<template>
  <el-container>
    <el-header height="120px">
      <el-card style="height: 120px;margin-top: 10px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-select v-model="condition.attendance.studentId" placeholder="请选择学生">
              <el-option
                v-for="item in studentList"
                :key="item.id"
                :label="item.nickName"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-col>
          <el-col :span="4" :push="14">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchAttendance"
            />
            <el-button
              type="primary"
              size="small"
            >
              导出
            </el-button>
          </el-col>

        </el-row>
        <el-row :gutter="10">
          <el-col :span="4" :push="21">
            <el-button
              type="danger"
              size="small"
            >
              批量删除
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="attendanceDialog = true;attendance = {};ableFlag = false"
            >
              添加考勤
            </el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-dialog
        title="添加标签信息"
        :visible.sync="attendanceFlag"
        width="30%"
        size="small"
      >
        <el-input/>
        <span slot="footer" class="dialog-footer">
              <el-button >取 消</el-button>
              <el-button type="primary">确 定</el-button>
            </span>
      </el-dialog>
    </el-header>
    <el-main>

      <el-table
        ref="multipleTable"
        v-loading="fullscreenLoading"
        :header-cell-style="{background:'#e1e4e5',color:'#80878f','text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :border="true"
        element-loading-text="正在拼命加载中/(ㄒoㄒ)/~~"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="57"
        />
        <el-table-column
          prop="username"
          label="学号"
        />
        <el-table-column
          prop="nickname"
          label="学生名称"
        />
        <el-table-column
          prop="courseName"
          label="课程名称"
        />
        <el-table-column
          prop="type"
          label="考勤状态"
        />
        <el-table-column
          prop="date"
          label="考勤时间"
        >
          <template slot-scope="scope">
            {{ scope.row.date | moment }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="editAttendance(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteAttendance(scope.row.id)"
            >
              删除
            </el-button>
          </template>

        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="condition.pageNum"
        :page-size="condition.pageSize"
        :page-sizes="[5, 15, 25, 35]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totalSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

    </el-main>
    <el-dialog
      title="考勤管理"
      :visible.sync="attendanceDialog"
      width="35%"
      center
    >
      <el-row type="flex" justify="center" v-if="ableFlag">
        <el-col :span="4" >
          学号:
        </el-col>
        <el-col :span="20">
          <el-input v-model="attendance.username" disabled />
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          姓名:
        </el-col>
        <el-col :span="20">
          <el-input v-if="ableFlag" v-model="attendance.nickname" disabled />
          <el-select v-else v-model="attendance.studentId" placeholder="请选择学生">
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
          课程名称:
        </el-col>
        <el-col :span="20">
          <el-input v-if="ableFlag" v-model="attendance.courseName" disabled />
          <el-select v-else v-model="attendance.courseId" placeholder="请选择课程">
            <el-option
              v-for="item in courseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          考勤状态:
        </el-col>
        <el-col :span="20">
          <el-select v-model="attendance.type" placeholder="请选择考勤状态">
            <el-option
              v-for="item in attendanceTypeList"
              :key="item.message"
              :label="item.message"
              :value="item.type"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          考勤时间:
        </el-col>
        <el-col :span="20">
          <el-date-picker
            v-model="attendance.date"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="attendanceDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateAttendance()">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>

</template>

<script>
import {batchDeleteAttendance, pageAttendanceList, updateAttendance} from '@/api/attendance/attendance'
import {pageStudentList} from "@/api/attendance/student";
import {pageCourseList} from "@/api/attendance/course";
import {assertNormalMessage, assertSuccessMessage} from "@/utils/message";

export default {
  name: 'AttendanceList',
  data() {
    return {
      attendanceFlag: false,
      fullscreenLoading: false,
      attendanceDialog: false,
      ableFlag: true,
      startTime: '',
      endTime: '',
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 1,
        pageSize: 15,
        attendance: {}
      },
      totalSize: 10,
      studentList: [],
      courseList: [],
      attendance: {},
      attendanceTypeList: [
        {
          type: 'attendance',
          message: '出勤'
        },
        {
          type: 'compassionate',
          message: '事假'
        },
        {
          type: 'sick',
          message: '病假'
        },
        {
          type: 'late',
          message: '迟到'
        },
        {
          type: 'early',
          message: '早退'
        },
        {
          type: 'truancy',
          message: '旷课'
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dateRange: ""
    }
  },
  created() {
    this.handleCurrentChange(1)
    this.getStudentList()
    this.getCourseList()
  },
  methods: {
    deleteAttendance(id) {
      this.$confirm('此操作将永久删除该考勤記錄, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.fullscreenLoading = true
        batchDeleteAttendance([id]).then(res => {
          this.handleCurrentChange(1)
          assertSuccessMessage('删除成功!')
        })
      }).catch(() => {
        assertNormalMessage('已取消删除')
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
    updateAttendance() {
      updateAttendance(this.attendance).then(res => {
        this.searchAttendance()
        this.attendanceDialog = false
      })
    },
    editAttendance(attendance) {
      this.attendance = attendance
      this.attendanceDialog = true
      this.ableFlag = true
    },
    getStudentList() {
      pageStudentList({
        'pageNum': 1,
        'pageSize': 100
      }).then(res => {
        this.studentList = res.studentList
      })
    },
    searchAttendance() {
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
      const _this = this
      this.fullscreenLoading = true
      pageAttendanceList(this.condition).then(res => {
        _this.totalSize = res.totalSize
        _this.tableData = res.attendanceList
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val
      const _this = this
      this.fullscreenLoading = true
      pageAttendanceList(this.condition).then(res => {
        _this.totalSize = res.totalSize
        _this.tableData = res.attendanceList
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    }
  }
}
</script>
<style scoped>
/* switch按钮样式 */
.switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff !important;
}
/*打开时文字位置设置*/
.switch .el-switch__label--right {
  z-index: 1;
}
/* 调整打开时文字的显示位子 */
.switch .el-switch__label--right span{
  margin-right: 9px;
}
/*关闭时文字位置设置*/
.switch .el-switch__label--left {
  z-index: 1;
}
/* 调整关闭时文字的显示位子 */
.switch .el-switch__label--left span{
  margin-left: 9px;
}
/*显示文字*/
.switch .el-switch__label.is-active {
  display: block;
}
/* 调整按钮的宽度 */
.switch.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 70px !important;
  margin: 0;
}
.el-row {
  margin-top: 10px;
}
</style>
