<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="$store.state.imgUrl" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>

        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="userInfo = true">
            <span style="display:block;">个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>

      <el-dialog
        title="个人信息"
        :visible.sync="userInfo"
        width="35%"
        center
      >
        <el-row :gutter="10">
          <el-col :span="4">
            头像:
          </el-col>
          <el-col :span="4">
            <el-avatar
              v-if="squareUrl"
              shape="square"
              :size="80"
              :src="squareUrl"
              fit="fill"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-col>

          <el-col :span="4" :offset="3">
            <el-upload
              action="#"
              class="avatar-uploader"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="uploadImg"
              :before-upload="beforeAvatarUpload"
            >
              <el-button type="primary">预览</el-button>
            </el-upload>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" :loading="loading" @click="uploadAuthorImg">

              <span v-if="!loading">开始上传</span>
              <span v-else>上 传 中...</span>

            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            登录名:
          </el-col>
          <el-col :span="20">
            <el-input v-model="loginForm.loginUserName" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            昵称:
          </el-col>
          <el-col :span="20">
            <el-input v-model="loginForm.nickName" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            旧密码:
          </el-col>
          <el-col :span="20">
            <el-input v-model="loginForm.oldPassword" type="password" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            新密码:
          </el-col>
          <el-col :span="20">
            <el-input v-model="loginForm.loginPassword" type="password" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            确认密码:
          </el-col>
          <el-col :span="20">
            <el-input v-model="loginForm.confirmPassword" type="password" />
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="userInfo = false">取 消</el-button>
          <el-button type="primary" @click="editAdminInfo">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
 import { removeToken } from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      loading: true,
      adminUserId: this.$store.state.adminUser.adminUserId,
      userInfo: false,
      loginForm: {
        loginUserName: this.$store.state.adminUser.loginUserName,
        nickName: this.$store.state.adminUser.nickName,
        oldPassword: '',
        loginPassword: '',
        confirmPassword: ''
      },
      file: {},
      squareUrl: this.$store.state.imgUrl
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    editAdminInfo() {
      const _this = this
      editUserInfo(qs.stringify({
        adminUserId: this.adminUserId,
        loginUserName: this.loginForm.loginUserName,
        nickName: this.loginForm.nickName,
        loginPassword: this.loginForm.loginPassword
      })).then(res => {
        if (res.code === 2000) {
          _this.userInfo = false
          _this.loginForm.oldPassword = ''
          _this.loginForm.loginPassword = ''
          _this.loginForm.confirmPasswor = ''
          this.$message.success('修改个人信息成功 ==> 请重新登录')
        }
      })
    },
    uploadImg(file) {
      this.file = file
      this.squareUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      this.squareUrl = URL.createObjectURL(file.raw)
      return isJPG && isLt2M
    },
    // 上传用户头像
    uploadAuthorImg() {
      const _this = this
      this.loading = true
      const formdata = new FormData()
      formdata.append('userImage', this.file.raw)
      formdata.append('adminUserId', this.adminUserId)
      uploadAuthorImg(formdata).then(res => {
        if (res.code === 2000) {
          _this.squareUrl = res.data
          this.$message.success('上传头像成功')
        } else {
          this.$message.error('上传头像失败')
        }
        _this.loading = false
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      removeToken()
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
