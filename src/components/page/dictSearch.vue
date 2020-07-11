<template>
  <div class="container">
    <div>
      <el-form ref="searchForm" :model="searchForm" label-width="auto" size="mini">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="字典名称：">
              <el-input v-model="searchForm.dictName" placeholder="字典名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="字典编码：">
              <el-input v-model="searchForm.dictCode" placeholder="字典编码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-lx-search"
            v-has="'dictManagement-search'"
            @click="handleDictList"
          >查 询</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-add"
            v-has="'dictManagement-add'"
            @click="addDictType"
          >新 增</el-button>
          <el-button
            type="primary"
            icon="el-icon-lx-settings"
            v-has="'dictManagement-modify'"
            @click="modifyDictType"
          >修 改</el-button>
        </el-button-group>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="rows"
      border
      height="300"
      highlight-current-row
      :header-cell-style="{background:'#f4f4f4'}"
      element-loading-text="表格加载中..."
      stripe
      @current-change="getRowDatas"
    >
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="dictName" label="字典名称">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.$index, scope.row)">{{scope.row.dictName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="dictCode" label="字典编码"></el-table-column>
      <el-table-column prop="isValid" label="是否生效" width="70"></el-table-column>
      <el-table-column prop="remarks" label="备注信息"></el-table-column>
      <el-table-column prop="lastUpdatedDate" :formatter="dateFormat" label="更新日期" sortable></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">字典维护</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
    </div>

    <div>
      <!-- Form -->
      <el-dialog title="字典管理" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="字典名称" prop="dictName" :label-width="formLabelWidth">
            <el-input v-model="form.dictName" :disabled="typeof this.form.dictId != 'undefined'"></el-input>
          </el-form-item>
          <el-form-item label="字典编码" prop="dictCode" :label-width="formLabelWidth">
            <el-input v-model="form.dictCode" :disabled="typeof this.form.dictId != 'undefined'"></el-input>
          </el-form-item>
          <el-form-item label="备注信息" prop="remarks" :label-width="formLabelWidth">
            <el-input v-model="form.remarks"></el-input>
          </el-form-item>
          <el-form-item label="是否生效" prop="isValid" :label-width="formLabelWidth">
            <el-switch v-model="form.isValid" active-value="Y" inactive-value="N"></el-switch>
          </el-form-item>
          <el-input v-model="form.dictId" type="hidden"></el-input>
          <el-input v-model="form.organizationId" type="hidden"></el-input>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveDictType('form')">保 存</el-button>
        </div>
      </el-dialog>

      <!--table-->
      <el-dialog title="字典明细" :visible.sync="dialogTableVisible" center>
        <el-table :data="gridData">
          <el-table-column property="dictDataName" label="字典键值" width="150"></el-table-column>
          <el-table-column property="dictDataCode" label="字典标签" width="200"></el-table-column>
          <el-table-column property="remarks" label="备注"></el-table-column>
          <el-table-column property="isValid" label="是否有效"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
  <script>
import request from "@/utils/request";
import { getDictDatasByDictId } from "@/utils/baseRequest";
export default {
  name: "dictManagement",
  data() {
    return {
      searchForm: {
        dictName: null,
        dictCode: null
      },
      form: {
        dictId: null,
        dictName: null,
        dictCode: null,
        isValid: null,
        organizationId: null,
        remarks: null
      },
      rules: {
        dictName: [{ required: true, message: "不允许为空" }],
        dictCode: [{ required: true, message: "不允许为空" }]
      },
      currentPage: 1, //初始页
      pageSize: 15, //每页的数据
      count: 0,
      loading: false,
      rows: [],
      gridData: [],
      row: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "80px"
    };
  },

  methods: {
    dateFormat: function(row, column) {
      var date = row[column.property];
      return this.COMMON.dateFormat(date);
    },
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleDictList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleDictList();
    },
    handleDictList() {
      this.loading = true;
      this.$set(this.searchForm, "pageNum", this.currentPage);
      this.$set(this.searchForm, "pageSize", this.pageSize);
      request({
        url: "/dictManagement/search",
        method: "post",
        params: this.searchForm
      }).then(res => {
        this.rows = res.data.list;
        this.count = res.data.total;
        this.currentPage = res.data.pageNum;
        this.loading = false;
      });
    },
    addDictType() {
      this.dialogFormVisible = true;
      this.form = {};
    },
    modifyDictType() {
      if (this.row == null) {
        this.$message({
          message: "请点击需要修改的行",
          type: "warning"
        });
        return;
      }
      this.dialogFormVisible = true;
      //this.form = this.row;
      this.form = Object.assign({}, this.row);
    },
    saveDictType(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/dictManagement/saveDictType",
            method: "post",
            params: this.COMMON.formFormat(this.form) //表单日期格式化
          }).then(res => {
            this.$message({
              message: res.data.msg,
              type: res.data.code == "200" ? "success" : "error"
            });
            this.handleDictList();
          });
          this.dialogFormVisible = false;
        }
      });
    },
    handleView(index, row) {
      getDictDatasByDictId(row.dictId).then(response => {
        this.gridData = response.data;
      });
      this.dialogTableVisible = true;
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "modifyDictData",
        query: { dictId: row.dictId }
      });
    }
  }
};
</script>

