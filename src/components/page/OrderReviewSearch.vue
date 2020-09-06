<template>
  <div class="container">
    <div>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-tooltip content="提示：如果不勾选，默认审核全部订单" placement="top" effect="light">
            <el-button
              type="primary"
              icon="el-icon-finished"
              v-has="'orderReviewManagement-review'"
              @click="reviewOrdersByResult"
            >订单审核</el-button>
          </el-tooltip>
        </el-button-group>
      </div>
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
            <el-form-item label="订单导入时间:">
              <el-date-picker
                v-model="searchForm.pickDate"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                value-format="timestamp"
              ></el-date-picker>
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
      @selection-change="handleSelectionChange"
      @row-click="handleClickTableRow"
    >
      <el-table-column fixed type="selection" width="55"></el-table-column>
      <el-table-column fixed type="index" label="序号" width="55" />
      <el-table-column fixed prop="orderNo" label="系统订单号" show-overflow-tooltip width="130" />
      <el-table-column fixed prop="customerName" label="客户" show-overflow-tooltip width="100" />
      <el-table-column fixed prop="businessPlatform" label="店铺/平台" width="100" />
      <el-table-column fixed prop="customerOrderNo" label="客户订单号" width="120" />
      <el-table-column fixed prop="customerItemSpecific" label="商家货品" width="120" />
      <el-table-column prop="orderStatusDesc" label="订单状态" width="120" />
      <el-table-column prop="consigneeAddress" show-overflow-tooltip label="收件人地址" width="200" />
      <el-table-column prop="isValid" label="是否有效" width="80" />
      <el-table-column prop="isReviewed" label="已审核" width="80" />
      <el-table-column prop="isGeneratedExpressNo" label="已生成物流单号" width="80" />
      <el-table-column prop="isPrinted" label="已打印" width="80" />
      <el-table-column prop="isShipped" label="已发货" width="80" />
      <el-table-column prop="isCreatedExpressInfo" label="已生成物流信息" width="80" />
      <el-table-column prop="isCompleted" label="已关闭" width="80" />
      <el-table-column prop="isCanceled" label="已撕单" width="80" />
      <el-table-column prop="remarks" label="备注" show-overflow-tooltip width="200" />
      <el-table-column prop="createdBy" label="创建人" width="120" />
      <el-table-column
        prop="createdDate"
        label="创建时间"
        :formatter="dateFormat"
        sortable
        width="150"
      />
      <el-table-column prop="lastUpdatedBy" label="更新人" width="120" />
      <el-table-column
        prop="lastUpdatedDate"
        label="更新时间"
        :formatter="dateFormat"
        sortable
        width="150"
      />
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

    <!-- Form，说明：整个页面使用同一个searchForm对象，是因为如果用户审核全部订单时需要再次在后台查询订单数据 -->
    <el-dialog title="订单审核" :visible.sync="dialogFormVisible">
      <el-form :model="searchForm" v-loading="loading" element-loading-text="订单审核中，请稍等...">
        <el-form-item label="审核：" :label-width="formLabelWidth">
          <el-radio v-model="searchForm.isValidSet" label="Y" @change="changeStatus('Y')">通过</el-radio>
          <el-radio v-model="searchForm.isValidSet" label="N" @change="changeStatus('N')">驳回</el-radio>
        </el-form-item>
        <el-form-item label="发货仓库：" v-show="isShow" :label-width="formLabelWidth" required>
          <dict-selectId
            @clearDictVal="clearWarhouse"
            @getDictVal="getWarehouse"
            v-bind:dictCode="'warehouse'"
          ></dict-selectId>
        </el-form-item>
        <el-form-item label="快递公司：" v-show="isShow" :label-width="formLabelWidth" required>
          <dict-selectId
            @clearDictVal="clearExpressCompany"
            @getDictVal="getExpressCompany"
            v-bind:dictCode="'expressCompany'"
          ></dict-selectId>
        </el-form-item>
        <el-form-item label="备注：" v-show="isRemarkShow" :label-width="formLabelWidth" required>
          <el-input type="textarea" v-model="searchForm.remarks" placeholder="驳回请备注原因"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitOrders">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
  name: "orderReviewManagement",
  show: true,
  data() {
    return {
      //此页面只查询未审核且有效的订单
      searchForm: {
        customerOrderNo: null,
        customerItemSpecific: null,
        customerId: null,
        orderStatus: null,
        isValid: "Y",
        pickDate: null,
        areas: null,
        isReviewed: "N",
        sortName: "created_date",
        sortOrder: "desc",
        isValidSet: null, //用来传递用户审核订单通过与否
        remarks: null,
        expressCompanyId: null, //注意：订单审核子页面中用来分配快递公司用的字段
        warehouseId: null //注意：订单审核子页面中用来分配仓库用的字段
      },
      isShow: true,
      isRemarkShow: false,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      orderIds: [],
      areaArrays: null,
      areaOptions: rawCitiesData,
      optionProps: {
        //配置节点
        value: "label",
        checkStrictly: true,
        expandTrigger: "click"
      },
      loading: false,
      tabLoading: false,
      currentPage: 1, //初始页
      pageSize: 30, //每页的数据
      count: 0,
      rows: [],
      customersOptions: [],
      specificOptions: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              end.setHours(23);
              end.setMinutes(59);
              end.setSeconds(59);
              start.setTime(start.getTime());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              const end = new Date();
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              end.setHours(23);
              end.setMinutes(59);
              end.setSeconds(59);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
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
    changeStatus(val) {
      if (val === "Y") {
        this.isShow = true;
        this.isRemarkShow = false;
      } else {
        this.isShow = false;
        this.isRemarkShow = true;
      }
    },
    handleClickTableRow(row, event, column) {
      this.$refs.orderTable.toggleRowSelection(row);
    },
    //用户选择行的id存入数组
    handleSelectionChange(rows) {
      this.orderIds = [];
      rows.forEach(row => {
        this.orderIds.push(row.headerId);
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
    dateFormat: function(row, column) {
      var date = row[column.property];
      return this.COMMON.dateFormat(date);
    },
    clearExpressCompany() {
      this.searchForm.expressCompanyId = null;
    },
    getExpressCompany(val) {
      this.searchForm.expressCompanyId = val;
    },
    clearWarhouse() {
      this.searchForm.warehouseId = null;
    },
    getWarehouse(val) {
      this.searchForm.warehouseId = val;
    },
    handleOrderList() {
      this.tabLoading = true;
      this.$set(this.searchForm, "pageNum", this.currentPage);
      this.$set(this.searchForm, "pageSize", this.pageSize);
      this.$set(this.searchForm, "sortName", "created_date");
      this.$set(this.searchForm, "sortOrder", "desc");
      this.$set(this.searchForm, "selectDatas", "");
      if (this.areaArrays != null) {
        this.searchForm.areas = JSON.stringify(this.areaArrays);
      }

      if (this.searchForm.pickDate != null) {
        this.$set(
          this.searchForm,
          "selectDatas",
          JSON.stringify(this.searchForm.pickDate)
        );
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
        isReviewed: "N",
        sortName: "created_date",
        sortOrder: "desc"
      };
      this.areaArrays = null;
    },
    //订单审核提交
    submitOrders() {
      if (this.searchForm.isValidSet === "Y") {
        if (
          this.searchForm.warehouseId == null ||
          this.searchForm.expressCompanyId == null
        ) {
          this.$message({
            message: "'发货仓库'或'快递公司'不允许为空，请检查!",
            type: "warning"
          });
          return;
        }
      }

      this.loading = true;
      //1、情况一，如果用户选择指定行审核订单
      if (this.orderIds.length > 0) {
        orderIds: JSON.stringify(this.orderIds);
        this.$set(this.searchForm, "headerIds", JSON.stringify(this.orderIds));
      }
      //2、情况二，当前符合查询条件的所有订单，所以需要把查询条件再次封装给后台
      else if (this.count > 0) {
        if (this.areaArrays != null) {
          this.searchForm.areas = JSON.stringify(this.areaArrays);
        }
        if (this.searchForm.pickDate != null) {
          this.$set(
            this.searchForm,
            "selectDatas",
            JSON.stringify(this.searchForm.pickDate)
          );
        }
      }
      request({
        url: "/orderManagement/reviewOrders",
        method: "post",
        params: this.searchForm
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
        this.dialogFormVisible = false;
        this.loading = false;
        this.handleOrderList();
      });
    },
    reviewOrdersByResult() {
      var total =
        this.orderIds.length === 0 ? this.count : this.orderIds.length;
      if (total === 0) {
        this.$message({
          message: "当前页面没有待审核的订单，请检查",
          type: "warning"
        });
        return false;
      }

      this.$confirm("您已选择" + total + "条待审核订单, 请确认", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      }).then(() => {
        this.changeStatus("Y");
        this.searchForm.isValidSet = "Y";
        this.searchForm.remarks = null;
        this.dialogFormVisible = true;
      });
    }
  }
};
</script>