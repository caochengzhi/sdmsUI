<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息配置" name="first">
        <el-form ref="form" :rules="rules" :model="form" label-width="auto">
          <el-row :gutter="50">
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="客户名称：" prop="customerName">
                <el-input v-model="form.customerName" placeholder="客户名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="客户等级：">
                <dict-select
                  @getDictVal="getCustomerGrade"
                  v-bind:dictCode="'GradeList'"
                  v-bind:dictValue="form.customerClass"
                ></dict-select>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="客户评分：">
                <el-rate v-model="form.customerScore" show-text></el-rate>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="客户编码：" prop="customerCode">
                <el-input v-model="form.customerCode" placeholder="客户编码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="联系人：">
                <el-input v-model="form.customerContacts" placeholder="联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="客户电话：">
                <el-input v-model="form.customerPhone" placeholder="电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="客户传真：">
                <el-input v-model="form.facsimile" placeholder="传真"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="客户邮箱：">
                <el-input v-model="form.customerEmail" placeholder="邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="客户网址：">
                <el-input v-model="form.network" placeholder="网址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="客户地址：">
                <el-input v-model="form.customerAddress" placeholder="地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="备注：">
                <el-input v-model="form.remarks" placeholder="备注"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="是否有效：">
                <el-switch
                  v-model="form.isValid"
                  active-value="Y"
                  inactive-value="N"
                  @change="changeSwitch"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item align="right">
            <el-popover placement="top" width="160" v-model="visible">
              <p>确定执行此操作？</p>
              <div style="text-align: center; margin: 0">
                <el-button type="info" @click="visible = false">取消</el-button>
                <el-button type="primary" @click="saveOrUpdateCustomer('form')">确定</el-button>
              </div>
              <el-button
                type="primary"
                slot="reference"
                icon="el-icon-lx-roundcheck"
                v-has="'customerManagement-save'"
              >保存</el-button>
            </el-popover>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="档案信息配置" name="second" v-loading="loading" element-loading-text="订单匹配中...">
        <div align="right" style="padding-bottom:5px;">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-lx-add"
              @click="addLine"
              v-has="'customerManagement-addArchive'"
            >新增档案信息</el-button>
            <el-button
              type="primary"
              icon="el-icon-lx-roundcheck"
              @click="save"
              v-has="'customerManagement-save'"
            >保 存</el-button>
            <el-button
              type="primary"
              icon="el-icon-lx-refresh"
              @click="orderMatch"
              v-has="'customerManagement-orderMatch'"
            >订单刷新</el-button>
          </el-button-group>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          highlight-current-row
          :header-cell-style="{background:'#f4f4f4'}"
          element-loading-text="表格加载中..."
          stripe
        >
          <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
          <el-table-column prop="item" label="产品">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.itemId"
                placeholder="产品"
                @change="itemChanger(scope.row)"
              >
                <el-option
                  v-for="im in itemOptions"
                  :key="im.value"
                  :label="im.label"
                  :value="im.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="itemSpecificId" label="系统规格">
            <template slot-scope="scope">
              <el-select v-model="scope.row.itemSpecificId" placeholder="请选择">
                <el-option
                  v-for="item in scope.row.itemSpecificOptions"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>&nbsp;
              <el-tag>{{scope.row.specificCode}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="customerSpecificCode" label="客户规格">
            <template slot-scope="scope">
              <el-input v-model="scope.row.customerSpecificCode" placeholder="客户规格"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="isValid" label="是否生效" width="80">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isValid" active-value="Y" inactive-value="N"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="operation" width="70" label="操作">
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
      </el-tab-pane>
      <el-tab-pane label="订单字段配置" name="thrid">
        <customer-orderExcelConfig v-bind:customerId="subCustomerId"></customer-orderExcelConfig>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import customerOrderExcelConfig from "@/components/page/CustomerOrderExcelConfig.vue";
import dictSelect from "@/components/common/DictDataSelect.vue";
import {
  getCustomerArchivesByCustomerId,
  getItems,
  getItemSpecificByItemId
} from "@/utils/baseRequest";
export default {
  name: "modifyCustomer",
  data() {
    return {
      form: {
        id: null,
        customerName: null,
        customerClass: null,
        customerScore: null,
        customerCode: null,
        customerContacts: null,
        customerPhone: null,
        facsimile: null,
        customerAddress: null,
        customerEmail: null,
        network: null,
        remarks: null,
        isValid: "Y"
      },
      subCustomerId: null,
      loading: false,
      visible: false,
      activeName: "first",
      itemOptions: [],
      tableData: [],
      rules: {
        customerName: [{ required: true, message: "客户名称不允许为空" }],
        customerCode: [{ required: true, message: "客户编码不允许为空" }]
      }
    };
  },
  components: {
    dictSelect,
    customerOrderExcelConfig
  },

  created() {
    const row = this.$route.query.row;
    if (typeof row != "undefined") {
      this.form = row;
      this.subCustomerId = this.form.id;
    }
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

    if (this.form.id != null) {
      getCustomerArchivesByCustomerId(this.form.id)
        .then(response => {
          this.tableData = response.data;
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    }
  },

  methods: {
    itemChanger(row) {
      row.itemSpecificOptions = [];
      row.itemSpecificId = null;
      if (row.itemId != "") {
        getItemSpecificByItemId(row.itemId).then(response => {
          row.itemSpecificOptions = response.data.map(item => {
            return {
              value: item.id,
              label: item.specificCode
            };
          });
        });
      }
    },
    getCustomerGrade(val) {
      this.form.customerClass = val;
    },
    changeSwitch(val) {
      this.form.isValid = val;
    },
    //失效订单重新匹配，用户重新维护了档案信息可以执行此操作
    orderMatch() {
      this.loading = true;
      request({
        url: "/orderManagement/orderMatch",
        method: "post",
        params: { customerId: this.form.id }
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
        this.loading = false;
      });
    },
    saveOrUpdateCustomer(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/customersManager/saveCustomer",
            method: "post",
            params: this.COMMON.formFormat(this.form) //表单日期格式化
          }).then(res => {
            this.$message({
              message: res.data.msg,
              type: res.data.code == "200" ? "success" : "error"
            });
            this.visible = false;
            if (res.data.code == "200") {
              this.COMMON.closeTagAndGoBack(this.$options.name, this.$router);
            }
          });
        }
      });
    },
    //添加行数
    addLine() {
      if (this.form.id == null) {
        this.$message({
          message: "客户基本信息未保存，请检查",
          type: "warning"
        });
        return;
      }
      var newValue = {
        itemId: null,
        customerId: this.form.id,
        itemSpecificId: null,
        customerSpecificCode: null,
        isValid: "Y"
      };
      //添加新的行数
      this.tableData.push(newValue);
    },
    //删除行数
    handleDelete(index) {
      var id = this.tableData[index].id;
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
    save() {
      request({
        url: "/customersManager/saveCustomerArchive",
        method: "post",
        data: this.tableData
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
        if (res.data.code == "200") {
          this.COMMON.closeTagAndGoBack(this.$options.name, this.$router);
        }
      });
    }
  }
};
</script>