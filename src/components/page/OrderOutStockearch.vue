<template>
  <div class="container">
    <div align="right" style="padding-bottom:5px;">
      <el-button-group>
        <el-tooltip content="提示：如果不勾选，默认打印全部订单" placement="top" effect="light">
          <el-button
            type="primary"
            icon="el-icon-finished"
            v-has="'orderOutStockManagement-print'"
            @click="printExpressNos"
          >打印快递单号</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <div>
      <el-form ref="form" :model="searchForm" label-width="auto">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="客户选择:">
              <el-select v-model="searchForm.customerId" clearable placeholder="请选择">
                <el-option
                  v-for="item in customersOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="商家货品:">
              <el-select
                v-model="searchForm.customerItemSpecific"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in specificOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="发货仓库：">
              <dict-selectId
                @clearDictVal="clearWarehouse"
                @getDictVal="getWarehouse"
                v-bind:dictCode="'warehouse'"
              ></dict-selectId>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="快递公司:">
              <dict-selectId @getDictVal="getExpressCompany" v-bind:dictCode="'expressCompany'"></dict-selectId>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="是否已打印：">
              <el-select v-model="searchForm.isPrinted" clearable placeholder="请选择">
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
      </el-form>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-lx-search"
            v-has="'orderManagement-search'"
            @click="handleOrderList"
          >查 询</el-button>
          <el-button type="primary" @click="restFrm" icon="el-icon-lx-forward">重 置</el-button>
        </el-button-group>
      </div>
    </div>
    <el-table
      ref="orderTable"
      v-loading="tabLoading"
      :data="rows"
      border
      stripe
      height="300"
      highlight-current-row
      :header-cell-style="{background:'#f4f4f4'}"
      element-loading-text="表格加载中..."
      @selection-change="handleSelectionChange"
      @row-click="handleClickTableRow"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="isPrinted" label="已打印" width="65" />
      <el-table-column prop="customerOrderNo" label="客户订单号" width="120" />
      <el-table-column prop="customerName" label="客户" width="100" />
      <el-table-column prop="businessPlatform" label="店铺/平台" width="100" />
      <el-table-column prop="customerItemSpecific" label="商家货品" width="120" />
      <el-table-column prop="expressCompanyName" label="快递公司" width="100" />
      <el-table-column prop="warehouse" label="仓库" width="100" />
      <el-table-column prop="consigneeAddress" show-overflow-tooltip label="收件人地址" />
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
import {
  getCustomerList,
  getDistinctCustomerSpecific
} from "@/utils/baseRequest";
import request from "@/utils/request";
import dictSelectId from "@/components/common/DictDataSelectId.vue";
export default {
  name: "orderOutStockManagement",
  data() {
    return {
      searchForm: {
        customerId: null,
        customerItemSpecific: null,
        warehouseId: null,
        isPrinted: null,
        isValid: "Y",
        isReviewed: "Y",
        isCompleted: "N",
        expressCompanyId: null,
        isGeneratedExpressNo: "Y" //此页面是给仓库人员看的，只管打印快递单发货就可以了
      },
      orderIds: [],
      customersOptions: [],
      specificOptions: [],
      rows: [],
      options: [
        {
          value: "N",
          label: "N"
        },
        {
          value: "Y",
          label: "Y"
        }
      ],
      tabLoading: false,
      currentPage: 1, //初始页
      pageSize: 30, //每页的数据
      count: 0
    };
  },
  components: {
    dictSelectId
  },
  mounted() {
    getCustomerList().then(response => {
      this.customersOptions = response.data.map(item => {
        return {
          value: item.id,
          label: item.customerName
        };
      });
    });
    getDistinctCustomerSpecific().then(response => {
      this.specificOptions = response.data.map(item => {
        return {
          value: item.customerSpecificCode,
          label: item.customerSpecificCode
        };
      });
    });
  },

  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleOrderList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleOrderList();
    },
    handleClickTableRow(row, event, column) {
      this.$refs.orderTable.toggleRowSelection(row);
    },
    handleOrderList() {
      this.tabLoading = true;
      this.$set(this.searchForm, "pageNum", this.currentPage);
      this.$set(this.searchForm, "pageSize", this.pageSize);
      this.$set(this.searchForm, "sortName", "created_date");
      this.$set(this.searchForm, "sortOrder", "desc");
      request({
        url: "/orderManagement/search",
        method: "post",
        params: this.searchForm
      }).then(res => {
        this.rows = res.data.list;
        this.count = res.data.total;
        this.currentPage = res.data.pageNum;
        this.tabLoading = false;
      });
    },
    //用户选择行的id存入数组
    handleSelectionChange(rows) {
      this.orderIds = [];
      rows.forEach(row => {
        this.orderIds.push(row.headerId);
      });
    },
    //这里进行订单快递单号打印
    printExpressNos() {
      var total =
        this.orderIds.length === 0 ? this.count : this.orderIds.length;
      if (total === 0) {
        this.$message({
          message: "当前页面没有待打印的订单，请检查",
          type: "warning"
        });
        return false;
      }
      alert("还没开发");
    },
    restFrm() {
      this.searchForm = {
        isValid: "Y",
        isReviewed: "Y",
        isGeneratedExpressNo: "N"
      };
    },
    clearWarehouse() {
      this.searchForm.warehouseId = null;
    },
    getWarehouse(val) {
      this.searchForm.warehouseId = val;
    },
    getExpressCompany(val) {
      this.searchForm.expressCompanyId = val;
    }
  }
};
</script>