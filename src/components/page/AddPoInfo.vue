
<template>
  <div class="container">
    <el-form :model="poForm" :rules="rules" ref="poForm" label-width="100px">
      <fieldset class="fsclass">
        <legend class="leclass">
          <span>&nbsp;PO信息录入&nbsp;</span>
        </legend>
        <el-row>
          <el-col>
            <el-form-item label="采购类型：" prop="poType">
              <el-radio-group v-model="poForm.poType" @change="changeRadio">
                <el-radio label="产地采购"></el-radio>
                <el-radio label="同行采购"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="产地信息：" prop="originPlace">
              <dict-select @getDictVal="getOriginPlace" v-bind:dictCode="'origin'"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="采购日期：" prop="dateOfPurchase">
              <el-date-picker
                v-model="poForm.dateOfPurchase"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="采购日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="货品名称：" prop="itemId">
              <!-- <el-input v-model="poForm.item" placeholder="货品名称" clearable></el-input> -->
              <el-select v-model="poForm.itemId" placeholder="货品名称">
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
            <el-form-item label="供货商：" prop="vendor">
              <el-input v-model="poForm.vendor" placeholder="供货商" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="采购金额：" prop="totalAmount">
              <el-input
                v-model="poForm.totalAmount"
                oninput="value=value.replace(/[^\d.]/g,'')"
                placeholder="采购金额/元"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="采购员：" prop="buyer">
              <el-input v-model="poForm.buyer" placeholder="采购员" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="代办人：">
              <el-input v-model="poForm.agent" placeholder="代办人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="代办费用：">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                v-model="poForm.agentPay"
                placeholder="代办费用/元"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <hr style="margin-bottom:10px;" size="1">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="结算重量：" prop="settlementWeight">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                v-model="poForm.settlementWeight"
                placeholder="结算重量"
                @blur="calculateNet"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="扣秤重量：">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                v-model="poForm.lossWeight"
                placeholder="扣秤重量"
                :disabled="lossWeightDisable != 0"
                @blur="calculateNet"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="毛重：">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                v-model="poForm.grossWeight"
                placeholder="毛重"
                :disabled="grossWeightDisable != 0"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="净重：" prop="netWeight">
              <el-input
                oninput="value=value.replace(/[^\d.]/g,'')"
                v-model="poForm.netWeight"
                placeholder="结算重量+扣秤重量"
                clearable
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="重量单位：" prop="unit">
              <dict-select @getDictVal="getUnit" v-bind:dictCode="'weightUnit'"></dict-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="总件数：" prop="totlePieces">
              <el-input
                type="totlePieces"
                v-model.number="poForm.totlePieces"
                placeholder="总装货件数"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="包装分类：">
              <dict-select @getDictVal="getPackageType" v-bind:dictCode="'packageType'"></dict-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="20" :xl="8">
            <el-form-item label="备注：">
              <el-input v-model="poForm.remarks" type="textarea" placeholder="备注" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <div style="margin-top:10px;">
        <po-line @getPoLines="getPoLineDatas"></po-line>
      </div>
      <el-form-item align="center" style="margin-top:10px;">
        <el-popover placement="top" width="160" v-model="visible">
          <p>确定执行此操作？</p>
          <div style="text-align: center; margin: 0">
            <el-button type="info" @click="visible = false">取消</el-button>
            <el-button type="primary" @click="submitForm('poForm')">确定</el-button>
          </div>
          <el-button type="primary" slot="reference" icon="el-icon-lx-roundcheck">确定创建PO</el-button>
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>
    
<script>
import dictSelect from "@/components/common/DictDataSelect.vue";
import poLine from "@/components/page/PoLine.vue";
import request from "@/utils/request";
import { getDictDatasByDictCode, getItems } from "@/utils/baseRequest";
export default {
  name: "addPoInfo",
  data() {
    return {
      poForm: {
        poType: null,
        originPlace: null,
        dateOfPurchase: null,
        itemId: null,
        vendor: null,
        totalAmount: null,
        buyer: null,
        agent: null,
        agentPay: null,
        settlementWeight: null,
        lossWeight: null,
        unit: null,
        grossWeight: null,
        netWeight: null,
        totlePieces: null,
        packageType: null,
        remarks: null
      },
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
      },
      rules: {
        poType: [
          { required: true, message: "采购类型不允许为空", trigger: "change" }
        ],
        originPlace: [
          { required: true, message: "产地信息不允许为空", trigger: "change" }
        ],
        dateOfPurchase: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        unit: [
          { required: true, message: "采购类型不允许为空", trigger: "change" }
        ],
        itemId: [
          { required: true, message: "货品名称不允许为空", trigger: "blur" }
        ],
        vendor: [
          { required: true, message: "供货商信息不允许为空", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        totalAmount: [{ required: true, message: "采购金额不允许为空" }],
        settlementWeight: [{ required: true, message: "结算重量不允许为空" }],
        netWeight: [{ required: true, message: "净重不允许为空" }],
        totlePieces: [
          { required: true, message: "件数不允许为空" },
          { type: "number", message: "必须为数字值" }
        ]
      },
      poLines: [],
      grossWeightDisable: "0",
      lossWeightDisable: "0",
      visible: false
    };
  },

  components: {
    dictSelect,
    poLine
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
    submitForm(formName) {
      this.visible = false;
      if (this.validPoLine(this.poForm)) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (
              this.poForm.poType == "同行采购" &&
              this.poForm.grossWeight < this.poForm.netWeight
            ) {
              this.sendMsg("毛重应该大于净重,请检查");
              return false;
            }

            request({
              url: "/poManager/savePo",
              method: "post",
              params: this.poForm,
              data: this.poLines
            }).then(res => {
              this.$message({
                message: res.data.msg,
                type: res.data.code == "200" ? "success" : "error"
              });
              this.visible = false;
              if (res.data.code == "200") {
                this.COMMON.closeTagAndGoBack(this.$options.name, this.$router);
              }
            });
          } else {
            this.sendMsg("数据验证不通过，请检查");
            return false;
          }
        });
      }
    },
    //对po行数据进行校验，非空校验和数量校验
    validPoLine(data) {
      if (this.poLines.length == 0) {
        this.sendMsg("请增加规格明细数据");
        return false;
      }
      var tempList = [];
      var totalWeight = 0; //po行总重量
      var totalPiece = 0; //po行总件数
      this.poLines.forEach(item => {
        var specificId = item.specificId;
        var pieceNum = item.pieceNum;
        var unitPrice = item.unitPrice;
        var weight = item.weight;
        if (specificId == null || specificId == "") {
          this.sendMsg("规则不允许为空");
          return false;
        } else if (pieceNum == null || pieceNum == "") {
          this.sendMsg("件数不允许为空");
          return false;
        } else if (unitPrice == null || unitPrice == "") {
          this.sendMsg("单价不允许为空");
          return false;
        } else if (weight == null || weight == "") {
          this.sendMsg("重量不允许为空");
          return false;
        }
        if (tempList.indexOf(specificId) == -1) {
          tempList.push(specificId);
        } else {
          this.sendMsg("规则不允许重复");
          return false;
        }
        totalWeight = Number(totalWeight) + Number(weight);
        totalPiece = Number(totalPiece) + Number(pieceNum);
      });

      if (Number(totalPiece) != Number(data.totlePieces)) {
        this.sendMsg("po行总件数不等于po头记录总件数，请检查");
        return false;
      }
      if (Number(totalWeight) != Number(data.netWeight)) {
        this.sendMsg("po行总重量不等于po头记录的净重，请检查");
        return false;
      }

      return true;
    },
    sendMsg(msg) {
      this.$message({
        message: msg,
        duration: 5000,
        showClose: true,
        center: true,
        type: "warning"
      });
    },
    getOriginPlace(val) {
      this.poForm.originPlace = val;
    },
    getUnit(val) {
      this.poForm.unit = val;
    },
    getPackageType(val) {
      this.poForm.packageType = val;
    },
    getPoLineDatas(poLineVal) {
      this.poLines = poLineVal;
    },
    changeRadio(label) {
      if (label == "同行采购") {
        this.lossWeightDisable = 1;
        this.grossWeightDisable = 0;
      } else if (label == "产地采购") {
        this.lossWeightDisable = 0;
        this.grossWeightDisable = 1;
      }
    },
    //计算净重
    calculateNet() {
      this.poForm.netWeight = parseFloat(
        Number(this.poForm.settlementWeight) + Number(this.poForm.lossWeight)
      ).toFixed(2);
    }
  }
};
</script>
<style>
.fsclass {
  border-width: 1px;
  border-style: solid;
}
.leclass {
  margin-left: 30px;
  font-size: 0.8em;
  color: #606266;
}
</style>