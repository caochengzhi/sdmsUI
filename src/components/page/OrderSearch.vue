<template>
  <div class="container">
    <div>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-upload"
            v-has="'orderManagement-input'"
            @click="dialogFormVisible = true"
          >订单导入</el-button>
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
            <el-form-item label="订单状态:">
              <el-select v-model="searchForm.orderStatus" clearable placeholder="请选择">
                <el-option
                  v-for="item in orderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="是否有效：">
              <el-select v-model="searchForm.isValid" clearable placeholder="请选择">
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
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="客户订单号:">
              <el-input v-model="searchForm.ordecustomerOrderNorNo" placeholder="订单号"></el-input>
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
      v-loading="tabLoading"
      :data="rows"
      border
      height="300"
      highlight-current-row
      :header-cell-style="{background:'#f4f4f4'}"
      element-loading-text="表格加载中..."
      stripe
    >
      <el-table-column fixed type="index" label="序号" width="55" />
      <el-table-column fixed prop="orderNo" label="系统订单号" show-overflow-tooltip width="130" />
      <el-table-column fixed prop="customerName" label="客户" show-overflow-tooltip width="100" />
      <el-table-column fixed prop="businessPlatform" label="店铺/平台" width="100" />
      <el-table-column
        fixed
        prop="customerOrderNo"
        label="客户订单号"
        show-overflow-tooltip
        width="120"
      />
      <el-table-column
        fixed
        prop="customerItemSpecific"
        show-overflow-tooltip
        label="商家货品"
        width="120"
      />
      <el-table-column prop="orderStatusDesc" label="订单状态" width="120" />
      <el-table-column prop="consigneeAddress" show-overflow-tooltip label="收件人地址" width="200" />
      <el-table-column prop="isValid" label="是否有效" width="80" />
      <el-table-column prop="remarks" label="备注" show-overflow-tooltip width="200" />
      <el-table-column prop="isReviewed" label="已审核" width="80" />
      <el-table-column prop="isGeneratedExpressNo" label="已生成物流单号" width="80" />
      <el-table-column prop="isPrinted" label="已打印" width="80" />
      <el-table-column prop="isShipped" label="已发货" width="80" />
      <el-table-column prop="isCreatedExpressInfo" label="已生成物流信息" width="80" />
      <el-table-column prop="isCompleted" label="已关闭" width="80" />
      <el-table-column prop="isCanceled" label="已撕单" width="80" />
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

    <el-dialog title="订单导入 （每次上传文件不超3个）" :visible.sync="dialogFormVisible" width="550px">
      <el-form :model="inputForm" v-loading="loading" element-loading-text="订单导入中，请稍等...">
        <el-row :gutter="50">
          <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
            <el-form-item label="客户选择:" :label-width="formLabelWidth">
              <el-select v-model="inputForm.customerId" clearable placeholder="请选择">
                <el-option
                  v-for="item in customersOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" style="padding-left: 0px;">
            <el-upload
              action="string"
              ref="upload"
              :before-upload="beforeupload"
              :on-exceed="handleExceed"
              :show-file-list="true"
              multiple
              :limit="3"
              :auto-upload="false"
            >
              <el-button size="mini" type="primary" @click="clearUpload">选取文件</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-form-item align="right">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="success" @click="submitUpload" icon="el-icon-download">导 入</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import { getOrderStatus, getCustomerList } from "@/utils/baseRequest";
export default {
  name: "orderManagement",
  show: true,
  data() {
    return {
      searchForm: {
        customerOrderNo: null,
        customerId: null,
        orderStatus: null,
        isValid: null,
        pickDate: null,
        sortName: "created_date",
        sortOrder: "desc"
      },
      inputForm: {
        customerId: null
      },
      uploadForm: new FormData(),
      dialogFormVisible: false,
      formLabelWidth: "100px",
      loading: false,
      tabLoading: false,
      currentPage: 1, //初始页
      pageSize: 30, //每页的数据
      count: 0,
      rows: [],
      orderOptions: [],
      customersOptions: [],
      options: [
        {
          value: "N",
          label: "N"
        },
        {
          value: "Y",
          label: "Y"
        },
        {
          value: "E",
          label: "E"
        }
      ],
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
          },
          {
            text: "最近一周",
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              end.setHours(23);
              end.setMinutes(59);
              end.setSeconds(59);

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              end.setHours(23);
              end.setMinutes(59);
              end.setSeconds(59);

              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
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
  mounted() {
    getOrderStatus().then(response => {
      this.orderOptions = response.data.map(item => {
        return {
          value: item.key,
          label: item.value
        };
      });
    });
    getCustomerList().then(response => {
      this.customersOptions = response.data.map(item => {
        return {
          value: item.id,
          label: item.customerName
        };
      });
    });
  },
  methods: {
    //获取文件
    beforeupload(file) {
      this.uploadForm.append("file", file);
      this.uploadForm.append("customerId", this.inputForm.customerId);
      return false;
    },
    clearUpload() {
      this.uploadForm = new FormData();
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制最多选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //手动上传附件
    submitUpload() {
      this.$refs.upload.submit();
      let data = this.uploadForm;
      if (this.inputForm.customerId == null || data.get("file") == null) {
        this.$message.warning("店铺信息或附件未选择");
        return;
      }
      this.loading = true;
      request({
        url: "/orderManagement/upload",
        method: "post",
        data: data,
        processData: false, //必写
        contentType: false //必写
      }).then(res => {
        if (res.data.code == "200") {
          this.clearUpload();
          this.dialogFormVisible = false;
        }
        this.$message({
          message: res.data.msg,
          type: "success"
        });
        this.loading = false;
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
    handleOrderList() {
      this.tabLoading = true;
      this.$set(this.searchForm, "pageNum", this.currentPage);
      this.$set(this.searchForm, "pageSize", this.pageSize);
      this.$set(this.searchForm, "sortName", "created_date");
      this.$set(this.searchForm, "sortOrder", "desc");
      this.$set(this.searchForm, "selectDatas", "");

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
      this.searchForm = {};
    }
  }
};
</script>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-upload--text {
  border: 0px;
  position: relative;
  width: 85px;
  height: 30px;
  overflow: hidden;
}
</style>