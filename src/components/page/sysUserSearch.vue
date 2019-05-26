<template>
  <div class="container">
    <div>
      <el-form ref="form" :model="searchForm" label-width="auto" size="mini">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="登录名：">
              <el-input v-model="searchForm.loginName" placeholder="登录名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="电话号码：">
              <el-input v-model="searchForm.telephone" placeholder="电话号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="right">
          <el-button-group>
            <el-button type="primary" icon="el-icon-lx-search" @click="handleUserList">查 询</el-button>
            <el-button type="primary" icon="el-icon-lx-add" @click="addUser">新 增</el-button>
            <el-button type="primary" icon="el-icon-lx-settings" @click="modifyUser">修 改</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
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
      <el-table-column prop="createdDate" label="创建日期" sortable></el-table-column>
      <el-table-column prop="lastUpdatedDate" label="更新日期" sortable></el-table-column>
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
  created() {
    //this.handleUserList();
  },

  methods: {
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
        telephone: this.searchForm.telephone
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
        //alert(this.row.userId);
        this.$router.push({ path: "modifyUser", query: { row: this.row } });
      }
    },
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
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
