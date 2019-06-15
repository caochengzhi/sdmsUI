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
                <el-switch
                  v-model="form.isValid"
                  active-value="Y"
                  inactive-value="N"
                  @change="changeSwitch"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="所属角色：">
                <el-select v-model="roleIdList" multiple filterable style="width:400px;">
                  <el-option
                    v-for="item in roleList"
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
        <el-input v-model="form.selectRoleIds" type="hidden"></el-input>
        <el-form-item align="right">
          <el-popover placement="top" width="160" v-model="visible">
            <p>确定执行此操作？</p>
            <div style="text-align: center; margin: 0">
              <el-button type="info" @click="visible = false">取消</el-button>
              <el-button type="primary" @click="saveOrUpdateUser()">确定</el-button>
            </div>
            <el-button type="primary" slot="reference" icon="el-icon-lx-roundcheck">保存</el-button>
          </el-popover>
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
      form: {
        userId: null,
        loginName: null,
        userName: null,
        telephone: null,
        loginPassword: null,
        phoneNumber: null,
        email: null,
        isValid: null,
        sex: null,
        organizationId: null,
        selectRoleIds: null
      },
      visible: false,
      roleList: [],
      roleIdList: []
    };
  },
  created() {
    const row = this.$route.query.row;
    if (typeof row != "undefined") {
      this.form = row;
    }
    this.getUserRoles();
  },
  methods: {
    changeSwitch(val) {
      this.form.isValid = val;
    },
    //获取角色列表
    getUserRoles() {
      request({
        url: "/baseSearch/getRolesByUserId",
        method: "get",
        params: { userId: this.form.userId }
      }).then(res => {
        this.roleList = res.data.data.roleList;
        this.roleIdList = res.data.data.roleIds;
      });
    },

    saveOrUpdateUser() {
      //form表单传递数组后台无法接收，就转为字符串格式传递，后期找到解决方案后再改
      this.form.selectRoleIds = JSON.stringify(this.roleIdList);
      request({
        url: "/userManagement/saveUser",
        method: "post",
        params: this.COMMON.formFormat(this.form)
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
        this.visible = false;
        if (res.data.code == "200") {
          this.COMMON.closeTagAndGoBack(this.$options.name, this.$router);
        }
      });
    }
  }
};
</script>