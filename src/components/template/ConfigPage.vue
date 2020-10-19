<template>
  <div class="table-page">
    <CommonForm ref="commonForm"
                :dataGet="formDataGet"
                :formConfig="formConfig"
                @save="confirmUpdate"
                :showCancel="false"
                :refreshDialog="refreshDialog">
      <el-form-item label="任务分配规则"
                    class="task-rule-box is-required">
        <div class="task-rule-list"
             v-for="(item,index) in configArr"
             :key="index">
          <el-input v-model.trim="item.taskFatherType"
                    auto-complete="off"
                    maxlength="4"
                    placeholder="任务一级类型"></el-input>
          <el-input v-model.trim="item.number"
                    auto-complete="off"
                    maxlength="4"
                    placeholder="任务分配数量"></el-input>
          <el-input v-model.trim="item.weight"
                    auto-complete="off"
                    maxlength="4"
                    placeholder="权重"></el-input>
          <el-button type="primary"
                     v-if="index == 0"
                     @click="addConfig">增加</el-button>
          <el-button type="danger"
                     v-else
                     @click="deleteConfig(index)">删除</el-button>
        </div>
      </el-form-item>
    </CommonForm>
  </div>
</template>

<script>
/**
 * 本模版为纯配置页面，主要是表单组件的应用
 */
import CommonForm from '@/components/template/CommonForm'
export default {
  name: 'ConfigPage',
  components: {
    CommonForm,
  },
  data() {
    return {
      getConfigApi: 'onReTableList',
      saveApi: 'onReSaveTable',
      requestData: {
        pageNo: 1,
        pageSize: 50,
      },
      configArr: [
        {
          taskFatherType: '',
          number: '',
          weight: '',
        },
      ],
      refreshDialog: false,
      formDataGet: {},
      formConfig: [
        {
          label: '游戏规则',
          key: 'rule',
          type: 'edit',
          maxlength: 100000,
          placeholder: '',
          value: '',
          require: true,
        },
        {
          label: '小程序分享标题',
          key: 'shareTitle',
          type: 'input',
          maxlength: 10,
          placeholder: '',
          value: '',
        },
        {
          label: '小程序分享副标题',
          key: 'shareContent',
          type: 'input',
          maxlength: 20,
          placeholder: '',
          value: '',
        },
        {
          label: '小程序分享图片',
          key: 'shareImage',
          type: 'img',
          value: '',
          tip: '',
          limit: 0,
        },
        {
          label: '小程序分享URL',
          key: 'shareUrl',
          type: 'input',
          maxlength: 1000,
          placeholder: '',
          value: '',
        },
        {
          label: 'APP分享标题',
          key: 'appShareTitle',
          type: 'input',
          maxlength: 10,
          placeholder: '',
          value: '',
        },
        {
          label: 'APP分享副标题',
          key: 'appShareContent',
          type: 'input',
          maxlength: 20,
          placeholder: '',
          value: '',
        },
        {
          label: 'APP分享图片',
          key: 'appShareImage',
          type: 'img',
          value: '',
          tip: '',
          limit: 0,
        },
        {
          label: 'APP分享URL',
          key: 'appShareUrl',
          type: 'input',
          maxlength: 1000,
          placeholder: '',
          value: '',
        },
        {
          label: '落地页文案',
          key: 'landTip',
          type: 'input',
          maxlength: 20,
          placeholder: '',
          value: '',
        },
        {
          label: '落地页背景',
          key: 'landBgUrl',
          type: 'img',
          value: '',
          tip: '',
          limit: 0,
        },
      ],
    }
  },
  mounted() {
    this.geConfigData()
  },
  methods: {
    // 获取表格数据
    geConfigData() {
      this.$api[this.getConfigApi](this.requestData)
        .then((res) => {
          if (res.ret === 0) {
            // 返回数据处理，赋值到表单
            this.formDataGet = res.result
            this.refreshDialog = !this.refreshDialog
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error('服务器异常')
        })
    },
    // 确认修改/新增
    confirmUpdate(result) {
      // 表单数据，特殊数据处理，如增加默认发送的数据（后台经常需要）
      let item = {}
      for (let i = 0; i < this.configArr.length; i++) {
        item = this.configArr[i]
        if (
          item.taskFatherType === '' ||
          item.number === '' ||
          item.weight === ''
        ) {
          this.$message.error('请完善任务规则')
          return
        }
      }

      let data = result
      data.configStr = JSON.stringify(this.configArr)

      this.$api[this.saveApi](data)
        .then((res) => {
          this.refreshVerifyCode()
          if (res.ret === 0) {
            this.$message.success('保存成功')
            this.commonDialogVisible = false
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.refreshVerifyCode()
          this.$message.error('服务器异常')
        })
    },
    addConfig() {
      this.configArr.push({
        taskFatherType: '',
        number: '',
        weight: '',
      })
    },
    deleteConfig(index) {
      this.configArr.splice(index, 1)
    },
  },
}
</script>


<style lang="less">
.task-rule-box {
  .task-rule-list {
    position: relative;
    margin-bottom: 10px;
  }
  .task-rule-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
  label {
    float: none;
    display: block;
  }
  .el-input {
    width: 25%;
    margin-right: 10px;
  }
}
</style>
