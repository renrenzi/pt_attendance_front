<template>
  <el-container>
    <el-header height="120px">
      <el-card style="height: 100px;margin-top: 10px">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input  :gutter="10" placeholder="请输入标签名" />
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchAttendance"
            />
          </el-col>
          <el-col :span="6" :push="16">
            <el-button
              type="success"
              icon="el-icon-refresh-right"
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
        :current-page="condition.pageNum"
        :page-size="condition.pageSize"
        :page-sizes="[5, 15, 25, 35]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totalSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

    </el-main>

  </el-container>

</template>

<script>
import { pageAttendanceList } from '@/api/attendance/attendance'

export default {
  name: 'AttendanceList',
  data() {
    return {
      attendanceFlag: false,
      fullscreenLoading: false,
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 1,
        pageSize: 15
      },
      totalSize: 10
    }
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
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
</style>
