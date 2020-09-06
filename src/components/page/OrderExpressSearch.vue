<template>
  <div class="container">
    <div>
      <el-form ref="form" :model="searchForm" label-width="auto">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
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
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
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
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="省市区:">
              <el-cascader
                v-model="areaArrays"
                :options="areaOptions"
                :props="optionProps"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="客户订单号:">
              <el-input v-model="searchForm.customerOrderNo" placeholder="订单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="快递单号:">
              <el-input v-model="searchForm.expressNo" placeholder="快递单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="快递公司:">
              <dict-selectId @getDictVal="getExpressCompany" v-bind:dictCode="'expressCompany'"></dict-selectId>
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
      height="300"
      highlight-current-row
      :header-cell-style="{background:'#f4f4f4'}"
      element-loading-text="表格加载中..."
      stripe
    >
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="customerOrderNo" label="客户订单号" width="120" />
      <el-table-column prop="customerName" label="客户" width="100" />
      <el-table-column prop="businessPlatform" label="店铺/平台" width="100" />
      <el-table-column prop="customerItemSpecific" label="商家货品" width="120" />
      <el-table-column prop="expressNo" label="快递单号" width="130">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleExpressView(scope.$index, scope.row)"
          >{{scope.row.expressNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label prop="shipperCode" v-if="isShow" />
      <el-table-column prop="expressCompanyName" label="快递公司" />
      <el-table-column prop="expressStatus" label="物流状态" width="120" />
      <el-table-column prop="consigneeAddress" show-overflow-tooltip label="收件人地址" width="200" />
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
    <div class="container">
      <el-drawer
        :visible.sync="drawer"
        :before-close="handleClose"
        :show-close="false"
        :with-header="false"
      >
        <div style="margin-left:25px;margin-top:20px;height:100%;">
          <div style="margin-bottom:15px">
            物流信息查看：
            <el-radio-group v-model="reverse">
              <el-radio :label="true">倒序</el-radio>
              <el-radio :label="false">正序</el-radio>
            </el-radio-group>
          </div>
          <div style="height:65%;overflow:scroll;">
            <el-timeline :reverse="reverse" style="margin-left:25px">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :type="'primary'"
                :size="'large'"
                :timestamp="activity.acceptTime"
              >{{activity.content}}</el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import dictSelectId from "@/components/common/DictDataSelectId.vue";
import {
  getCustomerList,
  getDistinctCustomerSpecific
} from "@/utils/baseRequest";
import rawCitiesData from "@/assets/city-data.json";
export default {
  name: "expressManagement",
  show: true,
  data() {
    return {
      //此页面只查询未审核且有效的订单
      searchForm: {
        customerOrderNo: null,
        customerItemSpecific: null,
        expressNo: null,
        expressCompanyId: null,
        customerId: null,
        orderStatus: null,
        isValid: "Y",
        areas: null,
        isGeneratedExpressNo: "Y",
        sortName: "created_date",
        sortOrder: "desc",
        remarks: null
      },
      isShow: false,
      reverse: true,
      activities: null,
      drawer: false,
      formLabelWidth: "100px",
      areaArrays: null,
      areaOptions: rawCitiesData,
      optionProps: {
        //配置节点
        value: "label",
        checkStrictly: true,
        expandTrigger: "click"
      },
      tabLoading: false,
      currentPage: 1, //初始页
      pageSize: 30, //每页的数据
      count: 0,
      rows: [],
      customersOptions: [],
      specificOptions: []
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
    handleClose() {
      this.activities = [];
      this.drawer = false;
    },
    handleExpressView(index, row) {
      this.tabLoading = true;
      var params = {
        shipperCode: row.shipperCode,
        logisticCode: row.expressNo
      };
      request({
        url: "/orderExpressManagement/getOrderTraces",
        method: "post",
        params: params
      }).then(res => {
        if (res.data.code != "200") {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        } else {
          this.drawer = true;
          this.activities = res.data.data;
        }
        this.tabLoading = false;
      });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleOrderList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleOrderList();
    },
    handleOrderList() {
      this.tabLoading = true;
      this.$set(this.searchForm, "pageNum", this.currentPage);
      this.$set(this.searchForm, "pageSize", this.pageSize);
      this.$set(this.searchForm, "sortName", "created_date");
      this.$set(this.searchForm, "sortOrder", "desc");
      if (this.areaArrays != null) {
        this.searchForm.areas = JSON.stringify(this.areaArrays);
      }
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
    restFrm() {
      this.searchForm = {
        isValid: "Y",
        isGeneratedExpressNo: "Y",
        sortName: "created_date",
        sortOrder: "desc"
      };
      this.areaArrays = null;
    },
    getExpressCompany(val) {
      this.searchForm.expressCompanyId = val;
    }
  }
};
</script>