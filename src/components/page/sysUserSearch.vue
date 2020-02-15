<template>
  <div class="container">
    <div>
      <el-form ref="form" :model="searchForm" label-width="auto" size="mini">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="登录名：">
              <user-list @sendVal="getLoginName" placeholder="登录名"></user-list>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="电话号码：">
              <el-input v-model="searchForm.telephone" placeholder="电话号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-lx-search"
            v-has="'userManagement-search'"
            @click="handleUserList"
          >查 询</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-add"
            v-has="'userManagement-add'"
            @click="addUser"
          >新 增</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-settings"
            v-has="'userManagement-modify'"
            @click="modifyUser"
          >修 改</el-button>
        </el-button-group>
      </div>
    </div>
    <el-table
      :data="rows"
      border
      highlight-current-row
      :header-cell-style="{background:'#f4f4f4'}"
      element-loading-text="表格加载中..."
      stripe
      @current-change="getRowDatas"
    >
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="loginName" label="登录名" width="120"></el-table-column>
      <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
      <el-table-column prop="telephone" label="电话"></el-table-column>
      <el-table-column prop="email" label="邮箱地址"></el-table-column>
      <el-table-column prop="isValid" label="是否有效" width="70"></el-table-column>
      <el-table-column prop="createdDate" :formatter="dateFormat" label="创建日期" sortable></el-table-column>
      <el-table-column prop="lastUpdatedDate" :formatter="dateFormat" label="更新日期" sortable></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import userList from "@/components/common/UserList.vue";
export default {
  name: "sysUserManager",
  data() {
    return {
      searchForm: {
        loginName: null,
        telephone: null
      },
      currentPage: 1, //初始页
      pageSize: 15, //每页的数据
      count: 0,
      rows: [],
      row: null
    };
  },
  components: {
    userList
  },
  mounted() {
    //this.handleUserList();
  },

  methods: {
    getLoginName(val) {
      this.searchForm.loginName = val;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleUserList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleUserList();
    },
    handleUserList() {
      let para = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loginName: this.searchForm.loginName,
        telephone: this.searchForm.telephone,
        sortName: "created_date",
        sortOrder: "desc"
      };
      request({
        url: "/userManagement/search",
        method: "post",
        params: para
      }).then(res => {
        this.rows = res.data.list;
        this.count = res.data.total;
        this.currentPage = res.data.pageNum;
      });
    },
    addUser() {
      this.$router.push({ path: "modifyUser" });
    },
    modifyUser() {
      if (this.row == null) {
        //this.sendMsg("请点击需要修改的行");
        this.$message({
          message: "请点击需要修改的行",
          type: "warning"
        });
        return;
      } else {
        this.$router.push({ path: "modifyUser", query: { row: this.row } });
      }
    },
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      return this.COMMON.dateFormat(date);
    },
    sendMsg(msg) {
      this.$notify.success({
        title: "Info",
        message: msg,
        position: "top-right",
        showClose: false
      });
    }
  }
};
</script>
