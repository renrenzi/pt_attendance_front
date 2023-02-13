<template>
  <el-container style="background: rgb(238, 241, 246)">
    <el-header style="background: rgb(255,255,255)" height="80px">
      <el-row style="background: rgb(238, 241, 246);height: 40px;margin-top: 20px;margin-left: 10px" type="flex">
        <el-col span="4" style="margin-top: 10px;margin-left: 10px">
          欢迎管理员：
          <span style="color: red">{{ this.$store.state.adminUser.nickName }}</span>
        </el-col>
        <el-col span="4" style="margin-top: 5px;margin-left: -30px">
          <el-divider direction="vertical" />
          当前时间:<span class="text-24 text-white" v-html="formateTimeStamp(date)" />
        </el-col>

      </el-row>
    </el-header>
    <br>
    <div class="address-layout">
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="6" :push="1">
          <div class="out-border">
            <div class="layout-title">文章数</div>
            <div class="color-main address-content">
              {{ count.info }}
            </div>
          </div>
        </el-col>
        <el-col :span="6" :push="2">
          <div class="out-border">
            <div class="layout-title">分类数</div>
            <div class="color-main address-content">
              {{ count.category }}
            </div>
          </div>
        </el-col>
        <el-col :span="6" :push="3">
          <div class="out-border">
            <div class="layout-title">标签数</div>
            <div class="color-main address-content">
              {{ count.tag }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="address-layout">
      <el-row :gutter="20" style="margin-top: 10px; margin-bottom: 10px">
        <el-col :span="6" :push="1">
          <div class="out-border">
            <div class="layout-title">评论数</div>
            <div class="color-main address-content">
              {{ count.comment }}
            </div>
          </div>
        </el-col>
        <el-col :span="6" :push="2">
          <div class="out-border">
            <div class="layout-title">友情链接</div>
            <div class="color-main address-content">
              {{ count.link }}
            </div>
          </div>
        </el-col>
        <el-col :span="6" :push="3">
          <div class="out-border">
            <div class="layout-title">热门文章</div>
            <div class="color-main address-content">
              999
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <br>
    <el-footer style="background: rgb(255,255,255);height: 500px">
      <el-row>
        <span>系统信息&开发团队</span>
        <el-divider />
      </el-row>
      <el-row style="margin-left: 10px">
        <el-table
          ref="multipleTable"
          :header-cell-style="{background:'#e1e4e5',color:'#80878f'}"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 95%;margin-left: 10px"
          :border="true"
        >
          <el-table-column
            prop="configName"
            label="参数名"
            width="322"
          />
          <el-table-column
            prop="configValue"
            label="参数值"
          />
        </el-table>
      </el-row>

    </el-footer>
  </el-container>
</template>

<script>
import { getConfigList } from '@/api/attendance/config'
import { getCount } from '@/api/attendance/admin'

export default {
  name: 'Home',
  data() {
    return {
      tableData: [],
      date: new Date().getTime(),
      count: {
        info: '',
        category: '',
        comment: '',
        tag: '',
        link: ''
      },
      nowTime: ''
    }
  },
  created() {
    this.loadTime()
    this.getConfigList()
    this.getCounts()
  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {

    loadTime() {
      var _this = this
      setInterval(() => {
        _this.date += 1000
      }, 1000)
    },
    // 转换时间戳
    formateTimeStamp(time) {
      var date = new Date(time)
      var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minute =
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second =
          date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // return year + "年" + month + "月" + day + "日" + hour + ":" + minute + ":" + second;
      return (
        '<span style="font-size: 22px; text-shadow: 0px 2px 7px rgba(51, 51, 51, 0.6);">' +
          hour +
          ':' +
          minute + ':' + second +
          '</span><br/>'

      )
    },

    getCounts() {
      const _this = this
      getCount().then(res => {
        if (res.code === 2000) {
          _this.count = res.data
        }
      })
    },
    getConfigList() {
      getConfigList().then(res => {
        if (res.code === 2000) {
          this.tableData = res.data
        }
      })
    }
  }
}
</script>

<style scoped>
.app-container {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
}

.address-layout {
}

.total-layout {
  margin-top: 20px;
}

.total-frame {
  border: 1px solid #DCDFE6;
  padding: 20px;
  height: 100px;
}

.total-icon {
  color: #409EFF;
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #F2F6FC;
  font-weight: bold;
}

.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  border-bottom: 1px solid #EBEEF5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  border: 1px solid #DCDFE6;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}

.address-content {
  padding: 20px;
  font-size: 18px
}

.app-container {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
}

.address-layout {
  background: rgb(255, 255, 255);
}

.total-layout {
  margin-top: 20px;
}

.total-frame {
  border: 1px solid #DCDFE6;
  padding: 20px;
  height: 100px;
}

.total-icon {
  color: #409EFF;
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #F2F6FC;
  font-weight: bold;
}

.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  border-bottom: 1px solid #EBEEF5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  border: 1px solid #DCDFE6;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}

.address-content {
  padding: 20px;
  font-size: 18px;

}
</style>
