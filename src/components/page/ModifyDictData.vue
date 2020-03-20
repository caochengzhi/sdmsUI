<template>
  <div class="container">
    <div align="right" style="padding-bottom:5px;">
      <el-button-group>
        <el-button type="primary" icon="el-icon-lx-add" @click="addLine">插入行</el-button>
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
      <el-table-column prop="dictDataName" label="字典键值">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.dictDataName"
            placeholder="字典键值"
            @input.native="changeVal(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="dictDataCode" label="字典标签">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.dictDataCode"
            placeholder="字典标签"
            @input.native="changeVal(scope.row)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remarks" placeholder="备注"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="isValid" label="是否生效" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isValid" active-value="Y" inactive-value="N"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="bookbuytime" width="70" label="操作">
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
import { getDictDatasByDictId } from "@/utils/baseRequest";
export default {
  name: "modifyDictData",
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    const dictId = this.$route.query.dictId;
    getDictDatasByDictId(dictId)
      .then(response => {
        this.tableData = response.data;
      })
      .catch(error => {
        this.$message({
          message: error,
          type: "error"
        });
      });
  },
  methods: {
    changeVal(row) {
      var id = row.id;
      if (typeof id != "undefined") {
        this.$message({
          message: "无效操作！此数据修改无效！",
          type: "error"
        });
        return;
      }
    },
    //添加行数
    addLine() {
      var newValue = {
        dictDataName: null,
        dictDataCode: null,
        remarks: null,
        dictId: this.$route.query.dictId,
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
        url: "/dictManagement/saveDictDatas",
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
