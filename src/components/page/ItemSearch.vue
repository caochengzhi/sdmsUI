<template>
  <div class="container">
    <div>
      <el-form ref="searchForm" :model="searchForm" label-width="auto">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="产品选择:" prop="customerId">
              <el-select v-model="searchForm.itemId" clearable placeholder="产品">
                <el-option
                  v-for="im in itemOptions"
                  :key="im.value"
                  :label="im.label"
                  :value="im.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-lx-search"
            v-has="'itemManagement-search'"
            @click="handleItemList"
          >查 询</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-add"
            v-has="'itemManagement-add'"
            @click="addItem"
          >新 增</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-settings"
            v-has="'itemManagement-modify'"
            @click="modifyItem"
          >编 辑</el-button>
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
      <el-table-column prop="item" label="产品" width="120"></el-table-column>
      <el-table-column prop="remarks" label="备注"></el-table-column>
      <el-table-column prop="createdBy" label="创建人"></el-table-column>
      <el-table-column prop="createdDate" :formatter="dateFormat" label="创建日期" sortable></el-table-column>
      <el-table-column prop="lastUpdatedBy" label="修改人"></el-table-column>
      <el-table-column prop="lastUpdatedDate" :formatter="dateFormat" label="更新日期" sortable></el-table-column>
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
    <!-- Form -->
    <el-dialog title="新增产品" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="产品名称" prop="item" :label-width="formLabelWidth">
          <el-input v-model="form.item"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks" :label-width="formLabelWidth">
          <el-input v-model="form.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveItem('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import { getItems } from "@/utils/baseRequest";
export default {
  name: "ItemSearch",
  data() {
    return {
      searchForm: {
        itemId: null,
        sortName: "created_date",
        sortOrder: "desc"
      },
      form: {
        item: null,
        remarks: null
      },
      rules: {
        item: [{ required: true, message: "不允许为空" }]
      },
      formLabelWidth: "80px",
      dialogFormVisible: false,
      itemOptions: [],
      currentPage: 1, //初始页
      pageSize: 30, //每页的数据
      count: 0,
      rows: [],
      row: null
    };
  },
  mounted() {
    getItems().then(response => {
      this.itemOptions = response.data.map(item => {
        return {
          value: item.itemId,
          label: item.item
        };
      });
    });
  },

  methods: {
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleItemList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleItemList();
    },
    handleItemList() {
      this.$set(this.searchForm, "pageNum", this.currentPage);
      this.$set(this.searchForm, "pageSize", this.pageSize);
      request({
        url: "/itemManagement/search",
        method: "post",
        params: this.searchForm
      }).then(res => {
        this.rows = res.data.list;
        this.count = res.data.total;
        this.currentPage = res.data.pageNum;
      });
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      return this.COMMON.dateFormat(date);
    },
    addItem() {
      this.dialogFormVisible = true;
      this.form = {};
    },
    saveItem(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/itemManagement/saveItem",
            method: "post",
            params: this.form
          }).then(res => {
            this.$message({
              message: res.data.msg,
              type: res.data.code == "200" ? "success" : "error"
            });
            this.handleItemList();
          });
          this.dialogFormVisible = false;
        }
      });
    },
    modifyItem() {
      if (this.row == null) {
        this.$message({
          message: "请点击需要修改的行",
          type: "warning"
        });
        return;
      } else {
        this.$router.push({ path: "modifyItem", query: { row: this.row } });
      }
    }
  }
};
</script>