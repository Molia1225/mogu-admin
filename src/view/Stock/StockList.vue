<template>
  <div class="activityRedPack">
    <div class="panel-box">
      <el-form :inline="true" class="screen-name">
        <el-form-item class="rightBtn">
          <!-- <el-button type="primary" @click="exportTemplate">模板下载</el-button> -->
          <!-- <el-button type="primary" @click="uploadST">上传Excel行情</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="panel-box">
      <el-table ref="singleTable" border :data="ImprotList" tooltip-effect="light">
        <el-table-column label="日期" prop="settlementDateTime"></el-table-column>
        <el-table-column label="上传时间" prop="uploadQuotationTime"></el-table-column>
        <el-table-column label="更新基金数" prop="settlementCount"></el-table-column>
        <el-table-column label="结算场次" prop="keyId">
          <template slot-scope="scope">{{scope.row.keyId?roundType[scope.row.keyId-1]:""}}</template>
        </el-table-column>
        <el-table-column label="是否结算" prop="isSettlement">
          <template slot-scope="scope">{{settlementState[scope.row.isSettlement]}}</template>
        </el-table-column>
        <el-table-column label="操作" prop="isSettlement">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isSettlement==0" @click="handleSettlement(scope.row)" type="text" size="small">结算</el-button>
            <el-button style="color:gray;" v-else  type="text" size="small">已结算</el-button>
            <el-button @click="gotoStDetail(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 导入文件弹窗 -->
    <el-dialog title="上传行情" :visible.sync="uploadShow" width="400px" top="40px">
      <el-upload
        ref="uploadRef"
        :on-success="uploadSuccess"
        drag
        :action="$api.uploadST()"
        :on-remove="function(res, file){return onRemove(file, fileList, item)}"
        name="excelFile"
        :limit="1"
        list-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </el-dialog>

    <!-- 修改/新增 弹窗 -->
    <el-dialog
      class="dialog-redPack"
      :visible.sync="ShowDailogBanaVTwo"
      :title="sunbmitTitle"
      @close="closeSubmit"
    >
      <p class="submit-acount">当日清算完成后，不可再清算昨日及之前数据！</p>
      <el-form style="margin-bottom:-30px;" label-width="100px">
        <el-form-item label="验证码" class="is-required">
          <el-input
            style="width:100px;transform:translateY(-11px);"
            v-model="verifyCode"
            maxlength="4"
            minlength="4"
            auto-complete="off"
          ></el-input>
          <img
            @click="codefile"
            :src="codeImgs"
            style="width:100px;height:33px"
            class="verifyCodeImg"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="submitSettlement()">确 定</el-button>
        <el-button class="btnBg" @click="closeSubmit()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StockList",
  components: {},
  data: function() {
    return {
      ShowDailogBanaVTwo: false,
      uploadShow: false,
      isSettle:false,
      roundType: ['现金管理','固收+投资','权益投资','资产配置'],
      settlementState: ['否','是','结算中','结算失败'],
      verifyCode: "",
      ImprotList: [],
      setID: "",
      codeImgs: "/game-ttkx-server/authImage?r=1543480447544",
      sunbmitTitle: "结算确认",
      activityListData: {
        tableId: "",
        pageNo: 1,
        pageSize: 50
      },
      stImportConfig: {
        tableId: "",
        uploadQuotationTime: "",
        settlementCount: "",
        isSettlement: 0
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
    // 导入
    uploadST() {
      this.uploadShow = true;
    },

    //活动列表
    activetyCommList(data) {
      this.$api
        .getImportRecord(data)
        .then(res => {
          if (res.ret == 0) {
            let result = res.result.list;
            for (let i = 0; i < result.length; i++) {
              // 时间展示转化
              if (result[i].settlementDateTime) {
                result[i].settlementDateTime = this.$mgui.formatDate(
                  result[i].settlementDateTime,
                  "YYYY-MM-DD "
                );
              } else {
                result[i].settlementDateTime = "无";
              }
              result[i].uploadQuotationTime = this.$mgui.formatDate(
                result[i].uploadQuotationTime
              );
            }
            this.ImprotList = result;
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },

    uploadSuccess(res) {
      if (res.ret === 0) {
        this.$refs.uploadRef.clearFiles()
        this.uploadShow = false;
        this.$message.success("导入成功！");
        this.activetyCommList(this.activityListData);
      } else {
        this.$refs.uploadRef.clearFiles()
        this.$message.error(res.msg);
      }
    },

    //模板导出excel
    exportTemplate() {
      this.$api
        .stockTemplate()
        .then(res => {
          const blob = new Blob([res], { type: "application/vnd.ms-excel" });
          const fileName = "行情源模板.xls";
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = window.URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },

    //修改
    handleSettlement(row) {
      if (row.isSettlement != 0) {
        this.$message.error("该记录已结算");
      } else {
        this.verifyCode = '';
        this.codefile();
        this.setID = row.id;
        this.ShowDailogBanaVTwo = true;
      }
    },

    //取消结算
    closeSubmit() {
      this.ShowDailogBanaVTwo = false;
    },

    //结算
    submitSettlement() {
      if(this.isSettle){
        return;
      }
      this.isSettle = true;
      this.$api
        .goSettlement({
          quotationImportRecordId: this.setID,
          verifyCode: this.verifyCode
        })
        .then(res => {
          this.isSettle = false;
          if (res.ret == 0) {
            this.$message.success("开始结算");
            this.activetyCommList(this.activityListData);
            this.ShowDailogBanaVTwo = false;
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});

    },

    gotoStDetail(row) {
      this.$router.push({
        path: "/StockDetailList",
        query: {
          id: row.id,
          value: row.type
        }
      });
    },

    getParams() {
      // 取到路由带过来的参数
      let routerParams = this.$route.query.tableId;
      this.activityListData.tableId = routerParams;
      this.stImportConfig.tableId = routerParams;
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
      width: 35%;
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

.submit-acount {
  font-size: 16px;
  margin-bottom: 15px;
  text-align: center;
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
.el-textarea__inner {
  height: 100px;
  min-height: 100px;
}
</style>
