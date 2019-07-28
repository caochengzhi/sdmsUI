
<template>
  <div class="container">
    <div>
      <el-form :model="searchFrm" label-width="auto">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="PO：">
              <el-input v-model="searchForm.poNumber" placeholder="PO信息"></el-input>
            </el-form-item>
          </el-col>
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
            <el-form-item label="发车日期：">
              <el-date-picker
                v-model="searchForm.shipDate"
                align="right"
                type="date"
                placeholder="发车日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="车牌号：">
              <el-input v-model="searchForm.carNumber" placeholder="输入车牌号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="交易类型：">
              <dict-select @getDictVal="getIoType" v-bind:dictCode="'ioType'"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="是否入库：">
              <el-select v-model="searchForm.io_status" clearable>
                <el-option
                  v-for="im in ioOptions"
                  :key="im.value"
                  :label="im.label"
                  :value="im.value"
                ></el-option>
              </el-select>
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
    >
      <el-table-column fixed type="index" label="序号" width="55"></el-table-column>
      <el-table-column fixed prop="poNumber" label="PO" show-overflow-tooltip width="190">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.$index, scope.row)">{{scope.row.poNumber}}</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed prop="poLine" label="PO行"></el-table-column>
      <el-table-column fixed prop="ioType" label="交易类型"></el-table-column>
      <el-table-column prop="shipDate" label="发货日期" :formatter="dateFormat" width="150"></el-table-column>
      <el-table-column
        prop="scheduledArrivalDate"
        label="预计到货日期"
        :formatter="dateFormat"
        width="150"
      ></el-table-column>
      <el-table-column prop="actualArrivalDate" label="实际到货日期" :formatter="dateFormat" width="150"></el-table-column>
      <el-table-column prop="transactionDate" label="交易日期" :formatter="dateFormat" width="150"></el-table-column>
      <el-table-column prop="ioStatus" label="是否入库"></el-table-column>
      <el-table-column prop="transactionPiece" label="件数"></el-table-column>
      <el-table-column prop="transactionWeight" label="重量/斤"></el-table-column>
      <el-table-column prop="warehouse" label="到货仓库"></el-table-column>
      <el-table-column prop="carNumber" label="车牌号"></el-table-column>
      <el-table-column prop="driverName" label="司机姓名"></el-table-column>
      <el-table-column prop="driverPhone" label="司机电话" width="100"></el-table-column>
      <el-table-column prop="createdBy" label="创建人" width="100"></el-table-column>
      <el-table-column prop="lastUpdatedBy" label="更新人" width="100"></el-table-column>
      <el-table-column
        prop="created_date"
        :formatter="dateFormat"
        label="创建日期"
        sortable
        width="150"
      ></el-table-column>
      <el-table-column
        prop="lastUpdatedDate"
        :formatter="dateFormat"
        label="更新日期"
        sortable
        width="150"
      ></el-table-column>
      <el-table-column prop="remarks" label="备注" width="200" show-overflow-tooltip></el-table-column>
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
import { getItems } from "@/utils/baseRequest";
export default {
  name: "MaterialTransSearch",
  data() {
    return {
      searchForm: {
        itemId: null,
        poNumber: null,
        shipDate: null,
        carNumber: null,
        ioType: null,
        ioStatus: null
      },
      itemOptions: [],
      ioOptions: [
        {
          value: "N",
          label: "N"
        },
        {
          value: "Y",
          label: "Y"
        }
      ],
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
          },
          {
            text: "前天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },

  components: {
    dictSelect
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
    handleList() {},
    getIoType(val) {
      this.searchForm.ioType = val;
    }
  },

  watch: {}
};
</script>

