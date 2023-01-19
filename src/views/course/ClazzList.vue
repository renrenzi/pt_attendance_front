<template>
  <el-container>
    <el-header height="110">
      <el-card class="idCard">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input
              v-model="condition.clazz.name"
              placeholder="输入专业名称"
            />
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="handleCurrentChange(1)"
            />

          </el-col>
          <el-col :span="4" :push="14">
            <el-button
              type="success"
              icon="el-icon-refresh-right"
              size="small"
              @click="handleCurrentChange(1)"
            />
            <el-button
              type="primary"
              size="small"
              @click="isVisible = true, clazz = {}"
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
          label="专业名称"
          width="200"
        />
        <el-table-column
          prop="info"
          label="专业详情"
        />
        <el-table-column
          prop="name"
          label="启用状态"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state === 1"
              class="switch"
              active-text="已启用"
              inactive-text="未启用"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click.native="scope.row.state = scope.row.state === 1 ? 0 : 1, editClazz(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          width="250"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="isVisible = true, clazz = scope.row"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteClazz(scope.row.id)"
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
      title="专业管理"
      :visible.sync="isVisible"
      width="25%"
    >
      <el-row>
        <el-col :span="4">
          专业名称：
        </el-col>
        <el-col :span="16">
          <el-input v-model="clazz.name" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          专业详情：
        </el-col>
        <el-col :span="16">
          <el-input v-model="clazz.info" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          启用状态：
        </el-col>
        <el-col :span="16">
          <el-switch
            v-model="clazz.state === 1"
            class="switch"
            active-text="已启用"
            inactive-text="未启用"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="editClazz(clazz)">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { batchDeleteClazz, editClazzInfo, pageClazzList } from '@/api/attendance/clazz'
import { assertNormalMessage, assertSuccessMessage } from '@/utils/message'

export default {
  name: 'ClazzList',
  data() {
    return {
      loading: true,
      tableData: [],
      condition: {
        pageNum: 0,
        pageSize: 15,
        clazz: {}
      },
      totalSize: 10,
      multipleSelection: [],
      isVisible: false,
      clazz: {}
    }
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    deleteClazz(id) {
      const clazzIds = []
      clazzIds.push(id)
      this.$confirm('此操作将永久删除该专业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.loading = true
        batchDeleteClazz(clazzIds).then(res => {
          this.handleCurrentChange(1)
          assertSuccessMessage('删除成功!')
        })
      }).catch(() => {
        assertNormalMessage('已取消删除')
      })
    },
    editClazz(clazz) {
      editClazzInfo(clazz).then(res => {
        this.handleCurrentChange(1)
        this.isVisible = false
      })
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
      pageClazzList(this.condition).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.clazzList
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val
      pageClazzList(this.condition).then(res => {
        this.totalSize = res.totalSize
        this.tableData = res.clazzList
        this.loading = false
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
.el-row{
  margin-top: 10px;
}
</style>
