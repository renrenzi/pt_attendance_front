<template>
  <el-container>
    <el-header height="120">
      <el-card style="height: 130px;margin-top: 10px;width: 95%">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input v-model="condition.teacher.username" :gutter="10" placeholder="请输入教师名称"/>
          </el-col>

          <el-col :span="4" :push="18">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="search"
            />
            <el-button
              type="success"
              icon="el-icon-refresh-right"
              size="small"
              @click="refresh"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :push="22">
            <el-button
              type="primary"
              size="small"
              @click="teacherDialog=true; form = {}; isEdit = false"
            >
              添加教师信息
            </el-button>
          </el-col>
        </el-row>
      </el-card>
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
          label="名称"
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
              size="small"
              @click="editTeacher(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteTeacher(scope.row.id)"
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
        layout="total,sizes,prev, pager, next, jumper"
        :total="totalSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-main>
    <el-dialog
      :title="isEdit ? '修改教师信息' : '添加教师信息'"
      :visible.sync="teacherDialog"
      width="30%"
      center
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.username" :disabled="isEdit"></el-input>
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
          <el-button type="primary" v-if="!isEdit" @click="onSubmit" >立即创建</el-button>
          <el-button type="primary" v-else @click="onEdit">编辑</el-button>
          <el-button @click="teacherDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import {addTeacher, batchDeleteTeacher, pageTeacherList, updateTeacherInfo} from "@/api/attendance/teacher";
import {getAllClazz} from "@/api/attendance/clazz";

export default {
  name: 'StudentList',
  data() {
    return {
      fullscreenLoading: false,
      teacherDialog: false,
      isEdit: false,
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 1,
        pageSize: 15,
        teacher: {}
      },
      form: {
        username: '',
        password: '',
        sex: '',
        clazzId: null,
        mobile: ''
      },
      clazzList: [],
      totalSize: 10
    }
  },
  created() {
    this.handleCurrentChange(1)
    this.initClazzList()
  },
  methods: {
    initClazzList() {
      getAllClazz().then(res => {
        this.clazzList = res
      })
    },
    editTeacher(teacher) {
      this.form.id = teacher.id
      this.form.sex = teacher.sex
      this.form.clazzId = teacher.clazzId
      this.form.mobile = teacher.mobile
      this.form.username = teacher.username
      this.teacherDialog = true
      this.isEdit = true
    },
    onEdit() {
      updateTeacherInfo(this.form).then(res => {
        this.teacherDialog = false
        this.isEdit = false
        this.handleCurrentChange(1)
      })
    },
    onSubmit() {
      addTeacher(this.form).then(res => {
        this.teacherDialog = false
        this.handleCurrentChange(1)
      })
    },
    deleteTeacher(id) {
      this.$confirm(' 删除教师时,会将跟它绑定的账号同时删除! 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        batchDeleteTeacher([id]).then(res => {
          this.handleCurrentChange(1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清除数据库'
        })
      })
    },
    search() {
      this.handleCurrentChange(1);
    },
    refresh() {
      this.condition.teacher = {}
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
      this.fullscreenLoading = true
      pageTeacherList(this.condition).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.teacherList
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val
      this.fullscreenLoading = true
      pageTeacherList(this.condition).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.teacherList
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
