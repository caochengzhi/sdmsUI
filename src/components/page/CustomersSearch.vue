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
                  v-for="im in customerOptions"
                  :key="im.label"
                  :label="im.value"
                  :value="im.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="客户等级：">
              <dict-select @getDictVal="getCustomerGrade" v-bind:dictCode="'GradeList'"></dict-select>
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
            @click="handleCustomerList"
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
      <el-table-column fixed prop="customerName" label="客户名称" align="center" width="120"></el-table-column>
      <el-table-column fixed prop="customerClass" label="等级" align="center" width="50"></el-table-column>
      <el-table-column fixed prop="customerScore" label="评分" align="center" width="145">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.customerScore"
            :allow-half="true"
            disabled
            text-color="#ff9900"
          ></el-rate>
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
      <el-table-column prop="createdBy" label="创建人" align="center" width="100"></el-table-column>
      <el-table-column prop="createdDate" :formatter="dateFormat" label="创建日期" width="150" sortable></el-table-column>
      <el-table-column prop="lastUpdatedBy" label="修改人" align="center" width="100"></el-table-column>
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
  </div>
</template>
    
<script>
import request from "@/utils/request";
import dictSelect from "@/components/common/DictDataSelect.vue";
import { getCustomerList } from "@/utils/baseRequest";
export default {
  name: "customerManagement",
  data() {
    return {
      searchForm: {
        id: null,
        customerClass: null,
        sortName: "created_date",
        sortOrder: "desc"
      },
      loading: false,
      formLabelWidth: "80px",
      customerOptions: [],
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
  mounted() {
    this.handleCustomerList();
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          getCustomerList(query).then(response => {
            this.customerOptions = response.data.map(item => {
              return {
                value: item.customerName,
                label: item.id
              };
            });
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    getCustomerGrade(val) {
      this.searchForm.customerClass = val;
    },
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleCustomerList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleCustomerList();
    },
    handleCustomerList() {
      this.$set(this.searchForm, "pageNum", this.currentPage);
      this.$set(this.searchForm, "pageSize", this.pageSize);
      request({
        url: "/customersManager/search",
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
      this.$router.push({
        path: "modifyCustomer"
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