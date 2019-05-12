<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">金丰公社物流管理系统</div>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="loginForm.password">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item prop="captcha">
          <el-row>
            <el-col :span="15">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                @keyup.enter.native="submitForm"
              >
                <el-button slot="prepend" icon="el-icon-lx-pic"/>
              </el-input>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="8">
              <img
                :src="image_src"
                ref="image"
                style="height: 30px;width: 100%;"
                @click="getVerifyCode"
                title="看不清，点击换一张"
              >
            </el-col>
          </el-row>
          <p style="color:red">{{errorMsg}}</p>
        </el-form-item>

        <div class="login-btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
        </div>
        <p class="login-tips">Tips : 欢迎使用</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      image_src: "http://localhost:8090/verifyCode",
      errorMsg: "",
      loginForm: {
        username: "administrator",
        password: "123456",
        captcha: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  methods: {
    getVerifyCode() {
      this.image_src =
        "http://localhost:8090/verifyCode?" + Math.floor(Math.random() * 100);
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("LoginByUserName", this.loginForm)
            .then(response => {
              this.errorMsg = response.data.errorMsg;
              if (this.errorMsg != null) {
                this.getVerifyCode();
              }
              this.$router.push({ path: this.redirect || "/" });
            });

          /*
          this.$axios
            .post("/login", {
              username: this.loginForm.username,
              password: this.loginForm.password
            })
            .then(data => {
              if (data.data.status != 200) {
                this.$message.error("错了哦，这是一条错误消息");
              } else {
                //设置Vuex登录标志为true，默认userLogin为false
                this.$store.dispatch("setUserLogin", true);
                //Vuex在用户刷新的时候userLogin会回到默认值false，所以我们需要用到HTML5储存
                //我们设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
                localStorage.setItem("user", this.loginForm.username);
                //iViewUi的友好提示
                this.$message.success(data.data.message);
                //登录成功后跳转到指定页面
                this.$router.push("/");

                //  localStorage.setItem('ms_username',this.loginForm.username);
                //  this.$router.push('/');
              }
            });
*/
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>