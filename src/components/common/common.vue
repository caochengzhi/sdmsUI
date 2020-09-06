<script type="text/javascript">
import moment from "moment";
// 定义一些公共的属性和方法
const httpUrl = "http://39.105.17.99:8080/";

//table表格中timestamp时间类型格式化
function dateFormat(date) {
  if (date == null || date == "" || typeof date == "undefined") {
    return "";
  } else {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }
}

function dateFormatYYYYMMDD(date) {
  if (date == null || date == "" || typeof date == "undefined") {
    return "";
  } else {
    return moment(date).format("YYYY-MM-DD");
  }
}

/*
 * form表单日志字段格式化，从后台查到的日志为long型，
 * 做更新动作的时候，后台是yyyy-mm-dd格式的才可以保存，不然会报转换异常
 */
function formFormat(form) {
  if (
    typeof form.createdDate != "undefined" &&
    form.createdDate != null &&
    form.createdDate != ""
  ) {
    form.createdDate = dateFormat(form.createdDate);
  }

  if (
    typeof form.lastUpdatedDate != "undefined" &&
    form.lastUpdatedDate != null &&
    form.lastUpdatedDate != ""
  ) {
    form.lastUpdatedDate = dateFormat(form.lastUpdatedDate);
  }

  return form;
}

//关闭当前tab页并返回上一页
export function closeTagAndGoBack(tagName, router) {
  window.tags.map((item, index) => {
    if (tagName === item.name) {
      window.tags.splice(index, 1);
      router.go(-1);
    }
  });
}

/*
 * 判断输入字符串是否为空或null，非空时返回false
 */
export function checkInputNullOrEmpty(input) {
  if (input != null && input.trim().length > 0) {
    return false;
  } else {
    return true;
  }
}

export function handleClose(done) {
  this.$confirm("确认关闭？")
    .then(_ => {
      done();
    })
    .catch(_ => {});
}

// 暴露出这些属性和方法
export default {
  httpUrl,
  dateFormat,
  dateFormatYYYYMMDD,
  formFormat,
  closeTagAndGoBack,
  checkInputNullOrEmpty,
  handleClose
};
</script>