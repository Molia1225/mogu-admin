<template>
  <!-- 基础配置 -->
  <div class="table-page">
    <CommonForm ref="commonForm"
                class="base-config-width"
                :dataGet="formDataGet"
                :formConfig="formConfig"
                @save="confirmUpdate"
                :showCancel="false"
                :refreshDialog="refreshDialog"
                :server="codeServer"></CommonForm>
  </div>
</template>

<script>
import CommonForm from '@/components/template/CommonForm'
export default {
  name: 'ShareList',
  components: {
    CommonForm,
  },
  data() {
    return {
      getConfigApi: 'queryOrgConfByList',
      saveApi: 'saveOrgConf',
      requestData: {
        confKey: 'tyjShare',
        pageNo: 1,
        pageSize: 50,
      },

      codeServer: 'game-ttkx-server',
      refreshDialog: false,
      formDataGet: null,
      formConfig: [
        {
          label: 'H5分享标题',
          key: 'title',
          type: 'input',
          placeholder: '',
          value: '',
        },
        {
          label: 'H5分享描述',
          key: 'messages',
          type: 'input',
          placeholder: '',
          value: '',
        },
        /* {
          label: '分享图片链接',
          key: 'img_url',
          type: 'input',
          placeholder: '请输入分享图片链接',
          value: '',
        }, */
        {
          label: "H5分享图片",
          key: "img_url",
          type: "img",
          value: "",
          tip: "",
          limit: 0
        }
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
            // 返回数据是个列表，但是只会有一个
            if (!res.result[0]) {
              return
            }
            this.formDataGet = JSON.parse(res.result[0].confValue)
            this.formDataGet.id = res.result[0].id
            this.formDataGet.orgId = res.result[0].orgId
            // 刷新表单组件显示
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
      let data = result
      // 任务规则校验
      let item = {}

      // 加入校验规则

      // 后台接口居然是个列表，还分新增修改
      let api = this.saveApi
      console.log('[data]', data)

      let saveData = {
        confKey: 'tyjShare',
        confValue: {
          title: data.title,
          img_url: data.img_url,
          messages: data.messages,
        },
      }

      if (this.formDataGet && this.formDataGet.id) {
        saveData.id = this.formDataGet.id
        saveData.orgId = this.formDataGet.orgId
      }

      // 调用保存、修改接口
      this.$api[api](saveData)
        .then((res) => {
          this.$refs.commonForm.refreshVerifyCode()
          this.$refs.commonForm.verifyCode = ''
          if (res.ret === 0) {
            this.$message.success('保存成功')
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$refs.commonForm.refreshVerifyCode()
          this.$message.error('服务器异常')
        })
    },
  },
}
</script>


<style lang="less">
.base-config-width {
  width: 800px;
}
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
  .el-select {
    width: 25%;
    margin-right: 10px;
  }
  .el-select .el-input {
    width: 100%;
  }
}
</style>
