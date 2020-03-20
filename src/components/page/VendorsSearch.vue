<template>
  <div class="container">
    <div>
      <el-form ref="searchForm" :model="searchForm" label-width="auto">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="客户名称:">
              <el-select
                v-model="searchForm.id"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="im in vendorOptions"
                  :key="im.label"
                  :label="im.value"
                  :value="im.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="客户等级：">
              <dict-select @getDictVal="getVendorGrade" v-bind:dictCode="'GradeList'"></dict-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-lx-search"
            v-has="'customerManagement-search'"
            @click="handleVendorList"
          >查 询</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-add"
            v-has="'customerManagement-add'"
            @click="addCustomer"
          >新 增</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-settings"
            v-has="'customerManagement-modify'"
            @click="modifyCustomer"
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
      <el-table-column fixed type="index" label="序号" align="center" width="55"></el-table-column>
      <el-table-column fixed prop="vendorName" label="供应商名称" align="center" width="120"></el-table-column>
      <el-table-column fixed prop="vendorClass" label="等级" align="center" width="50"></el-table-column>
      <el-table-column fixed prop="vendorScore" label="评分" align="center" width="145">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.vendorScore" :allow-half="true" disabled text-color="#ff9900"></el-rate>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerAddress"
        label="地址"
        align="center"
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <el-table-column
        prop="customerEmail"
        label="邮箱"
        align="center"
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <el-table-column prop="network" label="网址" align="center" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="remarks" label="备注" align="center" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="createdBy" label="创建人" align="center"></el-table-column>
      <el-table-column prop="createdDate" :formatter="dateFormat" label="创建日期" width="150" sortable></el-table-column>
      <el-table-column prop="lastUpdatedBy" label="修改人" align="center"></el-table-column>
      <el-table-column
        prop="lastUpdatedDate"
        :formatter="dateFormat"
        label="更新日期"
        width="150"
        align="center"
        sortable
      ></el-table-column>
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
        <el-button type="primary" @click="saveCustomer('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import dictSelect from "@/components/common/DictDataSelect.vue";
import { getVendorList } from "@/utils/baseRequest";
export default {
  name: "vendorManagement",
  data() {
    return {
      searchForm: {
        id: null,
        vendorClass: null,
        sortName: "created_date",
        sortOrder: "desc"
      },
      form: {
        item: null,
        remarks: null
      },
      loading: false,
      formLabelWidth: "80px",
      dialogFormVisible: false,
      vendorOptions: [],
      currentPage: 1, //初始页
      pageSize: 30, //每页的数据
      count: 0,
      rows: [],
      row: null
    };
  },
  components: {
    dictSelect
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          getVendorList(query).then(response => {
            this.vendorOptions = response.data.map(item => {
              return {
                value: item.vendorName,
                label: item.id
              };
            });
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    getVendorGrade(val) {
      this.searchForm.vendorClass = val;
    },
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleVendorList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleVendorList();
    },
    handleVendorList() {
      this.$set(this.searchForm, "pageNum", this.currentPage);
      this.$set(this.searchForm, "pageSize", this.pageSize);
      request({
        url: "/vendorsManager/search",
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
    addCustomer() {
      this.dialogFormVisible = true;
      this.form = {};
    },
    saveCustomer(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/customersManager/saveCustomer",
            method: "post",
            params: this.form
          }).then(res => {
            this.$message({
              message: res.data.msg,
              type: res.data.code == "200" ? "success" : "error"
            });
            this.handleVendorList();
          });
          this.dialogFormVisible = false;
        }
      });
    },
    modifyCustomer() {
      if (this.row == null) {
        this.$message({
          message: "请点击需要修改的行",
          type: "warning"
        });
        return;
      } else {
        this.$router.push({ path: "modifyCustomer", query: { row: this.row } });
      }
    }
  }
};
</script>