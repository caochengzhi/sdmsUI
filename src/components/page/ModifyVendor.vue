<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <div align="right" style="padding-bottom:5px;">
          <el-popover placement="top" width="160" v-model="visible">
            <p>确定执行此操作？</p>
            <div style="text-align: center; margin: 0">
              <el-button type="info" @click="visible = false">取消</el-button>
              <el-button type="primary" @click="saveOrUpdateVendor('form')">确定</el-button>
            </div>
            <el-button type="primary" slot="reference" icon="el-icon-lx-roundcheck">保存</el-button>
          </el-popover>
        </div>
        <el-form ref="form" :rules="rules" :model="form" label-width="auto">
          <el-row :gutter="50">
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="供应商名称：" prop="vendorName">
                <el-input v-model="form.vendorName" placeholder="供应商名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="供应商等级：">
                <dict-select
                  @getDictVal="getvendorGrade"
                  v-bind:dictCode="'GradeList'"
                  v-bind:dictValue="form.vendorClass"
                ></dict-select>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="供应商评分：">
                <el-rate v-model="form.vendorScore" show-text></el-rate>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="供应商编码：" prop="vendorCode">
                <el-input v-model="form.vendorCode" placeholder="供应商编码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="联系人：">
                <el-input v-model="form.vendorContacts" placeholder="联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="供应商电话：">
                <el-input v-model="form.vendorPhone" placeholder="电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="供应商传真：">
                <el-input v-model="form.facsimile" placeholder="传真"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="供应商邮箱：">
                <el-input v-model="form.vendorEmail" placeholder="邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="供应商网址：">
                <el-input v-model="form.network" placeholder="网址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
              <el-form-item label="供应商地址：">
                <el-input v-model="form.vendorAddress" placeholder="地址"></el-input>
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
        </el-form>
        <div>
          <div align="left" style="padding-bottom:5px;">
            <el-button type="primary" icon="el-icon-lx-add" @click="addWareHouseLine">添加仓库</el-button>
          </div>
          <el-table
            :data="warehouseTableData"
            style="width: 100%"
            border
            highlight-current-row
            :header-cell-style="{background:'#f4f4f4'}"
            element-loading-text="表格加载中..."
            stripe
          >
            <el-table-column prop="warehouse" label="仓库名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.warehouse" placeholder="仓库名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="warehouseAddress" label="仓库地址">
              <template slot-scope="scope">
                <el-input v-model="scope.row.warehouseAddress" placeholder="仓库地址"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="仓库类别">
              <template slot-scope="scope">
                <el-select v-model="scope.row.warehouseType" placeholder="仓库类别">
                  <el-option
                    v-for="item in warehouseTypeOptions"
                    :key="item.index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
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
        </div>
      </el-tab-pane>
      <el-tab-pane label="档案信息" name="second">
        <vendor-archives v-bind:vendorId="subVendorId"></vendor-archives>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import dictSelect from "@/components/common/DictDataSelect.vue";
import vendorArchives from "@/components/page/SubVendorArchives.vue";
import { getVendorWarehouseListByVendorId } from "@/utils/baseRequest";
export default {
  name: "modifyVendor",
  data() {
    return {
      form: {
        id: null,
        vendorName: null,
        vendorClass: null,
        vendorScore: null,
        vendorCode: null,
        vendorContacts: null,
        vendorPhone: null,
        facsimile: null,
        vendorAddress: null,
        vendorEmail: null,
        network: null,
        remarks: null,
        isValid: "Y"
      },
      subVendorId: null,
      visible: false,
      activeName: "first",
      warehouseTableData: [],
      warehouseTypeOptions: [
        {
          value: 0,
          label: "内仓"
        },
        {
          value: 1,
          label: "外仓"
        }
      ],
      rules: {
        vendorName: [{ required: true, message: "供应商名称不允许为空" }],
        vendorCode: [{ required: true, message: "供应商编码不允许为空" }]
      }
    };
  },
  components: {
    dictSelect,
    vendorArchives
  },

  created() {
    const row = this.$route.query.row;
    if (typeof row != "undefined") {
      this.form = row;
      this.subVendorId = this.form.id;
    }
  },
  mounted() {
    const vendorId = this.form.id;
    if (vendorId != null) {
      getVendorWarehouseListByVendorId(vendorId)
        .then(response => {
          this.warehouseTableData = response.data;
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
    getvendorGrade(val) {
      this.form.vendorClass = val;
    },
    changeSwitch(val) {
      this.form.isValid = val;
    },
    saveOrUpdateVendor(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/vendorsManager/saveVendor",
            method: "post",
            params: this.COMMON.formFormat(this.form), //表单日期格式化
            data: this.warehouseTableData
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
    //添加库存行数
    addWareHouseLine() {
      var newValue = {
        vendorId: this.form.id,
        warehouse: null,
        warehouseAddress: null,
        warehouseType: null,
        isValid: "Y"
      };
      //添加新的行数
      this.warehouseTableData.push(newValue);
    },
    //删除行数
    handleDelete(index) {
      var id = this.warehouseTableData[index].id;
      if (typeof id != "undefined") {
        this.$message({
          message: "已保存数据，不允许删除，请做失效处理",
          type: "warning"
        });
        return;
      } else {
        this.warehouseTableData.splice(index, 1);
      }
    }
  }
};
</script>