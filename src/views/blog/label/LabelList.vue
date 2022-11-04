<template>
  <el-container>
    <el-header height="120px">
      <el-card style="height: 100px;margin-top: 10px">

        <el-row :gutter="10">
          <el-col :span="4">
            <el-input :gutter="10" v-model="condition.tagName" placeholder="请输入标签名"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="searchTag"
                       size="small"

            >
            </el-button>
          </el-col>
          <el-col :span="8" :push="10">
            <el-button type="primary"
                       @click="tagDialog = true">
              添加标签信息
            </el-button>
            <el-button type="success"
                       icon="el-icon-refresh-right"
                       size="small"

                       @click="searchTag"
            ></el-button>
          </el-col>
          <el-dialog
            title="添加标签信息"
            :visible.sync="tagDialog"
            width="30%"
            size="small"
          >
            <el-input v-model="tagName"></el-input>
            <span slot="footer" class="dialog-footer">
            <el-button @click="tagDialog = false">取 消</el-button>
            <el-button type="primary" @click="addTag">确 定</el-button>
          </span>
          </el-dialog>
          <el-dialog
            title="修改标签信息"
            :visible.sync="editTagDialog"
            width="30%"
            center>
            <el-input v-model="tagName"></el-input>
            <span slot="footer" class="dialog-footer">
            <el-button @click="editTagDialog = false">取 消</el-button>
            <el-button type="primary" @click="updateTag">确 定</el-button>
          </span>
          </el-dialog>
        </el-row>
      </el-card>
    </el-header>
    <el-main>

      <el-table
          :header-cell-style="{background:'#e1e4e5',color:'#80878f','text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :border="true"
          element-loading-text="正在拼命加载中/(ㄒoㄒ)/~~"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          v-loading="fullscreenLoading"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="57">
        </el-table-column>
        <el-table-column
            prop="tagId"
            label="标签id"
            width="268">
        </el-table-column>
        <el-table-column
            prop="tagName"
            label="标签名"
            width="268">
        </el-table-column>
        <el-table-column
            label="当前状态"
            width="268"
        >
          <template slot-scope="scope">
            <el-switch
                class="switch"
                v-model="scope.row.isDeleted == 1 ? true :false"
                active-text="已删除"
                inactive-text="未删除"
                active-color="#13ce66"
                @click.native="editDelete(scope.row.tagId,scope.row.isDeleted)"
                inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="操作"
            show-overflow-tooltip
            >
          <template slot-scope="scope">
            <el-button type="primary"
                       size="small"
                       icon="el-icon-edit"
                       @click="editTag(scope.row.tagId)"
            >
            </el-button>
            <el-button type="danger"
                       size="small"
                       @click="clearTag(scope.row.tagId)"
                       icon="el-icon-delete">
            </el-button>
          </template>

        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="condition.pageNum"
          :page-size="condition.pageSize"
          :page-sizes="[5, 15, 25, 35]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="totalSize">
      </el-pagination>

    </el-main>

  </el-container>

</template>

<script>
import qs from "qs";
import {addTag, clearTag, getTag, pageBlogTag, updateTagStatus} from "../../../api/blogmanager/blogTag";

export default {
  name: "LabelList",
  data() {
    return {
      tagName: '',
      tagId: '',
      tagDialog: false,
      editTagDialog: false,
      fullscreenLoading: false,
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 1,
        pageSize: 5,
        tagName: ''
      },
      totalSize: 10,
      currentPage: 1,
    }
  },
  created() {
    this.handleCurrentChange(1);
  },
  methods: {
    updateTag(){
      const _this = this;
      updateTagStatus(qs.stringify({
        tagId: this.tagId,
        tagName: this.tagName
      })).then(res => {
        if (res.code === 2000){
          _this.editTagDialog = false;
          this.$message({
            type: 'success',
            message: '修改标签成功!'
          });
          _this.handleCurrentChange(1);
        }
      })
    },
    editTag(id){
      this.tagId = id;
      const _this = this;
      getTag(qs.stringify({
        tagId: id
      })).then(res => {
        if (res.code === 2000){
          _this.tagName = res.data.tagName;
          this.editTagDialog = true;
        }
      })
    },
    addTag(){
      const _this = this;
      addTag(qs.stringify({
        tagName: this.tagName
      })).then(res => {
        if (res.code == 2000){
          _this.tagName = "";
          _this.tagDialog = false;
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          _this.handleCurrentChange(1);
        }
      })
    },
    clearTag(id) {
      const _this = this;
      this.$confirm('删除标签时,会将跟它绑定的文章标签属性全部清空,然后重置为默认标签!, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _this.fullscreenLoading = true;
        clearTag(qs.stringify({
          tagId: id
        })).then(res => {
          _this.handleCurrentChange(1);
          this.$message({
            type: 'success',
            message: '清除数据库成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清除数据库'
        });
      });
    },
    searchTag() {
      this.handleCurrentChange(1);
    },
    editDelete(id, isDeleted) {
      const _this = this;
      isDeleted = isDeleted === 0 ? 1 : 0;
      updateTagStatus(qs.stringify({
        tagId: id,
        isDeleted: isDeleted
      })).then(res => {
        if (res.code === 2000) {
          _this.handleCurrentChange(1);
        }
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.condition.pageSize = val;
      const _this = this;
      this.fullscreenLoading = true;
      pageBlogTag(qs.stringify(this.condition)).then(res => {
        _this.totalSize = res.totalSize;
        _this.tableData = res.data;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 500);
      })
    },
    handleCurrentChange(val) {
      this.condition.pageNum = val;
      const _this = this;
      this.fullscreenLoading = true;
      pageBlogTag(qs.stringify(this.condition)).then(res => {
        _this.totalSize = res.totalSize;
        _this.tableData = res.data;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 500);
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
