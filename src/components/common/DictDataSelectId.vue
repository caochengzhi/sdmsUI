<template>
  <div>
    <el-select v-model="param" @change="handleChangeValue" clearable>
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import request from "@/utils/request";
import { getDictDatasByDictCode } from "@/utils/baseRequest";

export default {
  name: "commonDictDataSelect",
  data() {
    return {
      options: [],
      param: null
    };
  },
  props: ["dictCode"],

  mounted() {
    //获取各类型数据字典列表
    getDictDatasByDictCode(this.dictCode).then(response => {
      this.options = response.data.map(item => {
        return {
          value: item.id,
          label: item.dictDataName
        };
      });
    });
  },

  methods: {
    handleChangeValue(val) {
      this.$emit("getDictVal", val);
    }
  }
};
</script>

