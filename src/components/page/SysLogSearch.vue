
<template>
  <div class="container">
    <div>
      <el-form ref="form" :model="searchForm" label-width="auto" size="mini">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="登录名：">
              <user-list v-model="searchForm.loginName" placeholder="登录名"></user-list>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="操作类型：">
              <el-select v-model="searchForm.operateType" clearable>
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
        <el-row>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="操作时间：">
              <el-date-picker
                v-model="searchForm.createdDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="right">
          <el-button-group>
            <el-button type="primary" icon="el-icon-lx-search" @click="handleUserList">查 询</el-button>
            <el-button type="primary" icon="el-icon-lx-forward">重 置</el-button>
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
    >
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="loginName" label="登录名" width="100"></el-table-column>
      <el-table-column prop="ip" label="登录IP"></el-table-column>
      <el-table-column prop="operateType" label="操作类型" width="80"></el-table-column>
      <el-table-column prop="operateUrl" show-overflow-tooltip label="操作路径" width="150"></el-table-column>
      <el-table-column prop="createdDate" label="操作时间" sortable></el-table-column>
      <el-table-column prop="content" show-overflow-tooltip label="操作内容"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[30, 50, 100, 200]"
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
  name: "logManagement",
  data() {
    return {
      searchForm: {
        loginName: null,
        operateType: null,
        createdDate: null
      },
      options: [
        {
          value: "GET",
          label: "GET"
        },
        {
          value: "POST",
          label: "POST"
        },
        {
          value: "DELETE",
          label: "DELETE"
        }
      ],
      currentPage: 1, //初始页
      pageSize: 30, //每页的数据
      count: 0,
      rows: []
    };
  },

  components: {
    userList
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
        operateType: this.searchForm.operateType,
        createdDate: this.searchForm.createdDate
      };
      request({
        url: "/logManagement/search",
        method: "post",
        params: para
      }).then(res => {
        this.rows = res.data.list;
        this.count = res.data.total;
        this.currentPage = res.data.pageNum;
      });
    }
  }
};
</script>
    <style lang='' scoped>
</style>

