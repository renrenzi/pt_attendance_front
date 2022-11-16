<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">博客后台管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click="login"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div v-if="register" style="float: right;">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2021-2022 RenRenZi All Rights Reserved.</span>
      <el-link href="https://beian.miit.gov.cn/#/Integrated/recordQuery">闽ICP备2022003846号</el-link>
      Powered by <el-link href="#" target="_blank">任人子</el-link>
    </div>
  </div>

</template>

<script>
import { login } from '../../api/blogmanager/admin'
import qs from 'qs'
import { setToken, setUser } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: 'test',
        password: '123456',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ]
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: false,
      redirect: undefined
    }
  },
  created() {

  },
  methods: {
    login() {
      this.loading = true
      login(qs.stringify({
        loginUserName: this.loginForm.username,
        loginPassword: this.loginForm.password
      })).then(res => {
        if (res.code === 2000) {
          this.$store.state.adminUser = res.data.adminUser
          this.$store.state.imgUrl = res.data.imgUrl
          setToken(res.data.token)
          this.$router.push({ path: '/home' })
        } else {
          this.$message({
            type: 'error',
            message: '账户名或密码错误'
          })
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 625px;
  width: 100%;
  background-image: url("https://renrenzi.top/imgs/group1/M00/00/00/rB8AYWI9vm-AD_vUAAFoAcumkJ4421.png");
  background-size: cover;
  z-index: 100;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

}

img {
  cursor: pointer;
  vertical-align: middle;
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}
</style>

