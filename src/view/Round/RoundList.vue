<template>
  <div class="table-page">
    <!-- 搜索、新建 -->
    <div class="crumbs">
      <el-button style="float:right;"
                 type="primary"
                 @click="addRow">新建场次</el-button>
      <el-button style="float:right;margin-right:10px;"
                 type="primary"
                 @click="addSend">T-1日未抽奖和未获得邀请奖励名单下载</el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item style="cursor: pointer">
          <span style="color: #409EFF;"
                v-on:click="back">活动配置</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>场次列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表格 -->
    <div>
      <el-table border
                :data="tableLists"
                tooltip-effect="light">
        <el-table-column type="index"
                         label="序号"></el-table-column>
        <el-table-column label="活动场次"
                         prop="activityName"></el-table-column>
        <el-table-column label="创建时间"
                         prop="gmtCreateStr"></el-table-column>
        <!-- <el-table-column label="上架时间" prop="upTimeStr"></el-table-column> -->
        <!-- <el-table-column label="下架时间" prop="downTimeStr"></el-table-column> -->
        <el-table-column label="开始时间"
                         prop="startTimeStr"></el-table-column>
        <el-table-column label="结束时间"
                         prop="endTimeStr"></el-table-column>
        <el-table-column label="活动奖品">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="gotoEditPrice(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="中奖查询">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="gotoSeeWinning(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column label="推送名单下载"
                         width="180px;">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="startSend(scope.row)"
                       size="mini">
              <span>参与名单</span>
            </el-button>
            <el-button type="text"
                       @click="endSend(scope.row)"
                       size="mini"
                       v-if="scope.row.keyId!=1">
              <span>首日未参与名单</span>
            </el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="modifyRow(scope.row)"
                       type="text"
                       size="small">修改</el-button>
            <el-button @click="deleteRow(scope.row)"
                       type="text"
                       size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="commonDialogTitle"
               :visible.sync="commonDialogVisible"
               width="590px"
               top="40px">
      <CommonForm ref="commonForm"
                  :formConfig="formConfig"
                  :dataGet="formDataGet"
                  @save="confirmUpdate"
                  @close="commonDialogVisible=false"
                  :refreshDialog="refreshDialog"
                  :server="codeServer"></CommonForm>
    </el-dialog>
    <!-- 删除操作 -->
    <el-dialog title="确认删除"
               :visible.sync="deleteDialogVisible"
               width="305px"
               center>
      <div class="is-required verify-code">
        <el-input v-model.trim="delData.verifyCode"
                  auto-complete="off"
                  maxlength="4"></el-input>
        <img @click="refreshVerifyCode"
             :src="codeImgs"
             class="verify-code-img" />
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CommonForm from '@/components/template/CommonForm'
export default {
  name: 'RoundList',
  components: {
    CommonForm,
  },
  data() {
    return {
      addSendLoading: false,
      startSendLoading: false,
      endSendLoading: false,
      getListApi: 'onReTableList', // 初始化获取表格接口
      saveRowApi: 'onReSaveTable', // 保存接口
      updateRowApi: 'onReSaveTable', //修改接口
      deleteRowApi: 'onReRemoveTable',
      codeImgs: '',
      codeServer: 'game-ttkx-server',
      refreshDialog: false,
      deleteDialogVisible: false, // 删除弹窗
      commonDialogVisible: false, // 公共弹窗，修改、新增等
      commonDialogTitle: '新增', //公共弹窗名称
      tableLists: [], // 表格数据
      // 查询接口参数
      requestData: {
        pageNo: 1,
        querySub: 1,
        pId: this.$route.query.id,
        pageSize: 50,
        type: 61,
      },
      // 删除接口参数
      delData: {
        tableId: '',
        verifyCode: '',
      },
      // 表单设置
      formConfig: [
        {
          label: '活动场次',
          key: 'keyId',
          value: '',
          type: 'select',
          require: true,
          options: [
            {
              value: '1',
              label: '现金管理',
            },
            {
              value: '2',
              label: '固收+投资',
            },
            {
              value: '3',
              label: '权益投资',
            },
            {
              value: '4',
              label: '资产配置',
            },
          ],
        },
        {
          label: '初始体验金',
          key: 'initUserExperienceMoney',
          type: 'input',
          maxlength: 8,
          placeholder: '',
          value: '',
          require: true,
          regExp: null,
          regTip: '',
        },
        // {
        //   label: "上架时间",
        //   key: "updownTime",
        //   type: "date",
        //   require: true,
        //   keyStart: "upTimeMil",
        //   keyEnd: "downTimeMil",
        //   valStart: "",
        //   valEnd: ""
        // },
        {
          label: '活动起止时间',
          key: 'activityTime',
          type: 'date',
          require: true,
          keyStart: 'startTimeMil',
          keyEnd: 'endTimeMil',
          valStart: '',
          valEnd: '',
        },
        {
          label: "每日中奖次数",
          key: "dayMaxPrizeCount",
          type: "input",
          maxlength: 10,
          placeholder: "每人每日最大中奖次数",
          value: 1,
          require: true,
          regExp: "^\\d+$",
          regTip: "每人每日最大中奖次数必须是非负整数。"
        },
        {
          label: "每日抽奖次数",
          key: "dayMaxDrawCount",
          type: "input",
          maxlength: 10,
          placeholder: "每人每日最大抽奖次数",
          value: 1,
          require: true,
          regExp: "^\\d+$",
          regTip: "每人每日最大中奖次数必须是非负整数。"
        },
        {
          label: "最大中奖次数",
          key: "maxPrizeCount",
          type: "input",
          maxlength: 10,
          placeholder: "整个场次每人最多能中奖的次数",
          value: 0,
          require: true,
          regExp: "^\\d+$",
          regTip: "最大中奖次数必须是非负整数。"
        },
        {
          label: "最大抽奖次数",
          key: "playCount",
          type: "input",
          maxlength: 10,
          placeholder: "整个场次每人最多抽奖的次数",
          value: 0,
          require: true,
          regExp: "^\\d+$",
          regTip: "最大抽奖次数必须是非负整数。"
        },
        {
          label: '新用户专享赠送金额',
          key: 'newUserExclusiveExperienceMoney',
          type: 'input',
          maxlength: 10,
          placeholder: '每位新用户可领取的金额',
          value: 0,
          require: true,
          regExp: '^\\d+$',
          regTip: '每日邀请有奖次数必须是非负整数。',
        },
        {
          label: '每日最大邀请赠送体验金人数',
          key: 'dayMaxGiveExperienceInviteUsers',
          type: 'input',
          maxlength: 10,
          placeholder: '每位新用户可领取的金额',
          value: 0,
          require: true,
          regExp: '^\\d+$',
          regTip: '每日邀请有奖次数必须是非负整数。',
        },
        {
          label: '每次邀请赠送金额',
          key: 'giveExperienceMoneyForInviteUser',
          type: 'input',
          maxlength: 10,
          placeholder: '每次邀请赠送体验金的金额',
          value: 0,
          require: true,
          regExp: '^\\d+$',
          regTip: '邀请一个用户赠送体验金金额必须是非负整数。',
        },
        /* {
          label: '兑换-体验金:乐米',
          key: 'exchangedRate',
          type: 'input',
          maxlength: 10,
          placeholder: '如1:20(注意:是半角)',
          value: 0,
          require: true,
          regExp: '[:]',
          regTip: '请输入正确的兑换比例',
        }, */
      ],
      formDataGet: null,
      title: '新建活动',
      downTime: 0,
      upTime: 0,
      roundType: {
        1: '现金管理',
        2: '固收+投资',
        3: '权益投资',
        4: '资产配置',
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    downLoad(url, loadingName, name) {
      if (this[loadingName]) {
        // this.$message({message: '正在下载中，可能需要一段时间，请稍等'});
        return
      }
      this[loadingName] = true

      let loading = this.$loading({
        lock: true,
        text: '正在下载中，可能需要几分钟，请稍等',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      // setTimeout(()=>{
      //   this[loadingName] = false;
      // },2000)
      // const elink = document.createElement("a");
      // elink.download = '';
      // elink.style.display = "none";
      // elink.href = url;
      // document.body.appendChild(elink);
      // elink.click();
      // URL.revokeObjectURL(elink.href); // 释放URL 对象
      // document.body.removeChild(elink);
      // this.$message({message: '正在下载中，可能需要一段时间，请稍等'});
      this.$axios({
        url: url,
        method: 'get',
        timeout: 120 * 60000,
        responseType: 'blob',
      })
        .then((res) => {
          const blob = new Blob([res])
          let fileName = '名单.txt'
          if (loadingName === 'addSendLoading') {
            fileName = 'T-1日未抽奖和未获得邀请奖励名单.txt'
          } else if (loadingName === 'endSendLoading') {
            fileName = '首日未参与名单.txt'
          } else if (loadingName === 'startSendLoading') {
            fileName = name + '参与名单.txt'
          }

          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = window.URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
          this[loadingName] = false
          loading.close()
        })
        .catch((error) => {
          this.$message({
            message: error,
            type: 'error',
          })
        })
    },
    addSend(row) {
      let url =
        location.origin +
        '/game-ttkx-server/intf/web/tyj/queryNotShareAndluckdrawRecord?ignoreCsrfToken=1'
      this.downLoad(url, 'addSendLoading')
    },
    endSend(row) {
      let url =
        location.origin +
        '/game-ttkx-server/intf/web/tyj/queryCurrentNotJoinRecord?ignoreCsrfToken=1&keyId=' +
        row.keyId +
        '&tableId=' +
        row.id
      this.downLoad(url, 'endSendLoading')
    },
    startSend(row) {
      let url =
        location.origin +
        '/game-ttkx-server/intf/web/tyj/queryLastEndActivityRecord?ignoreCsrfToken=1&keyId=' +
        row.keyId +
        '&name=' +
        row.activityName
      this.downLoad(url, 'startSendLoading', row.activityName)
    },
    back() {
      history.go(-1)
    },
    init() {
      this.title = this.$route.query.title || this.title
      this.upTime = parseInt(this.$route.query.upTime)
      this.downTime = parseInt(this.$route.query.downTime)
      this.getTableData()
    },
    // 获取表格数据
    getTableData() {
      this.$api[this.getListApi](this.requestData)
        .then((res) => {
          if (res.ret === 0) {
            // 处理获取到的表格数据
            this.dealTableData(res)
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error('服务器异常')
        })
    },
    // 处理返回的表格数据
    dealTableData(res) {
      let result = res.result
      for (let i = 0; i < result.length; i++) {
        // 时间展示转化
        result[i].gmtCreateStr = this.$mgui.formatDate(result[i].gmtCreate)
        // result[i].upTimeStr = this.$mgui.formatDate(result[i].upTime);
        // result[i].downTimeStr = this.$mgui.formatDate(result[i].downTime);
        result[i].startTimeStr = this.$mgui.formatDate(result[i].startTime)
        result[i].endTimeStr = this.$mgui.formatDate(result[i].endTime)
        // 后台修改的接口要的字段跟查询接口给的字段不一样，比较坑
        // result[i].upTimeMil = result[i].upTimeStr;
        // result[i].downTimeMil = result[i].downTimeStr;
        result[i].startTimeMil = result[i].startTimeStr
        result[i].endTimeMil = result[i].endTimeStr
      }
      this.tableLists = result
    },
    // 查看奖品
    gotoEditPrice(index, row) {
      this.$router.push({
        path: '/FestivalList',
        query: {
          id: row.id,
          value: row.type,
        },
      })
    },
    // 查看中奖
    gotoSeeWinning(index, row) {
      this.$router.push({
        path: '/WinningCheck',
        query: {
          id: row.id,
          value: row.type,
        },
      })
    },
    // 新增
    addRow() {
      this.formDataGet = {}
      this.formDataGet.keyId = '1'
      this.showCommonDialog('新建场次')
    },
    // 修改
    modifyRow(row) {
      console.log('[row]', row)
      this.formDataGet = row
      this.showCommonDialog('修改场次')
    },
    // 确认修改/新增
    confirmUpdate(result) {
      // 表单数据，特殊数据处理，如增加默认发送的数据（后台经常需要）
      let data = result
      // 修改判断
      let api = this.saveRowApi
      data.activityName = this.roundType[data.keyId]
      // data.upTimeMil = this.upTime;
      data.type = 61
      data.pId = this.$route.query.id
      if (this.formDataGet) {
        api = this.updateRowApi
        data.id = this.formDataGet.id
      }
      this.$api[api](data)
        .then((res) => {
          if (res.ret === 0) {
            this.$message.success('保存成功')
            this.commonDialogVisible = false
            // 刷新表格
            this.getTableData()
          } else {
            // 刷新验证码
            this.$refs.commonForm.refreshVerifyCode()
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$refs.commonForm.refreshVerifyCode()
          this.$message.error('服务器异常')
        })
    },
    // 点击删除，设置删除参数
    deleteRow(row) {
      this.delData.tableId = row.id
      this.refreshVerifyCode()
      this.delData.verifyCode = ''
      this.deleteDialogVisible = true
    },
    // 确认删除
    confirmDelete() {
      this.$api[this.deleteRowApi](this.delData)
        .then((res) => {
          this.refreshVerifyCode()
          if (res.ret === 0) {
            this.$message.success('删除成功')
            this.deleteDialogVisible = false
            // 刷新表格
            this.getTableData()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.refreshVerifyCode()
          this.$message.error('服务器异常')
        })
    },
    // 显示配置弹窗
    showCommonDialog(title) {
      this.commonDialogTitle = title
      this.refreshDialog = !this.refreshDialog
      this.commonDialogVisible = true
    },
    // 刷新验证码
    refreshVerifyCode() {
      this.codeImgs = this.$mgui.refreshVerifyCode(this.codeServer)
    },
  },
}
</script>


<style lang="less">
</style>
