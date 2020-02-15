
  <template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="编辑角色" name="first">
        <el-form ref="form" :model="form" label-width="auto">
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
                  v-model="checkUserIds"
                  :data="userData"
                  @change="handleUserChange"
                ></el-transfer>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item align="right">
            <el-popover placement="top" width="160" v-model="visible">
              <p>确定执行此操作？</p>
              <div style="text-align: center; margin: 0">
                <el-button type="info" @click="visible = false">取消</el-button>
                <el-button type="primary" @click="saveOrUpdateRole()">确定</el-button>
              </div>
              <el-button type="primary" slot="reference" icon="el-icon-lx-roundcheck">保存</el-button>
            </el-popover>
          </el-form-item>
          <el-input v-model="form.roleId" type="hidden"></el-input>
          <el-input v-model="form.organizationId" type="hidden"></el-input>
          <el-input v-model="form.userIds" type="hidden"></el-input>
          <el-input v-model="form.resourceIds" type="hidden"></el-input>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="编辑权限" name="second">
        <el-row :gutter="10">
          <el-col>
            <el-tree
              :data="treeData"
              show-checkbox
              default-expand-all
              node-key="id"
              draggable
              :default-checked-keys="checkResourceIds"
              ref="tree"
              highlight-current
              :props="defaultProps"
              @check-change="getResourceChecked"
            ></el-tree>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
  
  <script>
import request from "@/utils/request";
import { getUsersByRoleId, getResourcesByRoleId } from "@/utils/baseRequest";

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
        userIds: null,
        resourceIds: null
      },
      visible: false,
      userData: [], //用户列表
      treeData: [], //资源树列表
      checkUserIds: [], //初始被选中用户
      checkResourceIds: [], //初始被选择资源
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
      this.form = row;
    }
    //获取角色的用户列表
    this.GetUsersByRoleId(this.form.roleId);
    //获取角色的权限树
    this.GetResourcesByRoleId(this.form.roleId);
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

    //获取当前角色对应的用户列表
    GetUsersByRoleId(roleId) {
      getUsersByRoleId(roleId)
        .then(response => {
          const data = response.data;
          if (data.code == 200) {
            this.userData = this.generateData(data.data.userList);
            this.checkUserIds = data.data.checkUserIds;
          } else {
            this.$message({
              message: data.msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },

    //获取资源树
    GetResourcesByRoleId(roleId) {
      getResourcesByRoleId(roleId)
        .then(response => {
          const data = response.data;
          if (data.code == 200) {
            this.treeData = data.data.resourceTree;
            this.checkResourceIds = data.data.checkResourceIds; //被选中的子节点
            this.form.resourceIds = data.data.resourceIds; //所有选中的节点包含父节点
          } else {
            this.$message({
              message: data.msg,
              type: "error"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },

    saveOrUpdateRole() {
      //checkUserIds是数组，传到前台会报错，先转成字符串格式再做传输
      this.form.userIds = JSON.stringify(this.checkUserIds);
      request({
        url: "/roleManager/saveRole",
        method: "post",
        params: this.COMMON.formFormat(this.form) //表单日期格式化
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
    },

    //用户选择发生改变时调用
    handleUserChange(value, direction, movedKeys) {
      this.checkUserIds = value;
    },
    //当资源树发生改变时调用
    getResourceChecked() {
      var childIds = this.$refs.tree.getCheckedKeys();
      var partentIds = this.$refs.tree.getHalfCheckedKeys();
      this.form.resourceIds = childIds + "," + partentIds;
    }
  }
};
</script>
  <style lang='' scoped>
</style>