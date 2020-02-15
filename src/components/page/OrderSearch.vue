
<template>
  <div class="container">
    <div>
      <div align="right" style="padding-bottom:5px;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-upload"
            v-has="'orderManagement-input'"
            @click="dialogFormVisible = true"
          >订单导入</el-button>
        </el-button-group>
      </div>
      <el-form ref="form" :model="searchForm" label-width="auto">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="订单号：">
              <el-input v-model="searchForm.orderNo" placeholder="订单号"></el-input>
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
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="商品 ID" prop="id"></el-table-column>
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="描述" prop="desc"></el-table-column>
    </el-table>

    <el-dialog title="订单导入 （每次上传文件不超3个）" :visible.sync="dialogFormVisible" width="550px">
      <el-form :model="inputForm" v-loading="loading" element-loading-text="订单导入中，请稍等...">
        <el-row :gutter="50">
          <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
            <el-form-item label="店铺选择:" :label-width="formLabelWidth">
              <dict-select @getDictVal="getCustomerList" v-bind:dictCode="'customerList'"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" style="padding-left: 0px;">
            <el-upload
              action="string"
              ref="upload"
              :before-upload="beforeupload"
              :on-exceed="handleExceed"
              :show-file-list="true"
              multiple
              :limit="3"
              :auto-upload="false"
            >
              <el-button size="mini" type="primary" @click="clearUpload">选取文件</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-form-item align="right">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="success" @click="submitUpload" icon="el-icon-download">导 入</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
    
<script>
import request from "@/utils/request";
import dictSelect from "@/components/common/DictDataSelectId.vue";
export default {
  name: "orderManager",
  data() {
    return {
      searchForm: {
        orderNo: null
      },
      inputForm: {
        customerId: null
      },
      uploadForm: new FormData(),
      dialogFormVisible: false,
      formLabelWidth: "100px",
      loading: false,
      dis: true,
      rows: [
        {
          id: "12987122",
          name: "好滋好味鸡蛋仔",
          category: "江浙小吃、小吃零食",
          desc: "荷兰优质淡奶，奶香浓而不腻",
          address: "上海市普陀区真北路",
          shop: "王小虎夫妻店",
          shopId: "10333"
        }
      ]
    };
  },
  components: {
    dictSelect
  },

  methods: {
    getCustomerList(val) {
      this.inputForm.customerId = val;
    },
    //获取文件
    beforeupload(file) {
      this.uploadForm.append("file", file);
      this.uploadForm.append("customerId", this.inputForm.customerId);
      return false;
    },
    clearUpload() {
      this.uploadForm = new FormData();
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制最多选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //手动上传附件
    submitUpload() {
      this.$refs.upload.submit();
      let data = this.uploadForm;
      if (this.inputForm.customerId == null || data.get("file") == null) {
        this.$message.warning("店铺信息或附件未选择");
        return;
      }
      this.loading = true;
      request({
        url: "/orderManagement/upload",
        method: "post",
        data: data,
        processData: false, //必写
        contentType: false //必写
      }).then(res => {
        if (res.data.code == "200") {
          this.clearUpload();
          this.dialogFormVisible = false;
        }
        this.$message({
          message: res.data.msg,
          type: "success"
        });
        this.loading = false;
      });
    },
    //分页查询
    handleList() {
      let para = {
        itemId: this.searchForm.itemId,
        warehouse: this.searchForm.warehouse,
        shipDate: this.searchForm.shipDate,
        carNumber: this.searchForm.carNumber,
        ioType: this.searchForm.ioType,
        ioStatus: this.searchForm.ioStatus,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        sortName: "created_date",
        sortOrder: "desc"
      };
      request({
        url: "/transactionManagement/search",
        method: "post",
        params: para
      }).then(res => {
        this.rows = res.data.list;
        this.count = res.data.total;
        this.currentPage = res.data.pageNum;
      });
    },
    restFrm() {
      this.searchForm = {};
    }
  }
};
</script>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-upload--text {
  border: 0px;
  position: relative;
  width: 85px;
  height: 30px;
  overflow: hidden;
}
</style>