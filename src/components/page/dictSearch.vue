<template>
  <div class="container">
    <div>
      <el-form ref="form" :model="searchForm" label-width="auto" size="mini">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="字典名称：">
              <el-input v-model="searchForm.dictName" placeholder="登录名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="字典类型：">
              <el-input v-model="searchForm.dictCode" placeholder="电话号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="right">
          <el-button-group>
            <el-button type="primary" icon="el-icon-lx-search" @click="handleDictList">查 询</el-button>
            <el-button type="primary" icon="el-icon-lx-add" @click="addDictType">新 增</el-button>
            <el-button type="primary" icon="el-icon-lx-settings" @click="modifyDictType">修 改</el-button>
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
      <el-table-column prop="dictName" label="字典名称"></el-table-column>
      <el-table-column prop="dictCode" label="字典编码"></el-table-column>
      <el-table-column prop="isValid" label="是否生效"></el-table-column>
      <el-table-column prop="remarks" label="备注信息"></el-table-column>
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

    <div>
      <!-- Form -->
      <el-dialog title="字典管理" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="字典名称" :label-width="formLabelWidth">
            <el-input v-model="form.dictName"></el-input>
          </el-form-item>
          <el-form-item label="字典编码" :label-width="formLabelWidth">
            <el-input v-model="form.dictCode"></el-input>
          </el-form-item>
          <el-form-item label="备注信息" :label-width="formLabelWidth">
            <el-input v-model="form.remarks"></el-input>
          </el-form-item>
          <el-form-item label="是否生效" :label-width="formLabelWidth">
            <el-switch v-model="form._isValid"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
  <script>
import request from "@/utils/request";
export default {
  name: "dictManagement",
  data() {
    return {
      searchForm: {
        dictName: null,
        dictCode: null
      },
      currentPage: 1, //初始页
      pageSize: 15, //每页的数据
      count: 0,
      rows: [],
      row: null,

      dialogFormVisible: false,
      form: {
        dictName: null,
        dictCode: null,
        isValid: null,
        _isValid: null,
        remarks: null
      },
      formLabelWidth: "80px"
    };
  },

  methods: {
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleDictList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleDictList();
    },
    handleDictList() {
      let para = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loginName: this.searchForm.loginName,
        telephone: this.searchForm.telephone
      };
      request({
        url: "/dictManagement/search",
        method: "post",
        params: para
      }).then(res => {
        this.rows = res.data.list;
        this.count = res.data.total;
        this.currentPage = res.data.pageNum;
      });
    },
    addDictType() {
      this.dialogFormVisible = true;
      this.form = [];
    },
    modifyDictType() {
      if (this.row == null) {
        this.$message({
          message: "请点击需要修改的行",
          type: "warning"
        });
        return;
      }
      this.dialogFormVisible = true;
      this.form = this.row;
      this.form._isValid = this.row.isValid == "Y" ? true : false;
    }
  },

  watch: {}
};
</script>

