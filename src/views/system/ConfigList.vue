<template>
  <el-container>
    <el-header height="100px">
      <el-card  class="box-card">
        <el-button type="primary"
                   @click="configDialog = true">
          添加系统信息
        </el-button>
      </el-card>

      <el-dialog
          title="添加系统信息"
          :visible.sync="configDialog"
          width="30%"
          center>
        <el-row>
          <el-col :span="4">
            字段名:
          </el-col>
          <el-col :span="20">
            <el-input v-model="configField"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            配置名:
          </el-col>
          <el-col :span="20">
            <el-input v-model="configName"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            配置值:
          </el-col>
          <el-col :span="20">
            <el-input v-model="configValue"></el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="configDialog = false">取 消</el-button>
            <el-button type="primary" @click="addBlogConfig">确 定</el-button>
          </span>
      </el-dialog>
      <el-dialog
          title="修改系统信息"
          :visible.sync="editConfigDialog"
          width="30%"
          center>
        <el-row>
          <el-col :span="4">
            字段名:
          </el-col>
          <el-col :span="20">
            <el-input v-model="configField"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            配置名:
          </el-col>
          <el-col :span="20">
            <el-input v-model="configName"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            配置值:
          </el-col>
          <el-col :span="20">
            <el-input v-model="configValue"></el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editConfigDialog = false">取 消</el-button>
            <el-button type="primary" @click="editBlogConfig">确 定</el-button>
          </span>
      </el-dialog>
    </el-header>
    <el-main id="main">
      <el-table
          :header-cell-style="{background:'#e1e4e5',color:'#80878f'}"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 95%; margin-left: 10px"
          v-loading="tableLoading"
          :border="true"
          @selection-change="handleSelectionChange">
        <el-table-column
            prop="configName"
            label="参数名"
            width="322">
        </el-table-column>
        <el-table-column
            prop="configValue"
            label="参数值"
            width="640">
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
                       @click="editSystemInfo(scope.row.configField,scope.row.configName,scope.row.configValue)"
            >
            </el-button>
            <el-button type="danger"
                       @click="deleteConfig(scope.row.configField)"
                       icon="el-icon-delete" size="small">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import {addConfig, deleteConfig, getConfigList, updateConfig} from "../../api/blogmanager/blogConfig";
import qs from "qs";

export default {
  name: "SystemMessage",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      configDialog: false,
      tableLoading: false,
      editConfigDialog: false,
      configField: '',
      configName: '',
      configValue: ''
    }
  },
  created() {
    this.getConfigList();
  },
  methods: {
    editBlogConfig(){
      const _this = this;
      updateConfig(qs.stringify({
        configField: this.configField,
        configName: this.configName,
        configValue: this.configValue
      })).then(res => {
        if (res.code === 2000){
          _this.editConfigDialog = false;
          this.$message({
            type: "success",
            message: "修改系统配置成功"
          })
          _this.getConfigList();
        }
      })
    },
    editSystemInfo(configField,configName,configValue){
      this.configField = configField;
      this.configName= configName;
      this.configValue= configValue;
      this.editConfigDialog = true;
    },
    deleteConfig(configField) {
      const _this = this;
      this.$confirm('确认删除系统配置吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        _this.configDialog = false;
        deleteConfig(qs.stringify({
          configField: configField
        })).then(res => {
          if (res.code == 2000) {
            _this.getConfigList();
            this.$message({
              type: "success",
              message: "成功删除系统配置"
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消清除系统配置'
        });
      });
    },
    addBlogConfig() {
      const _this = this;
      addConfig(qs.stringify({
        configField: this.configField,
        configName: this.configName,
        configValue: this.configValue
      })).then(res => {
        if (res.code == 2000) {
          _this.configDialog = false;
          this.getConfigList();
        }
      })
    },
    getConfigList() {
      getConfigList().then(res => {
        this.tableLoading = true;
        const _this = this;
        if (res.code === 2000) {
          this.tableData = res.data;
          setTimeout(() => {
            _this.tableLoading = false;
          }, 500)
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}
</script>

<style scoped>
.box-card{
  height: 80px;
  margin-top: 10px;
  width: 95%;
  margin-left: 10px;
}
</style>
