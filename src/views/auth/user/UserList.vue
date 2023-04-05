<template>
  <el-container>
    <el-header height="120">
      <el-dialog
        title="分配角色"
        :visible.sync="isDivide"
        width="30%"
        center
      >
        <el-row>
          <el-col :span="16">
            <el-select v-model="userRoleList" multiple placeholder="请选择角色标签">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleName"
                @click.native="handleRoleId(item.roleId)"
              />
            </el-select>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDivide = false">取 消</el-button>
          <el-button type="primary" @click="toAllocateRole()">确 定</el-button>
        </span>
      </el-dialog>

      <el-row>
        <el-card id="headCard">
          <el-row>
            <el-col :span="2">
              <icon class="el-icon-share">
                <span>筛选</span>
              </icon>
            </el-col>
            <el-col :span="4" push="20">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="searchUser()"
              />
              <el-button
                type="success"
                icon="el-icon-refresh-right"
                size="small"
                @click="reload()"
              />
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="4">
              <el-input v-model="condition.loginUserName" :gutter="10" placeholder="请输入用户名" />
            </el-col>
            <el-col :span="4">
              <el-select v-model="condition.roleId" :span="4"  placeholder="请选择角色标签">
                <el-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-col>
            <el-col :span="2" :push="14">
              <el-button
                @click="isAddOrEdit = true, isEdit = false, adminUser={}"
              >
                添加
              </el-button>
            </el-col>
            <el-dialog
              title="添加用户"
              :visible.sync="isAddOrEdit"
              width="30%"
              center
            >
              <el-row>
                <el-col span="6">
                  用户名称：
                </el-col>
                <el-col span="16">
                  <el-input
                    v-model="adminUser.loginUserName"
                    placeholder="请输入用户名"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col span="6">
                  用户密码：
                </el-col>
                <el-col span="16">
                  <el-input
                    v-model="adminUser.loginPassword"
                    type="password"
                    :rows="4"
                    placeholder="请输入密码"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col span="6">
                  用户昵称：
                </el-col>
                <el-col span="16">
                  <el-input
                    v-model="adminUser.nickName"
                    placeholder="请输入昵称"
                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col span="6">
                  是否启用：
                </el-col>
                <el-col span="4">
                  <el-switch
                    v-model="adminUser.locked === 1"
                    class="switch"
                    active-text="启用"
                    inactive-text="禁用"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @click.native="adminUser.locked = adminUser.locked === 1 ? 0 : 1"
                  />
                </el-col>
              </el-row>

              <span slot="footer" class="dialog-footer">
                <el-button @click="isAddOrEdit = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
              </span>
            </el-dialog>
          </el-row>
        </el-card>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        id="boxbox"
        ref="multipleTable"
        v-loading="fullscreenLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 95%;margin-left: 10px;margin-top: 10px"
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
          type="id"
          prop="id"
          label="编号"
          width="50"
        />
        <el-table-column
          prop="userName"
          label="账号"
        />
        <el-table-column
          prop="info.username"
          label="用户名"
        />
        <el-table-column
          prop="info.nickName"
          label="昵称"
        />
        <el-table-column
          prop="info.sex"
          label="性别"
        />
        <el-table-column
          prop="roleName"
          label="角色"
        />
        <el-table-column
          prop="createDate"
          label="头像"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: 30px"
              :src="scope.row.imgUrl"
              fit="fill"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="当前状态"
          width="221"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.locked === 1 ? true : false"
              class="switch"
              active-text="已锁定"
              inactive-text="未锁定"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click.native="handleLockedChange(scope.row.adminUserId, scope.row.locked)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          show-overflow-tooltip
          width="245"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleAllocateUser(scope.row.id)"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleEditUser(scope.row)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteUser(scope.row.adminUserId)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-left: 10px"
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
import qs from 'qs'
import {deleteUsers, editUserInfo, pageAdminInfoList, registerUser} from '@/api/attendance/admin'
import {getAllRole, pageRole} from '@/api/attendance/userRole'
import { allocateRole, getRoleListById } from '@/api/attendance/userRoleRelation'

export default {
  name: 'UserManager',
  data() {
    return {
      adminUserId: null,
      requestIds: null,
      roleList: {},
      userRoleList: [],
      adminUser: {
        locked: 0
      },
      isDivide: false,
      loginUserName: null,
      isEdit: false,
      isAddOrEdit: false,
      fullscreenLoading: false,
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 1,
        pageSize: 15,
        roleId: 7
      },
      totalSize: 10
    }
  },
  created() {
    this.handleCurrentChange(1)
    this.getRoleList()
  },
  methods: {
    reload() {
      this.condition.loginUserName = null
      this.handleCurrentChange(1)
    },
    searchUser() {
      this.handleCurrentChange(1)
    },
    toAllocateRole() {
      const params = new URLSearchParams()
      params.append('adminId', this.adminUserId)
      params.append('roleIds', Array.from(this.requestIds))
      allocateRole(params).then(res => {
        if (res.code === 2000) {
          this.isDivide = false
        }
      })
    },
    handleAllocateUser(id) {
      this.isDivide = true
      this.adminUserId = id
      getRoleListById(qs.stringify({
        adminId: id
      })).then(res => {
        const list = res.data
        this.requestIds = new Set()
        this.userRoleList = []
        for (let i = 0; i < list.length; i++) {
          this.userRoleList.push(list[i].roleName)
          this.requestIds.add(list[i].roleId)
        }
      })
    },
    getRoleList() {
      getAllRole().then(res => {
        this.roleList = res
      })
    },
    handleRoleId(roleId) {
      if (this.requestIds.has(roleId)) {
        this.requestIds.delete(roleId)
      } else {
        this.requestIds.add(roleId)
      }
    },
    handleLockedChange(adminUserId, locked) {
      editUserInfo(qs.stringify({
        adminUserId: adminUserId,
        locked: locked ? 0 : 1
      }))
      this.tableData = []
      this.handleCurrentChange(1)
    },
    handleEditUser(adminUser) {
      this.adminUser = adminUser
      this.isEdit = true
      this.isAddOrEdit = true
    },
    deleteUser(adminUserId) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteUsers(qs.stringify({ ids: adminUserId })).then(res => {
          if (res.code === 2000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.handleCurrentChange(1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    addUser() {
      if (!this.isEdit) {
        registerUser(qs.stringify(this.adminUser))
      } else {
        editUserInfo(qs.stringify(this.adminUser))
      }
      this.handleCurrentChange(1)
      this.isAddOrEdit = false
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
      pageAdminInfoList(this.condition).then(res => {
        this.totalSize = res.data.totalSize
        this.tableData = res.data.data
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val
      this.fullscreenLoading = true
      pageAdminInfoList(this.condition).then(res => {
        console.info(res)
        this.totalSize = res.data.totalSize
        this.tableData = res.data.data
      })
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 500)
    }
  }
}
</script>

<style scoped>
#headCard {
  margin-left: 10px;
  width: 95%;
  height: 100px;
  margin-top: 10px;
}

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
  margin-right: 5px;
}

/*关闭时文字位置设置*/
.switch .el-switch__label--left {
  z-index: 1;
}

/* 调整关闭时文字的显示位子 */
.switch .el-switch__label--left span {
  margin-left: 5px;
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
/*.el-row {
  margin-top: 10px;
}*/
</style>
