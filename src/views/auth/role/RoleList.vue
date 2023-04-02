<template>
  <el-container>
    <el-header height="120px">
      <el-dialog
        title="分配资源"
        :visible.sync="isDistribute"
        width="50%"
      >
        <div v-for="(category, index) in allResourceCate">
          <el-card>
            <el-checkbox
              v-model="category.checked"
              :indeterminate="isIndeterminate(category.id)"
              @change="handleCheckAllChange(category)"
            >
              {{ category.name }}
            </el-checkbox>
            <div style="margin: 5px 0;" />

            <el-checkbox
              v-for="item in allResource"
              v-if="item.categoryId === category.id"
              :key="item.id"
              v-model="item.checked"
              @change="handleCheckChange(item)"
            >
              {{ item.name }}
            </el-checkbox>
          </el-card>
          <div style="margin: 5px 0;" />
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="isDistribute = false">取 消</el-button>
          <el-button type="primary" @click="handleSave()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加角色"
        :visible.sync="isAdd"
        width="40%"
      >
        <el-row>
          <el-col span="4">
            角色名称：
          </el-col>
          <el-col span="16">
            <el-input v-model="userRole.roleName" />
          </el-col>
        </el-row>
        <el-row>
          <el-col span="4">
            角色描述：
          </el-col>
          <el-col span="16">
            <el-input
              v-model="userRole.roleDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col span="16" push="4">
            <el-switch
              v-model="userRole.roleStatus === 1 ? true : false"
              class="switch"
              active-text="启用"
              inactive-text="禁用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click.native="userRole.roleStatus = userRole.roleStatus == 1 ? 0 : 1"
            />
          </el-col>

        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isAdd = false, isUpdate = false">取 消</el-button>
          <el-button type="primary" @click="addRoles()">确 定</el-button>
        </span>
      </el-dialog>
      <el-card class="box-card">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input v-model="condition.roleName" :gutter="10" placeholder="请输入角色名" />
          </el-col>

          <el-col :span="2">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="searchRole()"
            />

          </el-col>
          <el-col :span="8" :push="14">
            <el-button
              type="success"
              icon="el-icon-refresh-right"
              size="small"
              @click="searchRole()"
            />
            <el-button
              @click="isAdd = true, userRole = {}, isUpdate = false"
            > 添加角色
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
        style="width: 95%; margin-left: 10px"
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
          type="index"
          label="编号"
          :index="indexMethod"
          width="50"
        />
        <el-table-column
          prop="roleName"
          label="角色名"
        />
        <el-table-column
          prop="roleDesc"
          label="描述"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
        >
          <template slot-scope="scope">{{ scope.row.createTime | moment }}</template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="当前状态"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.roleStatus === 1 ? true : false"
              class="switch"
              active-text="启用"
              inactive-text="禁用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click.native="editRoleStatus(scope.row.roleId,scope.row.roleStatus)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          show-overflow-tooltip
          width="288"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="distribute(scope.row.roleId)"
            >分配资源
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="updateRole(scope.row)"
            />
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.roleId)"
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
import { addRole, deleteRoles, editRole, pageRole } from '@/api/attendance/userRole'
import { getResourceByRoleId, pageResource } from '@/api/attendance/userResource'
import { pageResourceCategory } from '@/api/attendance/userResourceCategory'

export default {
  name: 'RoleManager',
  data() {
    return {
      isDistribute: false,
      isUpdate: false,
      userRole: {
        roleDesc: '',
        roleName: '',
        roleStatus: 0,
        roleId: 0
      },
      isAdd: false,
      editCategoryDialog: false,
      categoryDialog: false,
      fullscreenLoading: false,
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 1,
        pageSize: 15
      },
      totalSize: 10,
      currentPage: 1,
      file: {},
      loading: false,
      allResource: null,
      allResourceCate: null,
      roleId: null,
      conditions: {
        pageNum: 1,
        pageSize: 99
      }
    }
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {

    getAllResourceList() {
      pageResource(qs.stringify(this.conditions)).then(response => {
        this.allResource = response.data
        for (let i = 0; i < this.allResource.length; i++) {
          this.allResource[i].checked = false
        }
        this.getResourceByRole(this.roleId)
      })
    },
    getAllResourceCateList() {
      pageResourceCategory(qs.stringify(this.conditions)).then(response => {
        this.allResourceCate = response.data
        for (let i = 0; i < this.allResourceCate.length; i++) {
          this.allResourceCate[i].checked = false
        }
        this.getAllResourceList()
      })
    },
    getResourceByCate(categoryId) {
      const cateResource = []
      if (this.allResource == null) return null
      for (let i = 0; i < this.allResource.length; i++) {
        const resource = this.allResource[i]
        if (resource.categoryId === categoryId) {
          cateResource.push(resource)
        }
      }
      return cateResource
    },
    getResourceByRole(roleId) {
      getResourceByRoleId(qs.stringify({
        roleId: roleId
      })).then(response => {
        const allocResource = response.data
        this.allResource.forEach(item => {
          item.checked = this.getResourceChecked(item.id, allocResource)
        })
        this.allResourceCate.forEach(item => {
          item.checked = this.isAllChecked(item.id)
        })
        this.$forceUpdate()
      })
    },
    getResourceChecked(resourceId, allocResource) {
      if (allocResource == null || allocResource.length === 0) return false
      for (let i = 0; i < allocResource.length; i++) {
        if (allocResource[i].id === resourceId) {
          return true
        }
      }
      return false
    },
    isIndeterminate(categoryId) {
      const cateResources = this.getResourceByCate(categoryId)
      if (cateResources == null) return false
      let checkedCount = 0
      for (let i = 0; i < cateResources.length; i++) {
        if (cateResources[i].checked === true) {
          checkedCount++
        }
      }
      return !(checkedCount === 0 || checkedCount === cateResources.length)
    },
    isAllChecked(categoryId) {
      const cateResources = this.getResourceByCate(categoryId)
      if (cateResources == null) return false
      let checkedCount = 0
      for (let i = 0; i < cateResources.length; i++) {
        if (cateResources[i].checked === true) {
          checkedCount++
        }
      }
      if (checkedCount === 0) {
        return false
      }
      return checkedCount === cateResources.length
    },
    handleSave() {
      this.$confirm('是否分配资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const checkedResourceIds = new Set()
        if (this.allResource != null && this.allResource.length > 0) {
          this.allResource.forEach(item => {
            if (item.checked) {
              checkedResourceIds.add(item.id)
            }
          })
        }
        const params = new URLSearchParams()
        params.append('roleId', this.roleId)
        params.append('resourceIds', Array.from(checkedResourceIds))
        editRole(params).then(response => {
          this.$message({
            message: '分配成功',
            type: 'success',
            duration: 1000
          })
          this.isDistribute = false
        })
      })
    },
    handleClear() {
      this.allResourceCate.forEach(item => {
        item.checked = false
      })
      this.allResource.forEach(item => {
        item.checked = false
      })
      this.$forceUpdate()
    },
    handleCheckAllChange(cate) {
      const cateResources = this.getResourceByCate(cate.id)
      for (let i = 0; i < cateResources.length; i++) {
        cateResources[i].checked = cate.checked
      }
      this.$forceUpdate()
    },
    handleCheckChange(resource) {
      this.allResourceCate.forEach(item => {
        if (item.id === resource.categoryId) {
          item.checked = this.isAllChecked(resource.categoryId)
        }
      })
      this.$forceUpdate()
    },

    distribute(roleId) {
      this.roleId = roleId
      this.getAllResourceCateList()
      this.isDistribute = true
    },
    addRoles() {
      const _this = this
      if (!this.isUpdate) {
        addRole(qs.stringify({
          roleDesc: this.userRole.roleDesc,
          roleName: this.userRole.roleName,
          roleStatus: this.userRole.roleStatus
        })).then(res => {
          if (res.code === 2000) {
            _this.isAdd = false
            _this.handleCurrentChange(1)
          }
        })
      } else {
        editRole(qs.stringify({
          roleDesc: this.userRole.roleDesc,
          roleName: this.userRole.roleName,
          roleStatus: this.userRole.roleStatus,
          roleId: this.userRole.roleId
        })).then(res => {
          if (res.code === 2000) {
            _this.isAdd = false
            _this.handleCurrentChange(1)
          }
        })
      }
    },
    deleteRole(roleId) {
      const _this = this
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteRoles(qs.stringify({ ids: roleId })).then(res => {
          if (res.code === 2000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            _this.handleCurrentChange(1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateRole(userRole) {
      this.userRole = userRole
      this.isAdd = true
      this.isUpdate = true
    },
    editRoleStatus(roleId, roleStatus) {
      const _this = this
      editRole(qs.stringify({
        roleId: roleId,
        roleStatus: roleStatus === 1 ? 0 : 1
      })).then(res => {
        console.info(res)
        if (res.code === 2000) {
          _this.handleCurrentChange(0)
        }
      })
    },
    searchRole() {
      this.handleCurrentChange(1)
    },
    indexMethod(index) {
      return (this.condition.pageNum - 1) * this.condition.pageSize + index + 1
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.condition.pageSize = val
      const _this = this
      this.fullscreenLoading = true
      pageRole(qs.stringify(this.condition)).then(res => {
        _this.totalSize = res.totalSize
        _this.tableData = res.data
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val
      const _this = this
      this.fullscreenLoading = true
      pageRole(qs.stringify(this.condition)).then(res => {
        _this.totalSize = res.totalSize
        _this.tableData = res.data
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    }
  }
}
</script>

<style scoped>
.box-card {
  margin-left: 10px;
  width: 95%;
  height: 90px;
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
