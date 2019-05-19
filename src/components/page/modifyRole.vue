<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="auto">
      <el-tabs v-model="activeName">
        <el-tab-pane label="编辑角色" name="first">
          <el-row :gutter="10">
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="角色名称：">
                <el-input v-model="form.roleName" placeholder="角色名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="6" :md="10" :lg="2" :xl="11">&nbsp;</el-col>
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="角色编码：">
                <el-input v-model="form.roleCode" placeholder="角色编码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :xs="8" :sm="6" :md="2" :lg="12" :xl="1">
              <el-form-item label="备注信息：">
                <el-input v-model="form.description" placeholder="备注信息"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col>
              <el-form-item label="用户选择：">
                <el-transfer
                  filterable
                  :titles="['待选用户','已选用户']"
                  :filter-method="filterMethod"
                  filter-placeholder="请输入用户"
                  v-model="userIds"
                  :data="userData"
                  @change="handleChange"
                ></el-transfer>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item align="right">
            <el-button-group>
              <el-button type="primary" icon="el-icon-lx-roundcheck" @click="saveOrUpdateRole()">保存</el-button>
              <el-button type="primary" icon="el-icon-lx-forward" @click="$router.go(-1)">返回</el-button>
            </el-button-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="编辑权限" name="second">
          <el-row :gutter="10">
            <el-col>
              <el-form-item label="权限选择：">
                <el-tree
                  :data="treeData"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  draggable
                  :default-checked-keys="checkedKyes"
                  ref="tree"
                  highlight-current
                  :props="defaultProps"
                  @check-change="getChecked"
                ></el-tree>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-input v-model="form.roleId" type="hidden"></el-input>
      <el-input v-model="form.organizationId" type="hidden"></el-input>
      <el-input v-model="form.checkedUserId" type="hidden"></el-input>
      <el-input v-model="form.reosurceIds" type="hidden"></el-input>
    </el-form>
  </div>
</template>
    
<script>
import request from "@/utils/request";
export default {
  name: "modifyRole",
  data() {
    return {
      activeName: "first",
      form: {
        roleId: null,
        roleName: null,
        roleCode: null,
        description: null,
        organizationId: null,
        checkedUserId: null,
        reosurceIds: null
      },
      userData: [],
      userIds: [],
      checkedKyes: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      filterMethod(query, item) {
        return item.searchr.indexOf(query) > -1;
      }
    };
  },

  created() {
    const row = this.$route.query.row;
    if (typeof row != "undefined") {
      this.form.roleId = row.roleId;
      this.form.roleName = row.roleName;
      this.form.roleCode = row.roleCode;
      this.form.description = row.description;
      this.form.organizationId = row.organizationId;
    }

    this.getUserList();
    this.getSourcesTree();
  },

  methods: {
    generateData(userList) {
      const data = [];
      const filters = userList;
      userList.forEach((user, index) => {
        data.push({
          label: user.userName,
          key: user.userId,
          searchr: filters[index].pinyin
        });
      });
      return data;
    },

    //获取角色列表
    getUserList() {
      request({
        url: "/baseSearch/getUsersByRoleId",
        method: "get",
        params: { roleId: this.form.roleId }
      }).then(res => {
        this.userData = this.generateData(res.data.data.userList);
        this.userIds = res.data.data.userIds;
        this.form.checkedUserId = this.userIds;
      });
    },

    //获取资源树
    getSourcesTree() {
      request({
        url: "/baseSearch/getResourcesByRoleId",
        method: "get",
        params: { roleId: this.form.roleId }
      }).then(res => {
        this.treeData = res.data.data.resourceTree;
        this.checkedKyes = res.data.data.checkIds;
        this.form.reosurceIds = this.checkedKyes;
      });
    },
    getChecked() {
      var childIds = this.$refs.tree.getCheckedKeys();
      var partentIds = this.$refs.tree.getHalfCheckedKeys();
      this.form.reosurceIds = childIds + "," + partentIds;
    },
    saveOrUpdateRole() {
      this.form.checkedUserId = JSON.stringify(this.form.checkedUserId);
      request({
        url: "/roleManager/saveRole",
        method: "post",
        params: this.form
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
      });
    },
    handleChange(value, direction, movedKeys) {
      this.form.checkedUserId = value;
    }
  }
};
</script>