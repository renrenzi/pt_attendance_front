<template>
  <el-container>
    <el-header height="120">
      <el-card style="height: 130px;margin-top: 10px;width: 95%">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input v-model="condition.student.nickName" :gutter="10" placeholder="请输入学生昵称"/>
          </el-col>

          <el-col :span="4" :push="18">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchStudentByCondition()"
            />
            <el-button
              type="success"
              icon="el-icon-refresh-right"
              size="small"
              @click="refreshStudentList()"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :push="22">
            <el-button
              type="primary"
              size="small"
              @click="studentDialog = true; form = {}; isEdit = false"
            >
              添加学生信息
            </el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-dialog
        title="添加学生信息"
        :visible.sync="studentDialog"
        width="30%"
        center
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="学号">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="密码" v-if="!isEdit">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
          <el-form-item label="专业名称">
            <el-select v-model="form.clazzId" placeholder="请选择专业">
              <el-option
                v-for="item in clazzList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" v-if="!isEdit">立即创建</el-button>
            <el-button type="primary" @click="onEdit" v-else>编辑</el-button>
            <el-button @click="studentDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-header>
    <el-main>
      <el-table
        id="boxbox"
        ref="multipleTable"
        v-loading="fullscreenLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 95%"
        :border="true"
        :header-cell-style="{background:'#e1e4e5',color:'#80878f','text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="57"
        />
        <el-table-column
          prop="adminId"
          label="AdminId"
        />
        <el-table-column
          prop="username"
          label="学号"
        />
        <el-table-column
          prop="nickName"
          label="昵称"
        />
        <el-table-column
          prop="clazzName"
          label="专业名称"
        />
        <el-table-column
          prop="sex"
          label="性别"
        />
        <el-table-column
          prop="mobile"
          label="电话"
        />
        <el-table-column
          prop="name"
          label="操作"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="editStudent(scope.row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteStudent(scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="condition.pageNum"
        :page-size="condition.pageSize"
        :page-sizes="[5, 15, 25, 35]"
        layout="total,sizes,prev, pager, next, jumper"
        :total="totalSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-main>
  </el-container>
</template>

<script>
import {addStudent, batchDeleteStudentList, pageStudentList, updateStudentInfo} from '@/api/attendance/student'
import {getAllClazz} from "@/api/attendance/clazz";

export default {
  name: 'StudentList',
  data() {
    return {
      studentDialog: false,
      fullscreenLoading: false,
      isEdit: false,
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 1,
        pageSize: 15,
        student: {}
      },
      totalSize: 10,
      form: {
        username: '',
        nickName: '',
        password: '',
        sex: '',
        clazzId: null,
        mobile: ''
      },
      clazzList: []
    }
  },
  created() {
    this.handleCurrentChange(1)
    this.initClazzList()
  },
  methods: {
    onEdit() {
      updateStudentInfo(this.form).then(res => {
        this.studentDialog = false
        this.isEdit = false
        this.handleCurrentChange(1)
      })
    },
    editStudent(student) {
      this.form.id = student.id
      this.form.sex = student.sex
      this.form.clazzId = student.clazzId
      this.form.mobile = student.mobile
      this.form.username = student.username
      this.form.nickName = student.nickName
      this.studentDialog = true
      this.isEdit = true
    },
    initClazzList() {
      getAllClazz().then(res => {
        this.clazzList = res
      })
    },
    onSubmit() {
      addStudent(this.form).then(res => {
        this.handleCurrentChange(1)
        this.studentDialog = false
      })
    },
    refreshStudentList() {
      this.condition.student = {}
      this.handleCurrentChange(1)
    },
    searchStudentByCondition() {
      this.handleCurrentChange(1)
    },
    deleteStudent(id) {
      this.$confirm(' 删除学生时,会将跟它绑定的账号同时删除! 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        batchDeleteStudentList([id]).then(res => {
          this.handleCurrentChange(1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清除数据库'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.condition.pageSize = val
      this.fullscreenLoading = true
      pageStudentList(this.condition).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.studentList
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val
      this.fullscreenLoading = true
      pageStudentList(this.condition).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.studentList
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    }
  }
}
</script>

<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

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
