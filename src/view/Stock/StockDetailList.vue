<template>
  <div class="activityRedPack">
    <div class="crumbs">
      <el-button class="rightBtn" type="primary" @click="goBack">返回</el-button>
      <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'StockList'}">
              <span style="color: #409EFF;">行情源配置</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>查看行情源列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格 -->
    <div class="panel-box">
      <el-table ref="singleTable" border :data="stDetailList" tooltip-effect="light">
        <el-table-column label="日期" prop="gmtModify"></el-table-column>
        <el-table-column label="基金类型" prop="fundType"></el-table-column>
        <el-table-column label="基金代码" prop="fundCode"></el-table-column>
        <el-table-column label="基金名称" prop="fundName"></el-table-column>
        <el-table-column label="收益率" prop="earningRate"></el-table-column>
        <el-table-column label="万分收益率/约定年化收益率/净值" prop="deductionsNet"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleUpBana(scope.row)" type="text" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改/新增 弹窗 -->
    <el-dialog class="dialog-redPack" :visible.sync="showMod" :title="titleNameBanaVTwo">
      <el-form :model="stDetailConfig" label-width="140px" ref="redPacketConfig">
        <el-form-item label="基金名称" class="is-required">
          <el-input v-model="stDetailConfig.fundName" maxlength="10" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="基金类型" class="is-required">
          <el-select v-model="stDetailConfig.fundType" placeholder="请选择">
            <el-option
              v-for="item in typeNameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基金编号" class="is-required">
          <el-input v-model="stDetailConfig.fundCode" maxlength="10" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收益率" class="is-required">
          <el-input v-model="stDetailConfig.earningRate" maxlength="10" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="labelName[stDetailConfig.fundType]" class="is-required">
          <el-input v-model="stDetailConfig.deductionsNet" maxlength="10" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" class="is-required" id="codeimg">
          <div style="width:220px;">
            <el-input
              v-model="stDetailConfig.verifyCode"
              auto-complete="off"
              style="width:100px;transform:translateY(-11px);"
            ></el-input>
            <img
              @click="codefile"
              :src="codeImgs"
              style="width:100px;height:33px;"
              class="verifyCodeImg"
            />
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="comfireDialogBanaVTwo()">确 定</el-button>
        <el-button class="btnBg" @click="cancelDialogBanaVTwo()">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 删除操作 -->
    <el-dialog title="确认删除" :visible.sync="ShowDailogBanaDelete" width="30%" center>
      <el-input v-model="delAcitivity.verifyCode" auto-complete="off"></el-input>
      <img @click="codefile" :src="codeImgs" style="width:100px;height:33px" class="verifyCodeImg" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="ShowDailogBanaDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteEditTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StockDetailList",
  components: {},
  data: function() {
    return {
      ShowDailogBanaDelete: false,
      tableIdStr: "",
      showMod: false,
      labelName:{
        '货币基金':'万分收益率',
        '固收产品':'约定年化收益率',
        '权益基金':'净值',
      },
      stDetailList: [],
      codeImgs: "/game-ttkx-server/authImage?r=1543480447544",
      banaVTwoList: [],
      banaVThreeList: [],
      show: false, //新增or修改
      titleNameBanaVTwo: "修改信息",
      activityListData: {
        quotationImportRecordId: "",
        pageNo: 1,
        pageSize: 50
      },
      typeNameList: [
        {
          value: "货币基金",
          label: "货币基金"
        },
        {
          value: "固收产品",
          label: "固收产品"
        },
        {
          value: "权益基金",
          label: "权益基金"
        }
      ],
      activityId: "",
      addver: "",
      verifyCode: "",
      stDetailConfig: {
        fundName: "",
        fundType: "",
        fundCode: "",
        quotationImportRecordId: "",
        earningRate: "",
        verifyCode: "",
        deductionsNet: ""
      },
      delAcitivity: {
        bannerId: "",
        verifyCode: ""
      }
    };
  },
  created() {
    this.getParams();
  },
  mounted() {
    this.activetyCommList(this.activityListData);
  },
  methods: {
    codefile() {
      this.codeImgs = this.$mgui.refreshVerifyCode("game-ttkx-server");
    },
    datacomment(data) {
      return this.$moment(data).format("YYYY-MM-DD HH:mm:ss");
    },

    //活动列表
    activetyCommList(data) {
      this.$api
        .getStDetail(data)
        .then(res => {
          if (res.ret == 0) {
            let result = res.result;
            for (let i = 0; i < result.length; i++) {
              // 时间展示转化
              result[i].gmtModify = this.$mgui.formatDate(result[i].gmtModify);
            }
            this.stDetailList = result;
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    //关闭弹窗
    closeDialogs() {},
    //配置
    addBannerVTwo() {
      history.go(-1);
      this.addver = 0;
      this.showMod = true;
      this.stDetailConfig.name = "";
      this.stDetailConfig.picture = "";
      this.stDetailConfig.showImgUrl = "";
      this.banaVTwoList = [];
      this.banaVThreeList = [];
      this.stDetailConfig.jumplink = "";
      this.stDetailConfig.verifyCode = "";
      this.codeImgs = this.$mgui.refreshVerifyCode("game-ttkx-server");
    },

    goBack() {
      history.go(-1);
    },

    //确认配置
    comfireDialogBanaVTwo() {
      if (!this.stDetailConfig.fundName) {
        this.$message.error("请输入基金名称");
      } else if (!this.stDetailConfig.fundType) {
        this.$message.error("请输入基金类型");
      } else if (!this.stDetailConfig.fundCode) {
        this.$message.error("请输入基金编号");
      } else if (!this.stDetailConfig.earningRate) {
        this.$message.error("请输入收益率");
      } else if (!this.stDetailConfig.deductionsNet) {
        this.$message.error("请输入万分收益率/约定年化收益率/净值");
      } else {
        this.banaVTwoAdd(this.stDetailConfig);
      }
    },
    //取消配置
    cancelDialogBanaVTwo() {
      this.showMod = false;
    },
    //执行添加
    banaVTwoAdd(data) {
      if (this.addver == 0) {
        this.$api
          .updateStDetail(data)
          .then(res => {
            if (res.ret == 0) {
              this.activetyCommList(this.activityListData);
              this.showMod = false;
              this.$message({
                message: res.msg,
                type: "success"
              });
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          })
          .catch(err => {});
      } else {
        this.$api
          .updateStDetail(data)
          .then(res => {
            if (res.ret == 0) {
              this.activetyCommList(this.activityListData);
              this.showMod = false;
              this.$message({
                message: res.msg,
                type: "success"
              });
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
              this.codefile();
            }
          })
          .catch(err => {});
      }
    },
    //修改
    handleUpBana(row) {
      console.log("row", row);
      this.showMod = true;
      this.addver = 1;
      this.stDetailConfig.fundName = row.fundName;
      this.stDetailConfig.fundType = row.fundType;
      this.stDetailConfig.fundCode = row.fundCode;
      this.stDetailConfig.earningRate = row.earningRate;
      this.stDetailConfig.deductionsNet = row.deductionsNet;
      this.stDetailConfig.id = row.id;
      this.stDetailConfig.verifyCode = "";
      this.stDetailConfig.quotationImportRecordId = this.$route.query.id;
      this.codeImgs = this.$mgui.refreshVerifyCode("game-ttkx-server");
    },

    handleDeleteBana(row) {
      this.$router.push({
        path: "/FestivalList",
        query: {
          id: row.id,
          value: row.type
        }
      });
    },

    //确定删除
    deleteEditTrue() {
      this.$api
        .onReRemoveBanaVTwo(this.delAcitivity)
        .then(res => {
          if (res.ret == 0) {
            this.delAcitivity.verifyCode = "";
            this.ShowDailogBanaDelete = false;
            this.activetyCommList(this.activityListData);
            this.$message({
              message: res.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    getParams() {
      // 取到路由带过来的参数
      let routerParams = this.$route.query.id;
      this.activityListData.quotationImportRecordId = routerParams;
      this.stDetailConfig.quotationImportRecordId = routerParams;
    }
  }
};
</script>


<style lang="less">
.activityRedPack {
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;

  .rightBtn {
    float: right;
  }

  .el-table th {
    background-color: #f5f5f5;

    .cell {
      font-weight: bolder;
      font-size: 12px;
    }
  }

  .cell {
    text-align: center;
    font-size: 12px;
  }

  .dialog-redPack {
    .el-dialog {
      width: 50%;
      border-radius: 6px;
    }

    .el-tree {
      border: 1px solid #dcdfe6;
    }

    .taskError {
      display: none;
    }

    .taskError1 {
      display: none;
    }

    .rolesname.is-success .el-input__inner {
      border-color: #dcdfe6 !important;
    }

    .el-form-item {
      text-align: left;

      .el-form-item__label {
        line-height: 34px;
        width: 150px;
      }

      .el-form-item__content {
        width: 70%;
        line-height: 34px;

        .el-cascader {
          width: 240px;
          line-height: 34px;
        }

        .el-input__inner {
          height: 34px;
          line-height: 34px;
          width: 80%;
        }
      }
    }

    #codeimg {
      .el-form-item__content {
        width: 100px;
        line-height: 34px;
      }
    }

    #codeimgShare {
      .el-form-item__content {
        width: 100px;
        line-height: 34px;
      }
    }

    .el-dialog__header {
      padding: 0;

      .el-dialog__title {
        width: 100%;
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        text-indent: 5%;
        display: inline-block;
        background-color: #ecedef;
        padding: 5px 0;
        font-weight: bolder;
        border-radius: 6px 6px 0 0;
      }

      .el-dialog__headerbtn {
        display: none;
      }
    }

    .el-dialog__body {
      background-color: #f5f5f5;
      padding: 20px;
    }
  }

  > div {
    padding: 10px 0;
  }
}

.activity-icon-form {
  margin-top: 1rem;
  padding-left: 4rem;
}

.top-icon-item {
  position: relative;

  > i {
    position: absolute;
    top: 1rem;
    right: 3rem;
    color: red;
  }
}

/*#codeimg_ruleup {*/

/*    .el-form-item__content {*/
/*        width: 100px;*/
/*        line-height: 34px;*/
/*    }*/

.el-textarea__inner {
  height: 100px;
  min-height: 100px;
}
</style>
