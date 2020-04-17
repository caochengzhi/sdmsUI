<template>
  <div>
    <div align="right" style="padding-bottom:5px;">
      <el-button-group>
        <el-button type="primary" icon="el-icon-lx-add" @click="addLine">新增档案信息</el-button>
        <el-button
          type="primary"
          icon="el-icon-lx-roundcheck"
          @click="save"
          v-has="'dictManagement-save'"
        >保 存</el-button>
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
          <el-select v-model="scope.row.itemId" placeholder="产品" @change="itemChanger(scope.row)">
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
      <el-table-column prop="vendorSpecificCode" label="客户规格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.vendorSpecificCode" placeholder="客户规格"></el-input>
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
</template>
    
<script>
import request from "@/utils/request";
import dictSelect from "@/components/common/DictDataSelect.vue";
import {
  getVendorArchiveListByVendorId,
  getItems,
  getItemSpecificByItemId
} from "@/utils/baseRequest";
export default {
  name: "SubVendorArchives",
  data() {
    return {
      itemOptions: [],
      tableData: []
    };
  },
  props: ["vendorId"],
  mounted() {
    getItems().then(response => {
      this.itemOptions = response.data.map(item => {
        return {
          value: item.itemId,
          label: item.item
        };
      });
    });

    if (this.vendorId != null) {
      getVendorArchiveListByVendorId(this.vendorId)
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
    //添加行数
    addLine() {
      var newValue = {
        itemId: null,
        vendorId: this.vendorId,
        itemSpecificId: null,
        vendorSpecificCode: null,
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
        url: "/vendorsManager/saveVendorArchive",
        method: "post",
        data: this.tableData
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
        if (res.data.code == "200") {
          this.COMMON.closeTagAndGoBack("modifyVendor", this.$router);
        }
      });
    }
  }
};
</script>