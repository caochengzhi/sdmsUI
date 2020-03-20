<template>
  <div class="container">
    <div>
      <el-form ref="searchForm" :model="searchForm" :rules="rules" label-width="auto">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="客户选择:" prop="customerId">
              <dict-selectId @getDictVal="getCustomerList" v-bind:dictCode="'customerList'"></dict-selectId>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="订单操作:" prop="operateType">
              <el-select v-model="searchForm.operateType">
                <el-option
                  v-for="item in options"
                  :key="item.index"
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
            v-has="'customerOrderExcelConfig-search'"
            @click="handleExcelConfigList('searchForm')"
          >查 询</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-add"
            v-has="'customerOrderExcelConfig-add'"
            @click="addExcelConfig('searchForm')"
          >新 增</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-settings"
            v-has="'customerOrderExcelConfig-save'"
            @click="saveExcelConfig"
          >保 存</el-button>
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
      <el-table-column prop="customerId" label="客户ID" width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.customerId" placeholder="客户ID" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="operateType" label="操作类型" width="95">
        <template slot-scope="scope">
          <el-input v-model="scope.row.operateType" placeholder="操作类型" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="codeField" label="表字段" width="150">
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
      <el-table-column prop="codeDesc" label="业务字段">
        <template slot-scope="scope">
          <el-input v-model="scope.row.codeDesc" placeholder="业务字段"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="codeRelation" label="对应关系">
        <template slot-scope="scope">
          <el-input v-model="scope.row.codeRelation" placeholder="对应关系"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注信息">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="导出顺序" width="80">
        <template slot-scope="scope">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model="scope.row.position"
            placeholder="数字"
          ></el-input>
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
import { getOrderFieldList } from "@/utils/baseRequest";
import dictSelectId from "@/components/common/DictDataSelectId.vue";
export default {
  name: "CustomerOrderExcelConfig",
  data() {
    return {
      searchForm: {
        customerId: null,
        operateType: null
      },
      rules: {
        customerId: [
          { required: true, message: "客户列表不允许为空", trigger: "change" }
        ],
        operateType: [
          { required: true, message: "操作类型不允许为空", trigger: "change" }
        ]
      },
      options: [
        {
          value: "INPUT",
          label: "导入"
        },
        {
          value: "OUTPUT",
          label: "导出"
        }
      ],
      fieldOptions: [],
      tableData: []
    };
  },

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
    handleExcelConfigList(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let para = {
            customerId: this.searchForm.customerId,
            operateType: this.searchForm.operateType
          };
          request({
            url: "/customerOrderExcelConfig/search",
            method: "post",
            params: para
          }).then(res => {
            this.tableData = res.data;
          });
        }
      });
    },
    //添加新的行数
    addExcelConfig(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var newValue = {
            codeField: null,
            codeDesc: null,
            remark: null,
            codeRelation: null,
            position: null,
            customerId: this.searchForm.customerId,
            operateType: this.searchForm.operateType,
            isValid: "Y"
          };
          this.tableData.push(newValue);
        }
      });
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
      //保存之前判断itemSpecificId是否已配置
      let hasItemSpecific = false;
      let hasCodeRelation = true;
      let fieldIsNull = true;
      let codeIsNull = true;
      this.tableData.forEach(item => {
        if ("itemSpecificId" === item.codeField) {
          if (
            item.codeRelation == null ||
            item.codeRelation.split(" ").join("").length === 0
          ) {
            hasCodeRelation = false;
          }
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
          message: "表字段‘中‘itemSpecificId’未配置，请检查",
          type: "warning"
        });
        return;
      }
      if (!hasCodeRelation) {
        this.$message({
          message:
            "表字段等于‘itemSpecificId’所在行的’对应关系‘字段不允许为空，请检查",
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
        url: "/customerOrderExcelConfig/saveCustomerOrderConfigs",
        method: "post",
        data: this.tableData
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
        this.handleExcelConfigList("searchForm");
      });
    },
    getCustomerList(val) {
      this.searchForm.customerId = val;
    }
  }
};
</script>
