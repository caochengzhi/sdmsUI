<template>
  <div>
    <div style="margin-bottom:5px;">
      <el-button type="danger" icon="el-icon-lx-add" @click="addLine">增加规格明细</el-button>
      <el-tooltip placement="top">
        <div slot="content">
          规格明细的总件数相加需等于PO总件数
          <br />规则明细的总重量相加需等于PO净重
          <br />规格、件数、重量、单价不允许为空
        </div>
        <el-button align="right" icon="el-icon-question">规则说明</el-button>
      </el-tooltip>
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
      <el-table-column prop="itemGradeId" label="产品等级">
        <template slot-scope="scope">
          <el-select v-model="scope.row.itemGradeId" placeholder="请选择(必填)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="pieceNum" label="件数">
        <template slot-scope="scope">
          <el-input
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="scope.row.pieceNum"
            placeholder="件数(必填)"
            @change="changeInput"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量">
        <template slot-scope="scope">
          <el-input
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="scope.row.weight"
            placeholder="重量(必填)"
            @change="changeInput"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价">
        <template slot-scope="scope">
          <el-input
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="scope.row.unitPrice"
            placeholder="单价(必填)"
            @change="changeInput"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remarks" placeholder="备注"></el-input>
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
import { getDictDatasByDictCode } from "@/utils/baseRequest";
export default {
  name: "addPoLine",
  data() {
    return {
      tableData: [],
      options: []
    };
  },
  mounted() {
    getDictDatasByDictCode("itemGrades").then(response => {
      this.options = response.data.map(item => {
        return {
          value: item.id,
          label: item.dictDataName
        };
      });
    });
  },
  methods: {
    //添加行数
    addLine() {
      var newValue = {
        itemGradeId: null,
        pieceNum: null,
        unitPrice: null,
        weight: null,
        remarks: null
      };
      //添加新的行数
      this.tableData.push(newValue);
      this.$emit("getPoLines", this.tableData);
    },
    //删除行数
    handleDelete(index) {
      this.tableData.splice(index, 1);
    },
    changeInput(value) {
      this.$emit("getPoLines", this.tableData);
    }
  }
};
</script>