<template>
  <div class="table-page">
    <!-- 搜索、新建 -->
    <div>
      <el-breadcrumb separator>
        <el-breadcrumb-item style="cursor: pointer"></el-breadcrumb-item>
        <el-breadcrumb-item>权益基金行情配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格 -->
    <div>
      <el-table border :data="tableLists" tooltip-effect="light">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="基金代码" prop="fundCode"></el-table-column>
        <el-table-column label="基金名称" prop="fundName"></el-table-column>
        <el-table-column label="近一年涨跌幅" prop="lastYearRate"></el-table-column>
        <el-table-column label="近一年涨跌幅截止时间" prop="lastTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="modifyRow(scope.row)" type="text" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="commonDialogTitle"
      :visible.sync="commonDialogVisible"
      width="590px"
      top="40px"
    >
      <CommonForm
        ref="commonForm"
        :formConfig="formConfig"
        :dataGet="formDataGet"
        @save="confirmUpdate"
        @close="commonDialogVisible=false"
        :refreshDialog="refreshDialog"
        :server="codeServer"
      ></CommonForm>
    </el-dialog>
    <!-- 删除操作 -->
    <el-dialog title="确认删除" :visible.sync="deleteDialogVisible" width="305px" center>
      <div class="is-required verify-code">
        <el-input v-model.trim="delData.verifyCode" auto-complete="off" maxlength="4"></el-input>
        <img @click="refreshVerifyCode" :src="codeImgs" class="verify-code-img" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CommonForm from "@/components/template/CommonForm";
export default {
  name: "StockBaseList",
  components: {
    CommonForm
  },
  data() {
    return {
      getListApi: "queryBasicInfoList", // 初始化获取表格接口
      saveRowApi: "updateBasicInfoRate", // 保存接口
      updateRowApi: "updateBasicInfoRate", //修改接口
      deleteRowApi: "updateBasicInfoRate",
      codeImgs: "",
      codeServer: "game-ttkx-server",
      refreshDialog: false,
      deleteDialogVisible: false, // 删除弹窗
      commonDialogVisible: false, // 公共弹窗，修改、新增等
      commonDialogTitle: "新增", //公共弹窗名称
      tableLists: [], // 表格数据
      // 查询接口参数
      requestData: {
        pageNo: 1,
        pageSize: 50
      },
      // 删除接口参数
      delData: {
        tableId: "",
        verifyCode: ""
      },
      // 表单设置
      formConfig: [
        {
          label: "基金代码",
          key: "fundCode",
          type: "input",
          placeholder: "",
          value: "",
          require: true,
          disable:true,
          regExp: null,
          regTip: ""
        },
        {
          label: "基金代码名称",
          key: "fundName",
          type: "input",
          placeholder: "",
          value: "",
          require: true,
          disable:true,
          regExp: null,
          regTip: ""
        },
        {
          label: "近一年涨跌幅(%)",
          key: "lastYearRate",
          type: "input",
          maxlength: 6,
          placeholder: "",
          value: "",
          require: true,
          regExp: null,
          regTip: ""
        },
        {
          label: "涨跌幅截止时间",
          key: "lastTime",
          type: "date",
          isDatetime: true,
          require: true,
          valStart: "",
          valEnd: ""
        }
      ],
      formDataGet: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getTableData();
    },
    // 获取表格数据
    getTableData() {
      this.$api[this.getListApi](this.requestData)
        .then(res => {
          if (res.ret === 0) {
            // 处理获取到的表格数据
            this.dealTableData(res);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$message.error("服务器异常");
        });
    },
    // 处理返回的表格数据
    dealTableData(res) {
      let result = res.result.list;
      let info = [];
      for (let i = 0; i < result.length; i++) {
        // 时间展示转化
        if (result[i].type == 3) {
          info.push(result[i]);
        }
        result[i].lastTime = this.$mgui.formatDate(result[i].lastTime,'YYYY-MM-DD');
        // result[i].upTimeMil = result[i].upTimeStr;
      }
      this.tableLists = info;
    },

    // 新增
    addRow() {
      this.formDataGet = null;
      this.showCommonDialog("新建活动");
    },
    // 修改
    modifyRow(row) {
      this.formDataGet = row;
      this.showCommonDialog("修改基金信息");
    },

    back() {
      history.go(-1);
    },
    // 确认修改/新增
    confirmUpdate(result) {
      // 表单数据，特殊数据处理，如增加默认发送的数据（后台经常需要）
      let data = result;
      // data.lastTime = this.getDateString(data.lastTime);
      // 修改判断
      let api = this.saveRowApi;
      if (this.formDataGet) {
        api = this.updateRowApi;
        data.id = this.formDataGet.id;
      }
      this.$api[api](data)
        .then(res => {
          if (res.ret === 0) {
            this.$message.success("保存成功");
            this.commonDialogVisible = false;
            // 刷新表格
            this.getTableData();
          } else {
            // 刷新验证码
            this.$refs.commonForm.refreshVerifyCode();
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.$refs.commonForm.refreshVerifyCode();
          this.$message.error("服务器异常");
        });
    },

    getDateString(stamp) {
           let d=new Date(parseInt(stamp));
           let month=(d.getMonth()+1)<10?(0+""+(d.getMonth()+1)):(d.getMonth()+1);
           let day=d.getDate()<10?(0+""+d.getDate()):d.getDate();
           let hour=d.getHours()<10?(0+""+d.getHours()):d.getHours();
           let minute=d.getMinutes()<10?(0+""+d.getMinutes()):d.getMinutes();
           let second=d.getSeconds()<10?(0+""+d.getSeconds()):d.getSeconds();
           let dateString=d.getFullYear()+ "-" + month +"-"+day+" "+hour+":"+minute+":"+second
           return dateString;
        },

    // 点击删除，设置删除参数
    deleteRow(row) {
      this.delData.tableId = row.id;
      this.refreshVerifyCode();
      this.delData.verifyCode = "";
      this.deleteDialogVisible = true;
    },
    // 确认删除
    confirmDelete() {
      this.$api[this.deleteRowApi](this.delData)
        .then(res => {
          this.refreshVerifyCode();
          if (res.ret === 0) {
            this.$message.success("删除成功");
            this.deleteDialogVisible = false;
            // 刷新表格
            this.getTableData();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.refreshVerifyCode();
          this.$message.error("服务器异常");
        });
    },
    // 显示配置弹窗
    showCommonDialog(title) {
      this.commonDialogTitle = title;
      this.refreshDialog = !this.refreshDialog;
      this.commonDialogVisible = true;
    },
    // 刷新验证码
    refreshVerifyCode() {
      this.codeImgs = this.$mgui.refreshVerifyCode(this.codeServer);
    }
  }
};
</script>


<style lang="less">
</style>
