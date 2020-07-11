<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <div align="right" style="padding-bottom:5px;">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-lx-settings"
              v-has="'itemManagement-save'"
              @click="updateItem"
            >更 新</el-button>
          </el-button-group>
        </div>
        <el-form ref="itemForm" :model="itemForm" label-width="auto">
          <el-row :gutter="10">
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="产品：">
                <el-input v-model="itemForm.item" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="6" :md="2" :lg="7" :xl="1">
              <el-form-item label="描述：">
                <el-input v-model="itemForm.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="产品规格配置">
        <div align="right" style="padding-bottom:5px;">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-lx-add"
              v-has="'itemManagement-add'"
              @click="addItemConfig"
            >新增规格</el-button>
            <el-button
              type="primary"
              icon="el-icon-lx-settings"
              v-has="'itemManagement-save'"
              @click="saveItemConfig"
            >保 存</el-button>
          </el-button-group>
        </div>

        <el-table
          :data="tableData"
          border
          highlight-current-row
          :header-cell-style="{background:'#f4f4f4'}"
          element-loading-text="表格加载中..."
          stripe
        >
          <el-table-column prop="id" label="规格ID">
            <template slot-scope="scope">
              <el-input v-model="scope.row.id" placeholder="规格ID" readonly></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="item" label="产品">
            <template slot-scope="scope">
              <el-input v-model="scope.row.item" placeholder="产品" readonly></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="gradeId" label="产品等级(不允许修改)">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.gradeId"
                placeholder="等级"
                @change="changeOption(scope.row)"
              >
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="standardId" label="包装规格(不允许修改)">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.standardId"
                placeholder="请选择(必填)"
                @change="changeOption(scope.row)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="规格净重(斤)" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.netWeight" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="规格名称">
            <template slot-scope="scope">
              <el-input v-model="scope.row.specificCode" placeholder="规格名称"></el-input>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import { getDictDatasByDictCode } from "@/utils/baseRequest";
export default {
  name: "ModifyItem",
  data() {
    return {
      activeName: "first",
      itemForm: {
        item: null,
        itemId: null,
        remarks: null
      },
      tableData: [],
      options: [],
      gradeOptions: []
    };
  },
  created() {
    getDictDatasByDictCode("standards").then(response => {
      this.options = response.data.map(item => {
        return {
          value: item.id,
          label: item.dictDataName
        };
      });
    });
    getDictDatasByDictCode("itemGrades").then(response => {
      this.gradeOptions = response.data.map(item => {
        return {
          value: item.id,
          label: item.dictDataName
        };
      });
    });
  },
  mounted() {
    const row = this.$route.query.row;
    if (typeof row != "undefined") {
      this.itemForm = row;
    }
    this.handleItemSpecificList();
  },

  methods: {
    changeOption(row) {
      var id = row.id;
      if (typeof id != "undefined") {
        this.$message({
          message: "无效操作！此数据修改无效！",
          type: "error"
        });
        return;
      }
    },
    handleItemSpecificList() {
      let para = {
        itemId: this.itemForm.itemId
      };
      request({
        url: "/itemManagement/searchItemSpecific",
        method: "post",
        params: para
      }).then(res => {
        this.tableData = res.data;
      });
    },
    //添加新的行数
    addItemConfig() {
      var newValue = {
        itemId: this.itemForm.itemId,
        item: this.itemForm.item,
        standardId: null,
        gradeId: null,
        remarks: null,
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
    saveItemConfig() {
      request({
        url: "/itemManagement/saveItemSpecific",
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
    },
    updateItem() {
      request({
        url: "/itemManagement/updateItem",
        method: "post",
        params: this.COMMON.formFormat(this.itemForm) //表单日期格式化
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