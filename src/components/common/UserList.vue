<template>
  <div>
    <el-select
      v-model="value"
      filterable
      clearable
      remote
      change="getvalue"
      reserve-keyword
      placeholder="选择用户"
      :remote-method="getUsers"
      :loading="loading"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import { getUserList } from "@/utils/baseRequest";
export default {
  data() {
    return {
      options: [],
      value: [],
      list: [],
      loading: false
    };
  },
  created() {
    getUserList().then(response => {
      this.list = response.data.map(item => {
        return {
          value: item.loginName,
          label: item.loginName + "/" + item.userName
        };
      });
    });
  },
  mounted() {},
  methods: {
    getUsers(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    getvalue(val) {
      alert(val);
    }
  }
};
</script>