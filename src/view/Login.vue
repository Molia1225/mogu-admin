<template>
  <div class="login-wrap">
    <div class="ms-login">
		<div class="ms-title" style="position:relative;">后台管理系统登录</div>

		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
			<el-form-item prop="loginname">
				<el-input v-model="ruleForm.loginname" placeholder="请输入用户名">
					<el-button slot="prepend" tabindex="-1">用户名</el-button>
				</el-input>
			</el-form-item>


			<el-form-item prop="pwd">
				<el-input type="password" placeholder="请输入密码" v-model="ruleForm.pwd">
					<el-button slot="prepend" tabindex="-1">密<span class="txt-hidden">码</span>码</el-button>
				</el-input>
			</el-form-item>

			<el-form-item prop="verifyCode">
				<el-input v-model="ruleForm.verifyCode" placeholder="请输入验证码" maxlength="4" minlength="4" class="verify-code-input1" @keyup.enter.native="submitForm('ruleForm')">
					<span slot="suffix">
						<img :src="authImage" class="verify-code-img" @click="refreshAuthImage">
					</span>
				</el-input>
			</el-form-item>

			<div class="login-btn">
				<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
			</div>
		</el-form>
    </div>
  </div>
</template>


<script>
import md5 from 'js-md5';
export default {
    data: function () {
        return {
            ruleForm: {
                loginname: "",
                pwd: "",
                verifyCode: ""
            },
            rules: {
                loginname: [{
                    required: true,
                    message: "请输入用户名",
                    trigger: "blur"
                }],
                pwd: [{
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                }],
                verifyCode: [{
                    required: true,
                    message: "请输入验证码",
                    trigger: "blur"
                }]
            },
            authImage: ""
        };
	},


	mounted() {
		this.refreshAuthImage()
	},


    methods: {
		// 刷新验证码
		refreshAuthImage() {
			this.authImage = this.$api.refreshVerifyCode();
		},
		// 登录提交表单
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
					let ruleForm={
                		loginname: this.ruleForm.loginname,
                		pwd: md5(this.ruleForm.pwd+'+mgcf'),
						verifyCode: this.ruleForm.verifyCode,
						encrypt:1
            		}
                    this.$api.login(ruleForm).then(data => {
                        if (data.ret === 0) {
							this.$router.replace("/ActConfig");
							sessionStorage.setItem("ms_username",this.ruleForm.loginname);
                        } else {
							this.refreshAuthImage()
                            this.$message(data.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        }
    }
}

</script>


<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		background: #242f42;
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url("../assets/login-bg.jpg");
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
	.ms-title {
		width: 100%;
		line-height: 50px;
		text-align: center;
		font-size: 20px;
		color: #fff;
		border-bottom: 1px solid #ddd;
	}
	.ms-login {
		width: 350px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.3);
		overflow: hidden;
	}
	.ms-content {
		padding: 30px 30px;
	}
	.login-btn {
		text-align: center;
	}
	.login-btn button {
		width: 100%;
		height: 40px;
		margin-bottom: 10px;
	}
	.verify-code-input1 {
		width: 100%;
	}
	.verify-code-img {
		width: 75px;
		height: 32px!important;
		vertical-align: middle;
		margin-top: -4px;
		margin-right: -4px;
		border-radius: 0 4px 4px 0;
	}
	.txt-hidden {
		visibility: hidden;
	}
</style>
