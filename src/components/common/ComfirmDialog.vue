<template>
  <el-dialog title="提示" :visible.sync="visible" width="20%" center :show-close="false" 
    :close-on-click-modal="false" @close="closeDialog">
    <div class="del-dialog-cnt">确认{{confirmText}}？</div>
    <div class="verify-code-box">
      <el-input v-model="verifyCode" placeholder="请输入验证码" size="medium"
                maxlength="4" minlength="4" class="verify-code-input"></el-input>
      <img :src="authorImage" class="verify-code-img" @click="()=>{authorImage = $api[authImageType]()}">
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelOperation">取 消</el-button>
      <el-button type="primary" @click="confirmOperation">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: ''
    },
    changeAuthorImage: {
      type: Boolean,
      default: false
    },
    authImageType: {
      type: String,
      default: 'onAuthImage'
    }
  },
  model: {
    prop: 'visible',
    event: 'change-visible'
  },
  watch: {
    changeAuthorImage (newVal) {
      this.authorImage = this.$api[this.authImageType]()
    }
  },
  data () {
    return {
      verifyCode: '',
      authorImage: this.$api[this.authImageType]()
    }
  },
  methods: {
    confirmOperation () {
      this.$emit('confirm-handler', this.verifyCode)
      this.verifyCode = ''
    },
    cancelOperation () {
      this.$emit('change-visible', false)
      this.verifyCode = ''
    },
    closeDialog () {
      this.authorImage = this.$api[this.authImageType]()
      this.$emit('close-dialog')
    }
  }
}
</script>

<style lang="less" scoped>
  .del-dialog-cnt{
    text-align: center;
  }
  .verify-code-box{
    margin-top: 15px;
    text-align: center!important;
  }
  .verify-code-img{
    width: 90px;
    height: 36px;
    display: inline-block;
    vertical-align: middle;
  }
  .verify-code-input{
    width: 150px!important;
  }
</style>

