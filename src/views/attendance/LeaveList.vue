<template>
  <el-container>
    <el-header height="120px">
      <el-card style="height: 100px;margin-top: 10px">

        <el-row :gutter="10">
          <el-col :span="4">
            <el-select v-model="condition.leave.studentId" placeholder="请选择学生">
              <el-option
                v-for="item in studentList"
                :key="item.id"
                :label="item.nickName"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchLeave"
            />
          </el-col>
          <el-col :span="8" :push="10">
            <el-button
              type="primary"
              @click="leaveFlag = true;leave = {};ableFlag = false"
            >
              添加请假
            </el-button>
            <el-button
              type="success"
              icon="el-icon-refresh-right"
              size="small"

              @click="searchLeave"
            />
          </el-col>
        </el-row>
      </el-card>
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
          prop="userName"
          label="学号"
        />
        <el-table-column
          prop="nickname"
          label="姓名"
        />
        <el-table-column
          prop="info"
          label="请假详情"
        />
        <el-table-column
          prop="status"
          label="请假状态"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              class="switch"
              active-text="已请假"
              inactive-text="未请假"
              active-color="#13ce66"
              inactive-color="#ff4949"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="请假备注"
        />
        <el-table-column
          prop="createDate"
          label="请假时间"
        >
          <template slot-scope="scope">
            {{ scope.row.createDate | moment }}
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
              @click="gotoEditLeave(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteLeave(scope.row.id)"
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
      title="请假管理"
      :visible.sync="leaveFlag"
      width="35%"
      center
    >
      <el-row type="flex" justify="center" v-if="ableFlag">
        <el-col :span="4">
          学号:
        </el-col>
        <el-col :span="20">
          <el-input v-model="leave.userName" disabled/>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          姓名:
        </el-col>
        <el-col :span="20">
          <el-input v-if="ableFlag" v-model="leave.nickname" disabled/>
          <el-select v-else v-model="leave.studentId" placeholder="请选择学生">
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
          请假详情:
        </el-col>
        <el-col :span="20">
          <el-input v-model="leave.info"/>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          请假备注:
        </el-col>
        <el-col :span="20">
          <el-input v-model="leave.remark"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          请假情况：
        </el-col>
        <el-col :span="16">
          <el-switch
            v-model="leave.status"
            class="switch"
            active-text="已请假"
            inactive-text="未请假"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="leaveFlag = false">取 消</el-button>
        <el-button type="primary" @click="updateLeave()">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>

</template>

<script>

import {batchDeleteLeave, pageLeaveList, updateLeaveInfo} from '@/api/attendance/leave'
import {pageStudentList} from "@/api/attendance/student";
import {batchDeleteAttendance} from "@/api/attendance/attendance";
import {assertNormalMessage, assertSuccessMessage} from "@/utils/message";

export default {
  name: 'LabelList',
  data() {
    return {
      leaveFlag: false,
      fullscreenLoading: false,
      ableFlag: true,
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 1,
        pageSize: 15,
        leave: {}
      },
      totalSize: 10,
      leave: {},
      studentList: []
    }
  },
  created() {
    this.searchLeave()
    this.getStudentList()
  },
  methods: {
    deleteLeave(id) {
      this.$confirm('此操作将永久删除该请假記錄, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.fullscreenLoading = true
        batchDeleteLeave([id]).then(res => {
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
    gotoEditLeave(leave) {
      this.leave = leave
      this.leaveFlag = true
    },
    updateLeave() {
      updateLeaveInfo(this.leave).then(res => {
        this.searchLeave()
        this.leaveFlag = false
      })
    },
    searchLeave() {
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
      pageLeaveList(this.condition).then(res => {
        _this.totalSize = res.totalSize
        _this.tableData = res.leaveList
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val
      const _this = this
      this.fullscreenLoading = true
      pageLeaveList(this.condition).then(res => {
        _this.totalSize = res.totalSize
        _this.tableData = res.leaveList
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
.switch .el-switch__label--right span {
  margin-right: 9px;
}

/*关闭时文字位置设置*/
.switch .el-switch__label--left {
  z-index: 1;
}

/* 调整关闭时文字的显示位子 */
.switch .el-switch__label--left span {
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
