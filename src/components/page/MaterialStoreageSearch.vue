<template>
  <div class="container">
    <div>
      <el-form :model="searchForm" label-width="auto">
        <el-form-item align="right">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-circle-check-outline"
              v-has="'storageManagement-handOutStock'"
              @click="outStock"
            >出库</el-button>
          </el-button-group>
        </el-form-item>

        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="产品：">
              <el-select v-model="searchForm.itemId" clearable>
                <el-option
                  v-for="im in itemOptions"
                  :key="im.value"
                  :label="im.label"
                  :value="im.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="仓库：">
              <dict-select @getDictVal="getWarehouse" v-bind:dictCode="'warehouse'"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="入库时间：">
              <el-date-picker
                v-model="searchForm.createdDate"
                align="right"
                type="date"
                placeholder="入库时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="库存类别：">
              <dict-selectId @getDictVal="getInventoryType" v-bind:dictCode="'inventoryType'"></dict-selectId>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item align="right">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-lx-search"
              v-has="'transactionManagement-search'"
              @click="handleList"
            >查 询</el-button>
            <el-button type="primary" @click="restFrm" icon="el-icon-lx-forward">重 置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="rows"
      border
      height="300"
      highlight-current-row
      :header-cell-style="{background:'#f4f4f4'}"
      element-loading-text="表格加载中..."
      stripe
      @current-change="getRowDatas"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="55"></el-table-column>
      <el-table-column fixed type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="item" label="产品" width="70"></el-table-column>
      <el-table-column prop="specificName" label="规格"></el-table-column>
      <el-table-column prop="netWeightPerUnit" label="单件净重"></el-table-column>
      <el-table-column prop="warehouseName" label="仓库"></el-table-column>
      <el-table-column prop="pieceNum" label="库存件数"></el-table-column>
      <el-table-column prop="netWeight" label="总重量/斤"></el-table-column>
      <el-table-column prop="inventoryType" label="库存类别"></el-table-column>
      <el-table-column prop="createdDate" label="最近入库时间" :formatter="dateFormat" width="150"></el-table-column>
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
  </div>
</template>
  
<script>
import request from "@/utils/request";
import dictSelect from "@/components/common/DictDataSelect.vue";
import dictSelectId from "@/components/common/DictDataSelectId.vue";
import { getItems } from "@/utils/baseRequest";
export default {
  name: "MaterialStoreageSearch",
  data() {
    return {
      searchForm: {
        itemId: null,
        warehouse: null,
        createdDate: null,
        inventoryTypeId: null
      },
      currentPage: 1, //初始页
      pageSize: 15, //每页的数据
      count: 0,
      rows: [],
      storeIds: [],
      itemOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },

  components: {
    dictSelect,
    dictSelectId
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
  },

  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
      this.handleList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handleList();
    },
    handleList() {
      let para = {
        itemId: this.searchForm.itemId,
        warehouse: this.searchForm.warehouse,
        createdDate: this.searchForm.createdDate,
        inventoryTypeId: this.searchForm.inventoryTypeId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        sortName: "created_date",
        sortOrder: "desc"
      };
      request({
        url: "/storeManagement/search",
        method: "post",
        params: para
      }).then(res => {
        this.rows = res.data.list;
        this.count = res.data.total;
        this.currentPage = res.data.pageNum;
      });
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      return this.COMMON.dateFormat(date);
    },
    getWarehouse(val) {
      this.searchForm.warehouse = val;
    },
    getInventoryType(val) {
      this.searchForm.inventoryTypeId = val;
    },
    //用户选择行的id存入数组
    handleSelectionChange(rows) {
      this.storeIds = [];
      rows.forEach(row => {
        this.storeIds.push(row.storeIds);
      });
    },
    restFrm() {
      this.searchForm = {};
    },
    //出库
    outStock() {
      if (this.storeIds.length == 0) {
        this.$message({
          message: "请选择待出库的行",
          type: "warning"
        });
        return false;
      }
      let para = {
        storeIds: JSON.stringify(this.storeIds)
      };
      request({
        url: "/storeManagement/outStock",
        method: "post",
        params: para
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: res.data.code == "200" ? "success" : "error"
        });
        this.handleList();
      });
    }
  }
};
</script>
