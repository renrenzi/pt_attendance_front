<template>
  <el-container>
    <el-header height="100px">
      <el-dialog
        title="添加资源"
        :visible.sync="isAdd"
        width="35%"
      >
        <el-row type="flex">
          <el-col span="4">
            分类名称：
          </el-col>
          <el-col span="16">
            <el-input v-model="requestParams.name" />
          </el-col>
        </el-row>
        <div style="margin: 5px 0;" />
        <el-row type="flex">
          <el-col span="4">
            排序：
          </el-col>
          <el-col span="16">
            <el-input v-model="requestParams.sort" />
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isAdd = false">取 消</el-button>
          <el-button type="primary" @click="saveOrEditResource()">确 定</el-button>
        </span>
      </el-dialog>
      <el-card class="box-card2">
        <el-row type="flex">
          <el-col :span="2">
            <icon class="el-icon-share">
              <span>数据管理</span>
            </icon>
          </el-col>
          <el-col :span="2" push="20">
            <el-button
              type="primary"
              size="small"
              @click="isAdd = true, isEdit = false, requestParams = {}"
            >
              添加
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
        style="width: 100%"
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
          prop="name"
          label="分类名称"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="251"
        >
          <template slot-scope="scope">{{ scope.row.createTime | moment }}</template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
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
              @click="gotoEdit(scope.row)"
            />
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="remove(scope.row.id)"
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
import qs from 'qs'
import {
  addResourceCategory,
  deleteResourceCategory, editResourceCategory,
  pageResourceCategory
} from '../../../api/blogmanager/userResourceCategory'

export default {
  name: 'ResourceCategory',
  data() {
    return {
      resourceCategoryList: [],
      requestParams: {},
      resource: {},
      isAdd: false,
      isEdit: false,
      fullscreenLoading: false,
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 1,
        pageSize: 5
      },
      totalSize: 5
    }
  },
  computed: {},
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    remove(id) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteResourceCategory(qs.stringify({ ids: id })).then(res => {
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
    gotoEdit(requestParams) {
      this.requestParams = requestParams
      this.isAdd = true
      this.isEdit = true
    },
    saveOrEditResource() {
      if (this.isEdit) {
        editResourceCategory(qs.stringify({
          id: this.requestParams.id,
          name: this.requestParams.name,
          sort: this.requestParams.sort
        })).then(res => {})
      } else {
        addResourceCategory(qs.stringify(this.requestParams)).then(res => {})
      }
      this.isAdd = false
      this.handleCurrentChange(1)
    },
    indexMethod(index) {
      return (this.condition.pageNum - 1) * this.condition.pageSize + index + 1
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.tableData = []
      this.condition.pageSize = val
      this.fullscreenLoading = true
      pageResourceCategory(qs.stringify(this.condition)).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.data
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    },
    handleCurrentChange(val) {
      this.tableData = []
      this.condition.pageNum = val
      this.fullscreenLoading = true
      pageResourceCategory(qs.stringify(this.condition)).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.data
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      })
    }
  }
}
</script>

<style scoped>
.box-card2 {
  margin-top: 10px;
  margin-left: 10px;
  width: 95%;
  height: 75px;
}

.box-card {
  margin-left: 10px;
  width: 90%;
  height: 130px;
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
</style>
