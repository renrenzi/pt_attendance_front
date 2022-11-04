<template>
  <el-container>
    <el-header height="100px">
      <el-card class="box-card">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-select v-model="condition.linkType" placeholder="请选择链接分类">
              <el-option
                  v-for="item in linkTypes"
                  :key="item.linkType"
                  :label="item.linkName"
                  :value="item.linkType">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="primary"
                       @click="searchLink"
                       icon="el-icon-search"
                       circle>

            </el-button>
          </el-col>
          <el-col :span="8" :push="10">
            <el-button type="primary"
                       @click="linkDialog = true">
              添加链接信息
            </el-button>
            <el-button type="success"
                       icon="el-icon-refresh-right"
                       circle
                       @click="reloadLinks"
            ></el-button>
          </el-col>
          <el-dialog
              title="添加链接信息"
              :visible.sync="linkDialog"
              width="30%"
              center>
            <el-row>
              链接分类
              <el-select v-model="link.linkType" placeholder="请选择链接分类">
                <el-option
                    v-for="item in linkTypes"
                    :key="item.linkType"
                    :label="item.linkName"
                    :value="item.linkType">
                </el-option>
              </el-select>
            </el-row>
            <el-row>
              链接名：
              <el-input v-model="link.linkName"></el-input>
            </el-row>
            <el-row>
              链接url：
              <el-input v-model="link.linkUrl"></el-input>
            </el-row>
            <el-row>
              链接描述：
              <el-input v-model="link.linkDescription"></el-input>
            </el-row>
            <el-row>
              链接排序值：
              <el-input v-model="link.linkRank"></el-input>
            </el-row>
            <span slot="footer" class="dialog-footer">
            <el-button @click="linkDialog = false">取 消</el-button>
            <el-button type="primary" @click="addLink">确 定</el-button>
          </span>
          </el-dialog>
        </el-row>
      </el-card>
    </el-header>
    <el-main>
      <el-table
          v-loading="linkLoading"
          :header-cell-style="{background:'#e1e4e5',color:'#80878f','text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 95%;"
          :border="true"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="linkName"
            label="链接名"
            >
        </el-table-column>
        <el-table-column
            prop="linkUrl"
            label="链接url"
            width="250">
        </el-table-column>
        <el-table-column
            prop="linkDescription"
            label="链接描述"
        >
        </el-table-column>
        <el-table-column
            prop="linkRank"
            label="链接Rank"
        >
        </el-table-column>
        <el-table-column
            prop="address"
            label="当前状态"
        >
          <template slot-scope="scope">
            <el-switch
                class="switch"
                v-model="scope.row.isDeleted == 1 ? true :false"
                active-text="已删除"
                inactive-text="未删除"
                active-color="#13ce66"
                @click.native="editDelete(scope.row.linkId,scope.row.isDeleted)"
                inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="操作"
            show-overflow-tooltip
            width="200">
          <template slot-scope="scope">
            <el-button type="success"
                       @click="editLink(scope.row.linkId)"
                       size="small"
            >
              编辑
            </el-button>
            <el-button type="danger"
                       size="small"
                       @click="clearLink(scope.row.linkId)"
            >
              清除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="condition.pageNum"
          :page-sizes="[5, 15, 25, 35]"
          :page-size="condition.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize">
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
import {
  clearLink,
  editLink,
  getLink,
  getLinkTypeList,
  isDel,
  pageLinkList
} from "../../api/blogmanager/blogLink";
import qs from "qs";

export default {
  name: "SystemList",
  data() {
    return {
      linkDialog: false,
      linkLoading: false,
      linkTypes: [],
      tableData: [],
      multipleSelection: [],
      condition: {
        pageNum: 0,
        pageSize: 5,
        linkType: ''
      },
      totalSize: 10,
      link: {
        linkName: '',
        linkUrl: '',
        linkDescription: '',
        linkRank: '',
        linkType: '',
        linkId: ''
      }
    }
  },
  created() {
    this.getLinkTypeList();
    this.handleCurrentChange(1);
  },
  methods: {
    editLink(id) {
      this.linkDialog = true;
      const _this = this;
      getLink(qs.stringify({
        linkId: id
      })).then(res => {
        if (res.code == 2000){
          _this.link = res.data;
          _this.link.linkType = res.data.linkType;
        }
      })
    },
    clearLink(id) {
      const _this = this;
      this.$confirm('确定删除该链接! 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        clearLink(qs.stringify({
          linkId: id
        })).then(res => {
          if (res.code == 2000) {
            _this.handleCurrentChange(1);
            this.$message({
              type: 'success',
              message: '清除数据库成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清除数据库'
        });
      });
    },
    editDelete(id, isDeleted) {
      isDeleted = isDeleted == 1 ? 0 : 1;
      const _this = this;
      isDel(qs.stringify({
        linkId: id,
        isDeleted: isDeleted
      })).then(res => {
        if (res.code == 2000) {
          _this.handleCurrentChange(1);
        }
      })
    },
    addLink() {
      const _this = this;
      editLink(qs.stringify({
        linkName: this.link.linkName,
        linkUrl: this.link.linkUrl,
        linkDescription: this.link.linkDescription,
        linkRank: this.link.linkRank,
        linkType: this.link.linkType,
        linkId: this.link.linkId
      })).then(res => {
        if (res.code == 2000) {
          _this.linkDialog = false;
          this.$message({
            type: 'success',
            message: '添加链接成功!'
          });
          _this.handleCurrentChange(1);
        }
      })
    },
    reloadLinks() {
      this.condition.linkType = '';
      this.handleCurrentChange(1);
    },
    searchLink() {
      this.handleCurrentChange(1);
    },
    getLinkTypeList() {
      const _this = this;
      getLinkTypeList().then(res => {
        if (res.code == 2000) {
          _this.linkTypes = res.data;
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
      this.linkLoading = true;
      this.condition.pageSize = val;
      const _this = this;
      pageLinkList(qs.stringify(this.condition)).then(res => {
        _this.totalSize = res.totalSize;
        _this.tableData = res.data;
        setTimeout(() => {
          this.linkLoading = false;
        }, 500);
      })
    },
    handleCurrentChange(val) {
      this.tableData = [];
      this.linkLoading = true;
      this.condition.pageNum = val;
      const _this = this;
      pageLinkList(qs.stringify(this.condition)).then(res => {
        _this.totalSize = res.totalSize;
        _this.tableData = res.data;
        setTimeout(() => {
          this.linkLoading = false;
        }, 500);
      })
    }
  }
}
</script>

<style scoped>
.box-card{
  height: 100px;
  margin-top: 10px;
  width: 95%;
}
</style>
