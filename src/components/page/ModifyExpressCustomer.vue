  <template>
  <div class="container">
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
          <el-form-item label="快递公司：">
            <dict-selectId
              @clearDictVal="clearExpress"
              @getDictVal="getExpressCompany"
              v-bind:dictCode="'expressCompany'"
              v-bind:dictValue="form.expressCompanyId"
            ></dict-selectId>
          </el-form-item>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
          <el-form-item label="客户号：">
            <el-input v-model="form.customerName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
          <el-form-item label="客户秘钥：">
            <el-input v-model="form.customerPwd"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
  
<script>
import request from "@/utils/request";
import dictSelectId from "@/components/common/DictDataSelectId.vue";
export default {
  name: "ModifyExpressCustomer",
  data() {
    return {
      form: {
        expressCompanyId: null,
        customerName: null,
        customerPwd: null,
        monthCode: null,
        sendSite: null,
        sendStaff: null,
        isValid: "Y"
      },
      visible: false,
      rules: {}
    };
  },

  components: {
    dictSelectId
  },

  computed: {},

  mounted() {},

  methods: {
    getExpressCompany(val) {
      this.form.expressCompanyId = val;
    },
    clearExpress() {
      this.form.expressCompanyId = null;
    }
  }
};
</script>