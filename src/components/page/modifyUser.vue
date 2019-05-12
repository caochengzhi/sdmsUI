<template>
  <div class="container">
    <div>
      <el-form ref="form" :model="form" label-width="auto">
        <!-- <h4 style="color:#606266">基本信息</h4>
        <hr align="center" size="1">-->
        <br>
        <el-form-item>
          <el-row :gutter="10">
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="登录名：">
                <el-input
                  v-model="form.loginName"
                  :disabled="typeof this.$route.query.row != 'undefined'"
                  placeholder="登录名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="6" :md="10" :lg="2" :xl="11">&nbsp;</el-col>
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="用户名：">
                <el-input v-model="form.userName" placeholder="用户名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="密码：">
                <el-input v-model="form.loginPassword" :disabled="true" show-password></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="6" :md="10" :lg="2" :xl="11">&nbsp;</el-col>
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="性别：">
                <el-radio v-model="form.sex" label="男"></el-radio>
                <el-radio v-model="form.sex" label="女"></el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="手机：">
                <el-input v-model="form.telephone" placeholder="手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="6" :md="10" :lg="2" :xl="11">&nbsp;</el-col>
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="固话：">
                <el-input v-model="form.phoneNumber" placeholder="座机号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="邮箱：">
                <el-input v-model="form.email" placeholder="登录名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="6" :md="10" :lg="2" :xl="11">&nbsp;</el-col>
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="是否有效：">
                <el-switch v-model="form._isValid"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="角色：">
                <el-select v-model="roleIdList" multiple filterable style="width:400px;">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-input v-model="form.userId" type="hidden"></el-input>
        <el-input v-model="form.organizationId" type="hidden"></el-input>
        <el-input v-model="form.isValid" type="hidden"></el-input>
        <el-input v-model="form.selectRoleIds" type="hidden"></el-input>
        <el-form-item align="right">
          <el-button-group>
            <el-button type="primary" icon="el-icon-lx-roundcheck" @click="saveOrUpdateUser()">保存</el-button>
            <el-button type="primary" icon="el-icon-lx-forward" @click="$router.go(-1)">返回</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
    
<script>
import request from "@/utils/request";
export default {
  name: "modifyUser",
  data() {
    return {
      //默认第一个选项卡
      activeName: "first",
      form: {
        userId: null,
        loginName: null,
        userName: null,
        telephone: null,
        loginPassword: null,
        phoneNumber: null,
        email: null,
        isValid: null,
        _isValid: null,
        sex: null,
        organizationId: null,
        selectRoleIds: null
      },
      options: [],
      roleIdList: []
    };
  },
  created() {
    const row = this.$route.query.row;

    if (typeof row != "undefined") {
      this.form.userId = row.userId;
      this.form.loginName = row.loginName;
      this.form.userName = row.userName;
      this.form.telephone = row.telephone;
      this.form.phoneNumber = row.phoneNumber;
      this.form.email = row.email;
      this.form._isValid = row.isValid == "Y" ? true : false;
      this.form.sex = row.sex;
      this.form.organizationId = row.organizationId;
      this.form.loginPassword = row.loginPassword;
    }

    this.getUserRoles();
  },
  methods: {
    //获取角色列表
    getUserRoles() {
      request({
        url: "/userManagement/getUserRoles",
        method: "get",
        params: { userId: this.form.userId }
      }).then(res => {
        this.options = res.data.data.options;
        this.roleIdList = res.data.data.roleIds;
      });
    },

    saveOrUpdateUser() {
      //form表单传递数组后台无法接收，就转为字符串格式传递，后期找到解决方案后再改
      this.form.selectRoleIds = JSON.stringify(this.roleIdList);
      this.form.isValid = this.form._isValid ? "Y" : "N";
      request({
        url: "/userManagement/saveUser",
        method: "post",
        params: this.form
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
      });
    }
  }
};
</script>