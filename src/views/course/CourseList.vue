<template>
  <el-container>
    <el-header height="110">
      <el-card class="idCard">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input
              v-model="condition.blogTitle"
              placeholder="输入文章标题"
            />
          </el-col>
          <el-col :span="4">
            <el-select v-model="condition.blogCategoryId" placeholder="请选择文章分类">
              <el-option
                v-model="categoryEmpty"
                label="----- 不选 -----"
              />
              <el-option
                v-for="item in categoryList"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"

              :loading="loding"
              @click="searchPage"
            />

          </el-col>
          <el-col :span="4" :push="8">
            <el-button
              type="success"
              icon="el-icon-refresh-right"
              size="small"

              @click="refreshPage"
            />
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
        >
        </el-table-column>
        <el-table-column
          prop="teacherId"
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
        >
        </el-table-column>
        <el-table-column
          prop="info"
          label="课程详情"
        />
        <el-table-column
          label="文章状态"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.blogStatus === 1 ? true :false"
              v-loading.fullscreen.lock="fullscreenLoading"
              class="switch"
              active-text="发布"
              inactive-text="草稿"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click.native="editBlogStatus(scope.row.blogId,scope.row.blogStatus)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="评论"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enableComment == 1 ? true :false"
              class="switch"
              active-text="允许评论"
              inactive-text="禁止评论"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @click.native="editEnableComment(scope.row.blogId,scope.row.enableComment)"
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
              @click="editBlog(scope.row.blogId)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.isDeleted === 0"
              type="danger"
              size="small"
              @click="deleteBlog(scope.row.blogId)"
            >
              删除
            </el-button>
            <el-button
              v-if="scope.row.isDeleted === 1"
              type="warning"
              size="small"
              @click="restoreBlog(scope.row.blogId)"
            >
              还原
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="clearBlog(scope.row.blogId)"
            >
              清除
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
  </el-container>
</template>

<script>
import { clearBlog, deleteBlog, restoreBlog, updateBlogStatus } from '@/api/blogmanager/blog'
import { getBlogCategoryList } from '@/api/blogmanager/blogCategory'
import qs from 'qs'
import { pageCourseList } from '@/api/blogmanager/course'

export default {
  name: 'CourseList',
  data() {
    return {
      fullscreenLoading: false,
      loading: true,
      tableData: [],
      condition: {
        pageNum: 0,
        pageSize: 5,
        blogTitle: null,
        blogCategoryId: null
      },
      totalSize: 10,
      multipleSelection: [],
      value: '',
      loding: false,
      blogCategoryId: '',
      categoryList: [],
      categoryEmpty: null
    }
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    restoreBlog(blogId) {
      const _this = this
      this.$confirm('此操作将还原该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _this.fullscreenLoading = true
        restoreBlog(qs.stringify({
          blogId: blogId
        })).then(res => {
          if (res.code === 2000) {
            _this.handleCurrentChange(1)
            setTimeout(() => {
              this.fullscreenLoading = false
              this.$message({
                type: 'success',
                message: '还原成功!'
              })
            }, 500)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消还原'
        })
      })
    },
    editEnableComment(id, enableComment) {
      enableComment = enableComment === 0 ? 1 : 0
      const _this = this
      this.fullscreenLoading = true
      updateBlogStatus(qs.stringify({
        blogId: id,
        enableComment: enableComment
      })).then(res => {
        if (res.code === 2000) {
          _this.handleCurrentChange(1)
          setTimeout(() => {
            this.fullscreenLoading = false
            this.$message({
              message: '修改成功',
              center: true,
              type: 'success'
            })
          }, 500)
        }
      })
    },
    editBlogStatus(id, blogStatus) {
      this.fullscreenLoading = true
      blogStatus = blogStatus === 0 ? 1 : 0
      const _this = this
      updateBlogStatus(qs.stringify({
        blogId: id, blogStatus: blogStatus
      })).then(res => {
        if (res.code === 2000) {
          _this.handleCurrentChange(1)
          setTimeout(() => {
            this.fullscreenLoading = false
            this.$message({
              message: '修改成功',
              center: true,
              type: 'success'
            })
          }, 500)
        }
      })
    },
    editBlog(blogId) {
      this.$router.push(
        {
          path: '/editBlog',
          query: {
            blogId: blogId
          }
        })
    },
    clearBlog(blogId) {
      const _this = this
      this.$confirm('此操作将请清除数据库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _this.fullscreenLoading = true
        clearBlog(qs.stringify({
          blogId: blogId
        })).then(res => {
          if (res.code === 2000) {
            _this.handleCurrentChange(1)
            setTimeout(() => {
              this.fullscreenLoading = false
              this.$message({
                type: 'success',
                message: '清除数据库成功!'
              })
            }, 500)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清除数据库'
        })
      })
    },
    deleteBlog(blogId) {
      const _this = this
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _this.fullscreenLoading = true
        deleteBlog(qs.stringify({
          blogId: blogId
        })).then(res => {
          if (res.code === 2000) {
            _this.handleCurrentChange(1)
            setTimeout(() => {
              this.fullscreenLoading = false
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }, 500)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    refreshPage() {
      this.loading = true
      this.condition.blogTitle = null
      this.condition.blogCategoryId = null
      this.handleCurrentChange(1)
    },
    searchPage() {
      this.loding = true
      this.handleCurrentChange(1)
      this.loding = false
    },
    getBlogCategory() {
      getBlogCategoryList().then(res => {
        this.categoryList = res
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
      const _this = this
      this.condition.pageSize = val
      pageCourseList(this.condition).then(res => {
        _this.loading = false
        this.totalSize = res.data.totalSize
        this.tableData = res.data.courseList
      })
    },
    handleCurrentChange(val) {
      const _this = this
      this.condition.pageNum = val
      pageCourseList(this.condition).then(res => {
        this.totalSize = res.data.totalSize
        this.tableData = res.data.courseList
        _this.loading = false
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
</style>
