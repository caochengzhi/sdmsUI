
<template>
  <div class="container">
    <div>
      <el-form ref="searchForm" :model="searchForm" label-width="auto">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="快递公司:">
              <dict-selectId @getDictVal="getExpressCompany" v-bind:dictCode="'expressCompany'"></dict-selectId>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="客户号:">
              <el-input v-model="searchForm.customerName"></el-input>
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
      </el-form>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-lx-search"
            v-has="'expressCustomerConfigManagement-search'"
            @click="handleList"
          >查 询</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-add"
            v-has="'dictManagement-add'"
            @click="addConfig"
          >新 增</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-settings"
            v-has="'dictManagement-modify'"
            @click="modifyConfig"
          >修 改</el-button>
        </el-button-group>
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
        <el-table-column prop="expressCompanyName" label="快递公司"></el-table-column>
        <el-table-column prop="customerName" label="客户号" width="130"></el-table-column>
        <el-table-column prop="monthCode" label="月结号" width="100"></el-table-column>
        <el-table-column prop="sendSite" label="所属网店" width="120"></el-table-column>
        <el-table-column prop="sendStaff" label="快递员"></el-table-column>
        <el-table-column prop="isValid" label="是否有效"></el-table-column>
        <el-table-column prop="remark" label="备注信息"></el-table-column>
        <el-table-column
          prop="createdDate"
          :formatter="dateFormat"
          label="创建日期"
          sortable
          width="150"
        ></el-table-column>
        <el-table-column
          prop="lastUpdatedDate"
          :formatter="dateFormat"
          label="更新日期"
          sortable
          width="150"
        ></el-table-column>
        <el-table-column fixed="right" label="对接仓库" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <!-- Table -->
      <el-dialog title="仓库列表" :visible.sync="dialogTableVisible" center>
        <el-table :data="gridData">
          <el-table-column property="vendorName" label="供应商" width="150"></el-table-column>
          <el-table-column property="warehouse" label="仓库"></el-table-column>
          <el-table-column property="warehouseAddress" label="地址" width="200"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- Form -->
      <el-dialog
        title="电子面单客户号配置"
        :before-close="this.COMMON.handleClose"
        :visible.sync="dialogFormVisible"
        width="30%"
      >
        <el-form ref="form" :model="form">
          <el-form-item label="快递公司：" :label-width="formLabelWidth" required>
            <dict-selectId
              @clearDictVal="clearExpress"
              @getDictVal="getExpressCompany2"
              v-bind:dictCode="'expressCompany'"
              v-bind:dictValue="form.expressCompanyId"
            ></dict-selectId>
          </el-form-item>
          <el-form-item label="客户号：" :label-width="formLabelWidth" required>
            <el-input v-model="form.customerName"></el-input>
          </el-form-item>
          <el-form-item label="客户秘钥：" :label-width="formLabelWidth">
            <el-input v-model="form.customerPwd"></el-input>
          </el-form-item>
          <el-form-item label="月结号：" :label-width="formLabelWidth">
            <el-input v-model="form.monthCode"></el-input>
          </el-form-item>
          <el-form-item label="所属网店：" :label-width="formLabelWidth">
            <el-input v-model="form.sendSite"></el-input>
          </el-form-item>
          <el-form-item label="快递员：" :label-width="formLabelWidth">
            <el-input v-model="form.sendStaff"></el-input>
          </el-form-item>
          <el-form-item label="是否生效：" prop="isValid" :label-width="formLabelWidth">
            <el-switch v-model="form.isValid" active-value="Y" inactive-value="N"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveExpressConfig()">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import dictSelectId from "@/components/common/DictDataSelectId.vue";
import { getWareHouseByExpressId } from "@/utils/baseRequest";
export default {
  name: "expressCustomerConfigManagement",
  data() {
    return {
      searchForm: {
        expressCompanyId: null,
        customerName: null,
        isValid: null
      },
      form: {
        expressCompanyId: null,
        customerName: null,
        customerPwd: null,
        monthCode: null,
        sendSite: null,
        sendStaff: null,
        isValid: "Y"
      },
      rows: [],
      row: null,
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
      gridData: [],
      dialogFormVisible: false,
      dialogTableVisible: false,
      formLabelWidth: "100px"
    };
  },

  components: {
    dictSelectId
  },

  methods: {
    handleList() {
      request({
        url: "/expressCustomerConfigManager/search",
        method: "post",
        params: this.searchForm
      }).then(res => {
        this.rows = res.data;
      });
    },
    saveExpressConfig() {
      if (
        this.form.expressCompanyId == null ||
        this.COMMON.checkInputNullOrEmpty(this.form.customerName)
      ) {
        this.$message({
          message: "'快递公司'或'客户号'不允许为空，请检查!",
          type: "warning"
        });
        return;
      }
      request({
        url: "/expressCustomerConfigManager/saveExpressConfig",
        method: "post",
        params: this.COMMON.formFormat(this.form) //表单日期格式化
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
        this.handleList();
      });
      this.dialogFormVisible = false;
    },
    handleClick(row) {
      getWareHouseByExpressId(row.id).then(response => {
        this.gridData = response.data;
      });
      this.dialogTableVisible = true;
    },
    getExpressCompany(val) {
      this.searchForm.expressCompanyId = val;
    },
    clearExpress() {
      this.form.expressCompanyId = null;
    },
    getExpressCompany2(val) {
      this.form.expressCompanyId = val;
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      return this.COMMON.dateFormat(date);
    },
    addConfig() {
      // this.dialogFormVisible = true;
      this.$router.push({ path: "modifyExpressCustomer" });
    },
    modifyConfig() {
      if (this.row == null) {
        this.$message({
          message: "请点击需要修改的行",
          type: "warning"
        });
        return;
      }
      this.$router.push({
        path: "modifyExpressCustomer",
        query: { row: this.row }
      });
    },
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
    }
  }
};
</script>