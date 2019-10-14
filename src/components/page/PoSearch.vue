<template>
  <div class="container">
    <div>
      <el-form ref="form" :model="searchForm" label-width="auto">
        <el-form-item align="right">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              v-has="'poManagement-input'"
              @click="addPo"
            >PO手工录入</el-button>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="autoCreateTransInfo"
            >自动创建发车信息</el-button>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              v-has="'poManagement-create'"
              @click="handCreateTransInfo"
            >手工创建发车信息</el-button>
          </el-button-group>
        </el-form-item>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="PO：">
              <el-input v-model="searchForm.poNumber" placeholder="PO"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="产地：">
              <dict-select @getDictVal="getOriginPlace" v-bind:dictCode="'origin'"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="采购日期：">
              <el-date-picker
                v-model="searchForm.dateOfPurchase"
                align="right"
                type="date"
                placeholder="采购日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="产品：">
              <el-select v-model="searchForm.itemId" clearable placeholder="产品">
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
            <el-form-item label="采购类型：">
              <el-select v-model="searchForm.poType" clearable placeholder="请选择">
                <el-option
                  v-for="item in poTypeoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="是否关闭：">
              <el-select v-model="searchForm.isClosed" clearable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
              v-has="'poManagement-search'"
              @click="handlePoList"
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
      <el-table-column fixed prop="poNumber" label="PO" show-overflow-tooltip width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="handleView(scope.$index, scope.row)">{{scope.row.poNumber}}</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed prop="item" label="产品名称"></el-table-column>
      <el-table-column fixed prop="poType" label="采购类型"></el-table-column>
      <el-table-column fixed prop="vendor" label="供应商" width="100"></el-table-column>
      <el-table-column prop="totalAmount" label="采购金额/元" width="100"></el-table-column>
      <el-table-column prop="buyer" label="采购员"></el-table-column>
      <el-table-column prop="agent" label="代办人"></el-table-column>
      <el-table-column prop="agentPay" label="其他费用/元" width="100"></el-table-column>
      <el-table-column prop="originPlaceName" label="产地"></el-table-column>
      <el-table-column prop="netWeight" label="净重"></el-table-column>
      <el-table-column prop="grossWeight" label="毛重"></el-table-column>
      <el-table-column prop="settlementWeight" label="结算重量"></el-table-column>
      <el-table-column prop="lossWeight" label="扣秤重量"></el-table-column>
      <el-table-column prop="unit" label="单位"></el-table-column>
      <el-table-column prop="totlePieces" label="总件数"></el-table-column>
      <el-table-column prop="packageType" label="打包分类"></el-table-column>
      <el-table-column prop="dateOfPurchase" label="采购日期" :formatter="dateFormat" width="150"></el-table-column>
      <el-table-column prop="isClosed" label="是否关闭"></el-table-column>
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

    <!-- Form -->
    <el-dialog title="创建发车信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="司机姓名" prop="driverName" :label-width="formLabelWidth">
          <el-input v-model="form.driverName"></el-input>
        </el-form-item>
        <el-form-item label="司机电话" prop="driverPhone" :label-width="formLabelWidth">
          <el-input v-model="form.driverPhone" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNumber" :label-width="formLabelWidth">
          <el-input v-model="form.carNumber"></el-input>
        </el-form-item>
        <el-form-item label="到货仓库" prop="warehouse" :label-width="formLabelWidth">
          <dict-select @getDictVal="getWarehouse" v-bind:dictCode="'warehouse'"></dict-select>
        </el-form-item>
        <el-form-item label="发车日期" prop="shipDate" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.shipDate"
            align="right"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="picker1Options"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预计到货日期" prop="scheduledArrivalDate" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.scheduledArrivalDate"
            align="right"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="picker1Options"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
          <el-input v-model="form.remarks"></el-input>
        </el-form-item>
        <el-input v-model="form.dictId" type="hidden"></el-input>
        <el-input v-model="form.organizationId" type="hidden"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTransInfos('form')">创 建</el-button>
      </div>
    </el-dialog>
    <!--table-->
    <el-dialog title="PO行明细" :visible.sync="dialogTableVisible" center width="55%">
      <el-table :data="gridData">
        <el-table-column property="specificName" label="规格"></el-table-column>
        <el-table-column property="pieceNum" label="件数"></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column property="isShip" label="是否已发车"></el-table-column>
        <el-table-column property="unitPrice" label="单价"></el-table-column>
        <el-table-column property="remarks" label="备注" width="200"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import dictSelect from "@/components/common/DictDataSelect.vue";
import { getPoLinesByHeadId, getItems } from "@/utils/baseRequest";
export default {
  name: "poManager",
  data() {
    return {
      searchForm: {
        poNumber: null,
        originPlace: null,
        dateOfPurchase: null,
        itemId: null,
        poType: null,
        isClosed: null
      },
      form: {
        driverName: null,
        driverPhone: null,
        carNumber: null,
        warehouse: null,
        shipDate: null,
        remarks: null,
        scheduledArrivalDate: null,
        poHeaderIds: null
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      gridData: [],
      itemOptions: [],
      temp_poHeaderIds: [],
      options: [
        {
          value: "N",
          label: "N"
        },
        {
          value: "Y",
          label: "Y"
        }
      ],
      poTypeoptions: [
        { value: "产地采购", label: "产地采购" },
        { value: "同行采购", label: "同行采购" }
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
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      picker1Options: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      rules: {
        driverName: [{ required: true, message: "司机姓名不允许为空" }],
        driverPhone: [
          { required: true, message: "手机号不允许为空" },
          { min: 11, max: 11, message: "手机号码格式异常", trigger: "blur" }
        ],
        carNumber: [{ required: true, message: "车牌号不允许为空" }],
        warehouse: [
          { required: true, message: "仓库信息不允许为空", trigger: "change" }
        ],
        shipDate: [
          { required: true, message: "发车日期不允许为空", trigger: "change" }
        ],
        scheduledArrivalDate: [
          {
            required: true,
            message: "预计到货日期不允许为空",
            trigger: "change"
          }
        ]
      },
      formLabelWidth: "110px",
      currentPage: 1, //初始页
      pageSize: 15, //每页的数据
      count: 0,
      rows: [],
      row: null
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
    restFrm() {
      this.searchForm = {};
    },
    getLoginName(val) {
      this.searchForm.loginName = val;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.handlePoList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.handlePoList();
    },
    handlePoList() {
      let para = {
        poNumber: this.searchForm.poNumber,
        originPlace: this.searchForm.originPlace,
        dateOfPurchase: this.searchForm.dateOfPurchase,
        itemId: this.searchForm.itemId,
        poType: this.searchForm.poType,
        isClosed: this.searchForm.isClosed,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        sortName: "created_date",
        sortOrder: "desc"
      };
      request({
        url: "/poManager/search",
        method: "post",
        params: para
      }).then(res => {
        this.rows = res.data.list;
        this.count = res.data.total;
        this.currentPage = res.data.pageNum;
      });
    },
    //自动创建发车信息
    createTransInfos(formName) {
      if (this.form.warehouse == null || this.form.warehouse == "") {
        this.$message({
          message: "'到货仓库'不允许为空",
          type: "warning"
        });
        return false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.poHeaderIds = JSON.stringify(this.temp_poHeaderIds);
          request({
            url: "/transactionManagement/createMaterialTransactions",
            method: "post",
            params: this.form
          }).then(res => {
            this.$message({
              message: res.data.msg,
              type: res.data.code == "200" ? "success" : "error"
            });
            if (res.data.code == "200") {
              this.dialogFormVisible = false;
            }
          });
        }
      });
    },
    addPo() {
      this.$router.push({ path: "addPoinfo" });
    },
    autoCreateTransInfo() {
      if (this.temp_poHeaderIds.length == 0) {
        this.$message({
          message: "请选择需创建发车信息的PO行",
          type: "warning"
        });
        return false;
      }
      this.dialogFormVisible = true;
      this.form = {};
    },
    handCreateTransInfo() {
      if (this.row == null) {
        this.$message({
          message: "请点击需要创建发车信息的PO行",
          type: "warning"
        });
        return;
      } else {
        this.$router.push({ path: "addTransinfo", query: { row: this.row } });
      }
    },
    getRowDatas(currentRow, oldCurrentRow) {
      this.row = currentRow;
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      return this.COMMON.dateFormat(date);
    },
    getOriginPlace(val) {
      this.searchForm.originPlace = val;
    },
    getWarehouse(val) {
      this.form.warehouse = val;
    },
    handleView(index, row) {
      getPoLinesByHeadId(row.headerId).then(response => {
        this.gridData = response.data;
      });
      this.dialogTableVisible = true;
    },
    //用户选择行的id存入数组
    handleSelectionChange(rows) {
      this.temp_poHeaderIds = [];
      rows.forEach(row => {
        this.temp_poHeaderIds.push(row.headerId);
      });
    }
  }
};
</script>