<template>
  <div class="container">
    <div>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-lx-add"
            v-has="'customerManagement-configAdd'"
            @click="addExcelConfig"
          >新增配置字段</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-roundcheck"
            v-has="'customerManagement-configSave'"
            @click="saveExcelConfig"
          >保存配置</el-button>
        </el-button-group>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      highlight-current-row
      :header-cell-style="{background:'#f4f4f4'}"
      element-loading-text="表格加载中..."
      stripe
    >
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="customerId" label="客户ID" width="80" v-if="colShow">
        <template slot-scope="scope">
          <el-input v-model="scope.row.customerId" placeholder="客户ID" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="operateType" label="操作类型" width="95" v-if="colShow">
        <template slot-scope="scope">
          <el-input v-model="scope.row.operateType" placeholder="操作类型" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="codeField" label="系统字段">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.codeField"
            allow-create
            filterable
            default-first-option
            @change="currentSel"
          >
            <el-option
              v-for="item in fieldOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="codeDesc" label="客户字段">
        <template slot-scope="scope">
          <el-input v-model="scope.row.codeDesc" placeholder="业务字段"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注信息">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remarks" placeholder="备注"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="isValid" label="是否有效" width="75">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isValid" active-value="Y" inactive-value="N"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="bookbuytime" width="70" label>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            v-if="!scope.row.editing"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import { getOrderFieldList, getCustomerList } from "@/utils/baseRequest";
import dictSelectId from "@/components/common/DictDataSelectId.vue";
export default {
  name: "CustomerOrderExcelConfig",
  data() {
    return {
      colShow: false,
      fieldOptions: [],
      tableData: [],
      customersOptions: []
    };
  },
  props: ["customerId"],
  components: {
    dictSelectId
  },

  mounted() {
    //获取订单字段列表
    getOrderFieldList().then(response => {
      this.fieldOptions = response.data.map(item => {
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
    this.handleExcelConfigList();
  },

  methods: {
    //增加验证，配置字段不允许重复
    currentSel(val) {
      let duplicate = false;
      this.tableData.forEach(item => {
        if (item.codeField == val) {
          if (!duplicate) {
            duplicate = true;
          } else {
            this.$message({
              message: val + "字段已配置，不允许重复配置",
              type: "warning"
            });
            item.codeField = null;
          }
        }
      });
    },
    handleExcelConfigList() {
      if (this.customerId == null) {
        return;
      }
      let para = {
        customerId: this.customerId
      };
      request({
        url: "/orderManagement/orderExcelConfigsearch",
        method: "post",
        params: para
      }).then(res => {
        this.tableData = res.data;
      });
    },
    //添加新的行数
    addExcelConfig() {
      var newValue = {
        codeField: null,
        codeDesc: null,
        remarks: null,
        customerId: this.customerId,
        operateType: "INPUT",
        isValid: "Y"
      };
      this.tableData.push(newValue);
    },
    //删除行数
    handleDelete(index, row) {
      var id = row.id;
      if (typeof id != "undefined") {
        this.$message({
          message: "已保存数据，不允许删除，请做失效处理",
          type: "warning"
        });
        return;
      } else {
        this.tableData.splice(index, 1);
      }
    },
    saveExcelConfig() {
      //保存之前判断规格信息是否已配置
      let hasItemSpecific = false;
      let fieldIsNull = true;
      let codeIsNull = true;
      this.tableData.forEach(item => {
        if ("customerItemSpecific" === item.codeField && "Y" === item.isValid) {
          hasItemSpecific = true;
        }
        if (
          item.codeDesc == null ||
          item.codeDesc.split(" ").join("").length === 0
        ) {
          codeIsNull = false;
        }
        if (item.codeField == null) {
          fieldIsNull = false;
        }
      });
      if (!hasItemSpecific) {
        this.$message({
          message: "‘产品规格信息’未配置或不允许做失效处理，请检查",
          type: "warning"
        });
        return;
      }
      if (!codeIsNull || !fieldIsNull) {
        this.$message({
          message: "’表字段‘或’业务字段‘不允许为空，请检查",
          type: "warning"
        });
        return;
      }
      request({
        url: "/orderManagement/saveCustomerOrderConfigs",
        method: "post",
        data: this.tableData
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
        this.handleExcelConfigList();
      });
    }
  }
};
</script>
