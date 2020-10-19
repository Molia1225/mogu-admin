<template>
  <div class="activityGift">
    <div class="crumbs">
      <el-breadcrumb style="padding-top:6px;" separator="/">
        <el-breadcrumb-item style="cursor: pointer;">
          <span style="color: #409EFF;" v-on:click="back">场次列表</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>中奖名单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="panel-box">
      <el-form :inline="true" class="screen-name">
        <el-form-item label="是否中奖">
          <el-select v-model="value1" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖品类型">
          <el-select v-model="value2" clearable placeholder="请选择">
            <el-option
              v-for="item in optionType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="value3"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="value4"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="value5"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="value6"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="checkList">查询</el-button>
        </el-form-item>

        <!-- <el-form-item> -->
          <!-- <el-button type="primary" @click="checkValue">奖励总和</el-button> -->
          <!-- <el-button type="primary" @click="exportTemplate">导出名单</el-button> -->
        <!-- </el-form-item> -->
      </el-form>
    </div>

    <div class="panel-box">
      <el-table ref="singleTable" border :data="activityList" tooltip-effect="light">
        <el-table-column type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
        <el-table-column label="用户ID" prop="userId" min-width="120"></el-table-column>
        <el-table-column label="昵称" prop="userName" min-width="120"></el-table-column>
        <el-table-column label="获取时间" prop="dayTime" min-width="120"></el-table-column>
        <el-table-column label="体验金金额" prop="prizeValue" min-width="120"></el-table-column>
        <el-table-column label="是否中奖" prop="status" min-width="120">
          <template slot-scope="scope">{{scope.row.status == 0 ? '否' : '是'}}</template>
        </el-table-column>
        <el-table-column label="奖品类型" prop="prizeType" min-width="120">
          <template slot-scope="scope">{{scope.row.prizeType == 'silver_draft' ? '体验金' : scope.row.prizeType}}</template>
        </el-table-column>

        <el-table-column label="奖品名称" prop="prizeName" min-width="120"></el-table-column>
        <el-table-column label="状态" prop="prizeStatus" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.prizeType == 'silver_draft'">
              <span>已发放</span>
            </span>
            <span v-else>
              <span v-if="scope.row.status == 0"></span>
              <span v-else-if="scope.row.status == 1">已领取未发放</span>
              <span v-else-if="scope.row.status == 2">已发送</span>
              <span v-else-if="scope.row.status == 3">用户已收到</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="发放状态" prop="redPacketStatus" min-width="80"></el-table-column>
        <el-table-column label="失败原因" prop="sendErrorCode" min-width="80"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
      :page-size="50"
      layout="total, prev, pager, next"
      :total="totleData"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "WinningCheck",
  components: {},
  data() {
    return {
      tips: "不超过10个汉字，含标点符号",
      ShowDailogOne: false,
      titieName: "新建活动",
      options: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      value1: "",
      optionType: [
        {
          value: "silver_draft",
          label: "体验金"
        }
      ],
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: "",
      statusType: [
        {
          value: 0,
          label: "未领取"
        },
        {
          value: 1,
          label: "已领取未发放"
        },
        {
          value: 2,
          label: "已发送"
        },
        {
          value: 3,
          label: "用户已收到"
        }
      ],
      value5: "",
      activityList: [],
      activityId: {
        tableId: ""
      },
      checkForm: {
        tableId: "",
        pageNo: 1,
        pageSize: 50,
        status: "",
        userId: "",
        openId: "",
        nickName: "",
        beginTime: "",
        endTime: "",
        prizeType: "",
        prizeName: "",
        prizeSecName: "",
        mobile: ""
      },
      currentPage1: 1,
      totleData: 0,
      types: "", //摇钱树和红包雨type
      priceValueTotle: 0
    };
  },
  mounted() {
    this.getParams();
    this.getWinnerList(this.checkForm);
  },
  methods: {
    //毫秒转日期
    datacomment(data) {
      return this.$mgui.formatDate(data);
    },
    //日期转毫秒
    miaocomment(data) {
      return Date.parse(data);
    },
    indexMethod(index) {
      let thisPage = index + 1 + (this.checkForm.pageNo - 1) * 10;
      return thisPage;
    },
    handleCurrentChange(val) {
      this.checkForm.pageNo = val;
      this.getWinnerList(this.checkForm);
    },
    checkList() {
      this.priceValueTotle = 0;
      this.checkForm.pageNo = 1;
      this.currentPage1 = 1;
      this.checkForm.status = this.value1;
      this.checkForm.prizeType = this.value2;
      this.checkForm.nickName = this.value5;
      this.checkForm.userId = this.value6;

      if (this.value3 == "" || this.value3 == null) {
        this.value3 == "";
        this.checkForm.beginTime = "";
      } else {
        this.checkForm.beginTime = this.miaocomment(this.value3);
      }
      if (this.value4 == "" || this.value4 == null) {
        this.value4 == "";
        this.checkForm.endTime = "";
      } else {
        this.checkForm.endTime = this.miaocomment(this.value4);
      }
      this.getWinnerList(this.checkForm);
    },
    checkValue() {
      this.getWinnerListAll(this.checkForm);
    },

    //模板导出excel
    exportTemplate() {
      this.$message({
        message: "接口未完成",
        type: "error"
      });
      return;
      let searchInfo = {};

      this.$api
        .exportPrizeInfo(searchInfo)
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

    // 取到路由带过来的参数
    getParams() {
      let routerParams = this.$route.query.id;
      this.activityId.tableId = routerParams;
      this.checkForm.tableId = routerParams;
      this.types = this.$route.query.value;
      console.log("111");
      console.log(this.types);
    },
    back() {
      history.go(-1);
    },
    //中奖列表数据
    getWinnerList(data) {
      data.pageSize = 50;
      this.$api
        .onReQueryUserPrizeByPage(data)
        .then(res => {
          if (res.ret == 0) {
            this.activityList = res.userPrizeList;
            this.totleData = res.totalCount;
            this.activityList.forEach(item => {
              this.$set(item, "dayTime", this.datacomment(item.gmtCreate));
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
    //中奖列表的所有数据
    getWinnerListAll(data) {
      data.pageSize = 100000;
      console.log("1222");
      console.log(data);
      this.$api
        .onReQueryUserPrizeByPage(data)
        .then(res => {
          if (res.ret == 0) {
            let totleValue = res.userPrizeList;
            totleValue.forEach(item => {
              this.priceValueTotle += Number(item.prizeValue);
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
    HandleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },

    //确定
    comfireDialogOne() {}
  }
};
</script>


<style lang="less">
.activityGift {
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
      width: 580px;
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
      }

      .el-form-item__content {
        width: 240px;
        line-height: 34px;

        .el-cascader {
          width: 240px;
          line-height: 34px;
        }

        .el-input__inner {
          height: 34px;
          line-height: 34px;
        }
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
</style>

