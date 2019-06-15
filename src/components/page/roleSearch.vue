<template>
  <div class="container">
    <div style="margin-bottom: 10px;">
      <el-row>
        <el-col :span="10">&nbsp;</el-col>
        <el-col :span="6">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        </el-col>
        <div align="right">
          <el-col :span="8">
            <el-button-group>
              <el-button type="primary" icon="el-icon-lx-search" @click="handleRoleList">查 询</el-button>
              <el-button type="primary" icon="el-icon-lx-add" @click="addRole">新 增</el-button>
              <el-button type="primary" icon="el-icon-lx-settings" @click="modifyRole">修 改</el-button>
            </el-button-group>
          </el-col>
        </div>
      </el-row>
    </div>
    <el-table
      :data="rows.filter(data => !select_word || data.roleName.toLowerCase().includes(select_word.toLowerCase()) || data.roleCode.toLowerCase().includes(select_word.toLowerCase()))"
      border
      highlight-current-row
      :header-cell-style="{background:'#f4f4f4'}"
      element-loading-text="表格加载中..."
      stripe
      @current-change="getRowDatas"
    >
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleCode" label="角色编码"></el-table-column>
      <el-table-column prop="description" label="备注信息"></el-table-column>
      <el-table-column prop="createdDate" :formatter="dateFormat" label="创建日期"></el-table-column>
    </el-table>
  </div>
</template>
    
<script>
import request from "@/utils/request";
export default {
  name: "roleManager",
  data() {
    return {
      rows: [],
      row: null,
      select_word: ""
    };
  },

  mounted() {
    //this.handleRoleList();
  },
  computed: {
    data() {
      return this.rows.filter(d => {
        if (
          d.roleName.indexOf(this.select_cate) > -1 ||
          d.roleCode.indexOf(this.select_word) > -1 ||
          d.description.indexOf(this.select_word) > -1
        ) {
          return d;
        }
      });
    }
  },
  methods: {
    handleRoleList() {
      request({
        url: "/roleManager/search",
        method: "post"
      }).then(res => {
        this.rows = res.data;
      });
    },
    addRole() {
      this.$router.push({ path: "modifyRole" });
    },
    modifyRole() {
      if (this.row == null) {
        this.$message({
          message: "请点击需要修改的行",
          type: "warning"
        });
        return;
      }
      this.$router.push({ path: "modifyRole", query: { row: this.row } });
    },
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      return this.COMMON.dateFormat(date);
    }
  }
};
</script>
    <style lang='' scoped>
</style>

