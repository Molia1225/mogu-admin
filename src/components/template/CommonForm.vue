<template>
	<!-- 通用弹窗初版，时间有限，未完善，如默认值，功能等，没有注释的地方准备写一份readme说明 -->
	<div>
		<el-form :model="formModel"
						 label-width="140px">
			<slot name="header"></slot>
			<!-- 表单列表   -->
			<el-form-item v-for="item in formData"
										:key="item.key"
										:label="item.label"
										:class="{ 'is-required': item.require }"
										v-show="item.show">
				<template v-if="item.type === 'input'">
					<el-input v-model.trim="formModel[item.key]"
										:placeholder="item.placeholder"
										:disabled="item.disable"
										:maxlength="item.maxlength"
										show-word-limit
										auto-complete="off"
										type="text"></el-input>
				</template>
				<template v-else-if="item.type === 'textarea'">
					<el-input v-model.trim="formModel[item.key]"
										:placeholder="item.placeholder"
										:disabled="item.disable"
										:maxlength="item.maxlength"
										show-word-limit
										auto-complete="off"
										type="textarea"></el-input>
				</template>
				<template v-else-if="item.type === 'select'">
					<el-select v-model="formModel[item.key]"
										 :placeholder="item.placeholder"
										 @change="onTypeChange"
										 :disabled="item.disable">
						<el-option v-for="it in item.options"
											 :key="it.value"
											 :label="it.label"
											 :value="it.value">
						</el-option>
					</el-select>
				</template>
				<template v-else-if="item.type === 'date'">
					<div class="block">
						<el-date-picker v-model="formModel[item.key]"
														:disabled="item.disable"
														:type="item.dateType"
														value-format="yyyy-MM-dd HH:mm:ss"
														placeholder="选择日期时间"
														range-separator="至"
														start-placeholder="开始日期"
														end-placeholder="结束日期">
						</el-date-picker>
					</div>
				</template>
				<template v-else-if="item.type === 'img'">
					<el-upload :on-success="
                            function(res, file, fileList) {
                                return uploadSuccess(res, item);
                            }
                        "
										 drag
										 :action="$api.uploadSnsImage()"
										 :before-upload="
                            function(file) {
                                return beforeUpload(file, item);
                            }
                        "
										 :on-remove="
                            function(res, file) {
                                return onRemove(file, item);
                            }
                        "
										 :limit="1"
										 list-type="picture"
										 :file-list="formModel[item.listName]">
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">
							将文件拖到此处，或<em>点击上传</em>
						</div>
					</el-upload>
				</template>
				<template v-else-if="item.type === 'edit'">
					<quill-editor v-model="formModel[item.key]"></quill-editor>
				</template>
			</el-form-item>
			<slot></slot>
			<el-form-item label="验证码"
										class="is-required verify-code"
										v-if="showVerifyCode">
				<el-input v-model.trim="verifyCode"
									auto-complete="off"
									maxlength="4"></el-input>
				<img @click="refreshVerifyCode"
						 :src="codeImgs"
						 class="verify-code-img" />
			</el-form-item>
		</el-form>
		<div slot="footer"
				 class="dialog-footer"
				 style="text-align:center;">
			<el-button type="primary"
								 @click="confirm()">确 定</el-button>
			<el-button class="btnBg"
								 @click="cancel()"
								 v-if="showCancel">取 消</el-button>
		</div>
	</div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
export default {
	name: 'CommonForm',
	props: {
		showCancel: {
			type: Boolean,
			default: true,
		},
		showVerifyCode: {
			type: Boolean,
			default: true,
		},
		formConfig: {
			type: Array,
			default() {
				return []
			},
		},
		dataGet: {
			type: Object,
			default() {
				return {}
			},
		},
		server: {
			type: String,
			default: 'game-ttkx-server',
		},
		refreshDialog: {
			type: Boolean,
			default: false,
		},
		disableList: {
			type: Array,
			default() {
				return []
			},
		},
	},
	components: {
		quillEditor,
	},
	data() {
		return {
			api: '',
			verifyCode: '',
			codeImgs: '',
			// 没有校验格式，可以为空，有值是确保传入数据正确
			formData: [],
			formModel: {},
			indexObj: {},
		}
	},
	watch: {
		refreshDialog() {
			this.init()
		},
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			let formData = JSON.parse(JSON.stringify(this.formConfig))
			let indexObj = {}
			// 建立总表单索引（可保存于created时）
			for (let i = 0; i < formData.length; i++) {
				formData[i].show = formData[i].show === false ? false : true
				formData[i].disable = formData[i].disable || false
				indexObj[formData[i].key] = formData[i]
			}
			this.indexObj = indexObj
			this.setformData(formData, this.dataGet)
		},
		// 设置表单，config必传，dataGet为对象类型
		setformData(config = [], dataGet = null) {
			let obj = {}
			if (dataGet) {
				if (typeof dataGet !== 'object') {
					console.log('CommomForm组件传入的dataGet不是个对象')
					return
				} else if (dataGet instanceof Array) {
					console.log('CommomForm组件传入的dataGet是个数组')
					return
				}
				// 回显数据处理
				this.dealDataGet(config, obj, dataGet)
				if (this.disableList.length) {
					this.disableList.forEach((item) => {
						this.indexObj[item].disable = true
					})
				}
			} else {
				// 初始化数据处理
				this.initFormData(config, obj, dataGet)
			}
			this.formData = config
			this.formModel = obj
			if (this.showVerifyCode) {
				this.verifyCode = ''
				this.refreshVerifyCode()
			}
		},
		// 初始化表单配置
		initFormData(config, obj, dataGet) {
			config.forEach((item) => {
				switch (item.type) {
					case 'date':
						item.dateType = item.isDatetime ? 'datetime' : 'datetimerange'
						break
					case 'img':
						item['listName'] = item.key + 'List'
						obj[item.listName] = []
						break
					case 'select':
						{
							if (item.value) {
								this.onTypeChange(item.value)
							}
						}
						break
					default:
						break
				}
				obj[item.key] = item.value || (item.value === 0 ? 0 : '')
			})
		},
		// 处理接口返回的数据
		dealDataGet(config, obj, dataGet) {
			config.forEach((item) => {
				switch (item.type) {
					case 'date':
						{
							// 区分时间区间还是单个时间
							if (item.isDatetime) {
								item.dateType = 'datetime'
								obj[item.key] = this.$mgui.formatDate(Number(dataGet[item.key]))
								return
							}
							item.dateType = 'datetimerange'
							item.valStart = dataGet[item.keyStart] || ''
							item.valEnd = dataGet[item.keyEnd] || ''
							if (typeof item.valStart === 'number') {
								item.valStart = this.$mgui.formatDate(item.valStart)
								item.valEnd = this.$mgui.formatDate(item.valEnd)
							}
							obj[item.key] = [item.valStart, item.valEnd]
						}
						break
					case 'img':
						{
							item['listName'] = item.key + 'List'
							item.value = dataGet[item.key] || ''
							obj[item.listName] = item.value
								? [{ name: item.label, url: item.value }]
								: []
							obj[item.key] = item.value
						}
						break
					case 'select':
						{
							if (dataGet[item.key] === null) {
								dataGet[item.key] = ''
							}
							if (item.isRelate && dataGet[item.key] !== '') {
								item.value = item.key + ':::' + dataGet[item.key]
								this.onTypeChange(item.value)
							} else {
								item.value = dataGet[item.key]
							}
							obj[item.key] = item.value
						}
						break
					default:
						{
							if (dataGet[item.key] === null) {
								dataGet[item.key] = ''
							}
							item.value = dataGet[item.key]
							obj[item.key] = item.value
						}
						break
				}
			})
		},
		// 点击确定
		confirm() {
			let result = {}
			let length = this.formData.length
			for (let i = 0; i < length; i++) {
				let item = this.formData[i]
				// 隐藏的输入不作为发送的数据
				if (!item.show) {
					continue
				}
				// 非空校验  不支持select的值为‘’
				if (item.require) {
					if (
						this.formModel[item.key] === null ||
						this.formModel[item.key] === '' ||
						typeof this.formModel[item.key] === 'undefined'
					) {
						this.$message.error(`${item.label}不能为空。`)
						return
					}
					if (this.formModel[item.key].length === 0) {
						this.$message.error(`${item.label}不能为空。`)
						return
					}
				}

				// 正则校验
				if (item.regExp) {
					// regExp属性是字符串时直接校验正则
					if (typeof item.regExp === 'string') {
						if (
							(this.formModel[item.key] + '').search(
								new RegExp(item.regExp)
							) === -1
						) {
							this.$message.error(item.regTip)
							return
						}
					} else {
						// 是对象时目前只支持最大最小值，以及正则（原因是判断大小用正则太费劲了）
						if (
							item.regExp.reg &&
							(this.formModel[item.key] + '').search(
								new RegExp(item.regExp.reg)
							) === -1
						) {
							this.$message.error(item.regTip)
							return
						}
						// 上限判断
						if (item.regExp.max && this.formModel[item.key] > item.regExp.max) {
							this.$message.error(item.regTip)
							return
						}
						// 下限判断
						if (item.regExp.min && this.formModel[item.key] < item.regExp.min) {
							this.$message.error(item.regTip)
							return
						}
					}
				}
				// 生成表单数据
				if (item.type === 'date') {
					if (item.isDatetime) {
						result[item.key] = Date.parse(this.formModel[item.key])
						continue
					}
					// 日期组件处理
					result[item.keyStart] = this.formModel[item.key][0]
						? Date.parse(this.formModel[item.key][0])
						: ''
					result[item.keyEnd] = this.formModel[item.key][1]
						? Date.parse(this.formModel[item.key][1])
						: ''
				} else {
					result[item.key] = this.formModel[item.key]
				}
				// 选择，:::符号判断是不是需要隐藏部分组件，去掉
				if (
					typeof this.formModel[item.key] === 'string' &&
					this.formModel[item.key].indexOf(':::') > -1
				) {
					result[item.key] = result[item.key].split(':::')[1]
				}
			}

			if (this.showVerifyCode) {
				if (!this.verifyCode) {
					this.$message.error('验证码不能为空！')
					return
				}
				result['verifyCode'] = this.verifyCode
			}
			console.log(result)
			this.$emit('save', result)
		},
		// 点击取消
		cancel() {
			this.$emit('close')
		},
		// 图片校验
		beforeUpload(file, item) {
			let isLimit = true
			if (item.limit) {
				isLimit = file.size / 1024 <= item.limit
				if (!isLimit) {
					this.$message.error(
						item.tip || `图片大于${item.limit}kb，请重新选择图片`
					)
				}
			}
			return isLimit
		},
		// 上传图片成功
		uploadSuccess(res, item) {
			this.formModel[item.key] = this.$mgui.getCdnImg(res.result)
			this.fileShareListAppActivityBg = [
				{ name: item.label, url: this.formModel[item.key] },
			]
		},
		// 删除图片
		onRemove(file, item) {
			this.formModel[item.key] = ''
			this.formModel[item.key + 'List'] = []
		},
		// 刷新验证码
		refreshVerifyCode() {
			this.codeImgs = this.$mgui.refreshVerifyCode(this.server)
		},
		// 表单类型变化重组表单列表，::: 是为了拼凑value值，value值由当前key值跟value值组成,key是为了绑定同一事件的selector能找到绑定的js对象
		onTypeChange(val) {
			if (typeof val === 'string' && val.indexOf(':::') > -1) {
				let key = val.split(':::')[0]
				let options = this.indexObj[key].options
				this.changeRelate(options, val)
			}
		},
		// 遍历修改表单关联字段
		changeRelate(options, val) {
			// 遍历下拉选项找到选中的值
			for (let i = 0; i < options.length; i++) {
				let item = options[i]
				if (item.value !== val) {
					continue
				}
				// 遍历当前下拉关联的表单项
				for (let it in item.relateList) {
					let relateList = item.relateList[it]
					// relateList必须传入一个对象
					if (typeof relateList !== 'object') {
						this.$message.error(
							`${item.label}传入relateList的${relateList.key}不是一个对象`
						)
						return
					}
					// 遍历需要改的属性
					for (let i in relateList) {
						// 传入value的时候还要去改一下v-model的值
						if (i === 'value') {
							this.formModel[it] = relateList[i]
							// 递归修改下拉，待添加
							// if(this.indexObj[it].type==="select"){
							//     this.onTypeChange(relateList[i])
							// }
						}
						this.indexObj[it][i] = relateList[i]
					}
				}
				return
			}
		},
	},
}
</script>

<style lang="less">
.el-form-item:nth-child(7),.el-form-item:nth-child(8),.el-form-item:nth-child(9) {
	.el-form-item__label {
		line-height: 20px;
		vertical-align: middle;
	}
}
</style>
