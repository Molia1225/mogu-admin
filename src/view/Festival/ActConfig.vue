<template>
  <div class="table-page">
    <!-- 搜索、新建 -->
    <div>
      <el-button style="float:right;" type="primary" @click="addRow">新建活动</el-button>
      <el-breadcrumb separator="">
        <el-breadcrumb-item style="cursor: pointer">
        </el-breadcrumb-item>
        <el-breadcrumb-item>活动配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格 -->
    <div>
      <el-table border :data="tableLists" tooltip-effect="light">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="活动名称" prop="activityName"></el-table-column>
        <el-table-column label="创建时间" prop="gmtCreateStr"></el-table-column>
        <el-table-column label="上架时间" prop="upTimeStr"></el-table-column>
        <el-table-column label="下架时间" prop="downTimeStr"></el-table-column>
        <el-table-column label="开始时间" prop="startTimeStr"></el-table-column>
        <el-table-column label="结束时间" prop="endTimeStr"></el-table-column>
        <el-table-column label="场次">
          <template slot-scope="scope">
            <el-button size="mini" @click="gotoEditPrice(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="shangjiaStatus">
          <template slot="header" slot-scope="scope">状态  <el-tooltip effect="dark" content="只生效最新上架的一场活动" placement="top"><span class="el-icon-question"></span></el-tooltip></template>
          <template slot-scope="scope">{{ scope.row.shangjiaStatus==0 ? '下架' : '上架'}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="modifyRow(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
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
  name: "ActConfig",
  components: {
    CommonForm
  },
  data() {
    return {
      getListApi: "onReTableList", // 初始化获取表格接口
      saveRowApi: "onReSaveTable", // 保存接口
      updateRowApi: "onReSaveTable", //修改接口
      deleteRowApi: "onReRemoveTable",
      codeImgs: "",
      codeServer: "game-ttkx-server",
      refreshDialog: false,
      deleteDialogVisible: false, // 删除弹窗
      commonDialogVisible: false, // 公共弹窗，修改、新增等
      commonDialogTitle: "新增", //公共弹窗名称
      tableLists: [], // 表格数据
      // 查询接口参数
      requestData: {
        querySub: 0,
        pageNo: 1,
        keyId: 0,
        pageSize: 50,
        type: 61
      },
      // 删除接口参数
      delData: {
        tableId: "",
        verifyCode: ""
      },
      // 表单设置
      formConfig: [
        {
          label: "活动名称",
          key: "activityName",
          type: "input",
          maxlength: 10,
          placeholder: "",
          value: "",
          require: true,
          regExp: null,
          regTip: ""
        },
        {
          label: "上架时间",
          key: "updownTime",
          type: "date",
          require: true,
          keyStart: "upTimeMil",
          keyEnd: "downTimeMil",
          valStart: "",
          valEnd: ""
        },
        {
          label: "活动起止时间",
          key: "activityTime",
          type: "date",
          require: true,
          keyStart: "startTimeMil",
          keyEnd: "endTimeMil",
          valStart: "",
          valEnd: ""
        },

        {
          label: "活动规则",
          key: "rule",
          type: "edit",
          maxlength: 20,
          placeholder: "",
          value: "",
          require: true,
          regExp: null,
          regTip: ""
        },
        {
          label: "上下架",
          key: "shangjiaStatus",
          value: 0,
          type: "select",
          require: true,
          options: [
            {
              value: 0,
              label: "下架"
            },
            {
              value: 1,
              label: "上架"
            }
          ]
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
      let result = res.result;
      for (let i = 0; i < result.length; i++) {
        // 时间展示转化
        result[i].gmtCreateStr = this.$mgui.formatDate(result[i].gmtCreate);
        result[i].upTimeStr = this.$mgui.formatDate(result[i].upTime);
        result[i].downTimeStr = this.$mgui.formatDate(result[i].downTime);
        result[i].startTimeStr = this.$mgui.formatDate(result[i].startTime);
        result[i].endTimeStr = this.$mgui.formatDate(result[i].endTime);
        // 后台修改的接口要的字段跟查询接口给的字段不一样，比较坑
        result[i].upTimeMil = result[i].upTimeStr;
        result[i].downTimeMil = result[i].downTimeStr;
        result[i].startTimeMil = result[i].startTimeStr;
        result[i].endTimeMil = result[i].endTimeStr;
      }
      this.tableLists = result;
    },
    // 查看奖品
    gotoEditPrice(index, row) {
      this.$router.push({
        path: "/RoundList",
        query: {
          id: row.id,
          value: row.type,
          upTime: row.upTime,
          downTime: row.downTime
        }
      });
    },
    // 查看中奖
    gotoSeeWinning(index, row) {
      this.$router.push({
        path: "/WinningCheck",
        query: {
          id: row.id,
          value: row.type
        }
      });
    },
    // 新增
    addRow() {
      this.formDataGet = null;
      this.showCommonDialog("新建活动");
    },
    // 修改
    modifyRow(row) {
      this.formDataGet = row;
      this.showCommonDialog("修改活动");
    },

    back() {
      history.go(-1);
    },
    // 确认修改/新增
    confirmUpdate(result) {
      // 表单数据，特殊数据处理，如增加默认发送的数据（后台经常需要）
      let data = result;
      data.type = 61;
      data.keyId = 0;
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
