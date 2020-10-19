<template>
  <div class="table-page">
    <!-- 搜索、新建 -->
    <!-- <div>
      <el-button style="float:right;" type="primary" @click="addRow">新建奖品</el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item style="cursor: pointer">
          <span style="color: #409EFF;" v-on:click="back">场次列表</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>活动奖品</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
     <div class="crumbs">
      <el-button style="float:right;" type="primary" @click="addRow">新建奖品</el-button>
      <el-breadcrumb style="padding-top:6px;" separator="/">
        <el-breadcrumb-item style="cursor: pointer;">
          <span style="color: #409EFF;" v-on:click="back">场次列表</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>奖品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格 -->
    <div>
      <el-table border :data="tableLists" tooltip-effect="light">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="奖品名称" prop="prizeName"></el-table-column>
        <el-table-column label="奖品类型" prop="prizeType" min-width="120">
          <template slot-scope="scope">{{scope.row.prizeType == 'silver_draft' ? '体验金' : scope.row.prizeType}}</template>
        </el-table-column>
        <el-table-column label="中奖概率" prop="prizeProbability"></el-table-column>
        <el-table-column label="总库存数量/预算" prop="remainNum"></el-table-column>
        <el-table-column label="剩余库存" prop="remainPrice"></el-table-column>
        <el-table-column :label="prizeValueLabel" prop="prizeValue">
          <template slot-scope="scope">
            {{scope.row.prizeMinValue}}~{{scope.row.prizeValue}}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="shangjiaStatus">
          <template slot-scope="scope">{{ scope.row.shangjiaStatus==0 ? '下架' : '上架'}}</template>
        </el-table-column>

        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <el-button @click.stop="modifyRow(scope.row)" type="text" size="small">修改</el-button>
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
      >
        <template slot="header">
          <el-form-item label="奖品类型" class="is-required">
            <el-select v-model="prizeTypeSelect.value" placeholder="奖品类型" @change="prizeChange">
              <el-option
                v-for="item in prizeTypeSelect.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </CommonForm>
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
import formConfigList from "./FestivalFormConfig";
export default {
  name: "FestivalList",
  components: {
    CommonForm
  },
  data() {
    return {
      getListApi: "onRePrizeList", // 初始化获取表格接口
      saveRowApi: "onReqSavePrize", // 保存接口
      updateRowApi: "onReqSavePrize", //修改接口
      deleteRowApi: "onReRemovePrize", //删除接口
      codeImgs: "",
      codeServer: "game-ttkx-server",
      refreshDialog: false,
      deleteDialogVisible: false, // 删除弹窗
      commonDialogVisible: false, // 公共弹窗，修改、新增等
      commonDialogTitle: "新增", //公共弹窗名称
      tableLists: [], // 表格数据
      // 查询接口参数
      requestData: {
        tableId: ""
      },
      // 删除接口参数
      delData: {
        prizeId: "",
        verifyCode: ""
      },
      prizeTypeSelect: {
        value: "silver_draft",
        options: [
          {
            value: "silver_draft",
            label: "抽体验金"
          }
         
        ]
      },
      silver_draft: {
        value: "silver_draft",
        label: "体验金"
      },
      // 表单设置
      formConfig: [],
      formDataGet: null,
      upGradeTaskIndexObject: {},
      formIndexObj: {},
      types: "", //摇钱树和红包雨type
      prizeValueLabel: "奖励金额"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    prizeChange(val) {
      this.formConfig = formConfigList[val];
      this.refreshDialog = !this.refreshDialog;
    },
    init() {
      this.getParams();
      this.prizeTypeSelect.value = "silver_draft";
      this.formConfig = formConfigList[this.prizeTypeSelect.value];
      // 体验金的奖品有一个体验金可选
      if (this.types == 36) {
        this.prizeValueLabel = "奖品价值/体验金金额";
        this.prizeTypeSelect.options.push(this.silver_draft);
      }
      this.getTableData();
    },
    getParams() {
      // 取到路由带过来的参数
      this.requestData.tableId = this.$route.query.id;
      this.types = this.$route.query.value;
    },
    back() {
      history.go(-1);
    },
    // 获取表格数据
    getTableData() {
      this.$api[this.getListApi](this.requestData)
        .then(res => {
          if (res.ret === 0) {
            if (res.result === null || res.result.length === 0) {
              this.tableLists = [];
              return;
            }
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
      result.forEach(item => {
        item.remainNum = item.prizeNum + (item.usedPrizedNum || 0);
        switch (item.prizeType) {
          case "silver_draft":
            item.remainNum = item.prizeMoney;
            item.remainPrice = item.prizeMoney - item.usedPrizedValue;
            break;
          default:
            item.remainPrice = item.prizeNum;
            break;
        }
      });
      console.log(result);
      this.tableLists = result;
    },
    // 新增
    addRow() {
      this.formDataGet = null;
      this.showCommonDialog("新增");
    },
    // 修改
    modifyRow(row) {
      this.formDataGet = row;
      this.prizeTypeSelect.value = row.prizeType;
      this.formConfig = formConfigList[row.prizeType];
      this.showCommonDialog("修改");
    },
    // 确认修改/新增
    confirmUpdate(result) {
      // 表单数据，特殊数据处理，如增加默认发送的数据（后台经常需要）
      let data = result;
      // 新增、修改判断
      let api = this.saveRowApi;
      data.tableId = this.requestData.tableId;
      if (this.formDataGet) {
        api = this.updateRowApi;
        data.id = this.formDataGet.id;
      }
      data.prizeType = this.prizeTypeSelect.value;
      // 每单数量默认为1
      if (typeof data.prizeGiveNum === "undefined") {
        data.prizeGiveNum = "1";
      }
      // 首次必中默认为否
      if (typeof data.firstLuckDraw === "undefined") {
        data.firstLuckDraw = 0;
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
        // .catch(() => {
        //   this.$refs.commonForm.refreshVerifyCode();
        //   this.$message.error("服务器异常");
        // });
    },
    // 点击删除，设置删除参数
    deleteRow(row) {
      this.delData.prizeId = row.id;
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
    choise(condition) {
      condition.pageSize = this.requestData.pageSize;
      condition.entranceType = this.configType;
      this.requestData = condition;
      this.getTableData();
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
