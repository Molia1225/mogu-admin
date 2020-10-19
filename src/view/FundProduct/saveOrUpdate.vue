<!-- 新增基金产品弹框 -->
<template>
    <el-dialog
        :title="commonDialogTitle"
        :visible.sync="commonDialogVisible"
        :before-close="beforeClose"
        width="590px"
        top="40px"
    >
        <el-form
            ref="formName"
            :model="form"
            label-width="100px"
            :rules="rules"
        >
            <el-form-item label="活动场次" prop="type">
                <el-select v-model="form.type" placeholder="请选择活动场次">
                    <el-option :value="1" label="现金管理"></el-option>
                    <el-option :value="2" label="固收+投资"></el-option>
                    <el-option :value="3" label="权益投资"></el-option>
                    <el-option :value="4" label="资产配置"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="基金1代码">
                <el-row>
                    <el-col :span="10">
                        <el-input
                            v-model="form.fundList[0].fundCode"
                        ></el-input>
                    </el-col>
                    <el-col
                        :span="4"
                        style="text-align:right;padding-right:5px;"
                    >
                        权重
                    </el-col>
                    <el-col :span="8">
                        <el-input v-model="form.fundList[0].weight"> </el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="基金2代码">
                <el-row>
                    <el-col :span="10">
                        <el-input
                            v-model="form.fundList[1].fundCode"
                        ></el-input>
                    </el-col>
                    <el-col
                        :span="4"
                        style="text-align:right;padding-right:5px;"
                    >
                        权重
                    </el-col>
                    <el-col :span="8">
                        <el-input v-model="form.fundList[1].weight"> </el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="基金3代码">
                <el-row>
                    <el-col :span="10">
                        <el-input
                            v-model="form.fundList[2].fundCode"
                        ></el-input>
                    </el-col>
                    <el-col
                        :span="4"
                        style="text-align:right;padding-right:5px;"
                        >权重</el-col
                    >
                    <el-col :span="8">
                        <el-input v-model="form.fundList[2].weight"> </el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="展示时间" prop="showTime">
                <el-date-picker
                    v-model="form.showTime"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="上下架" prop="upStatus">
                <el-select
                    v-model="form.upStatus"
                    style="width: 100%"
                    placeholder="请选择"
                >
                    <el-option :value="1" label="上架"></el-option>
                    <el-option :value="0" label="下架"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="验证码"
                prop="verifyCode"
                class="is-required verify-code"
            >
                <el-input
                    v-model.trim="form.verifyCode"
                    auto-complete="off"
                    maxlength="4"
                ></el-input>
                <img
                    @click="refreshVerifyCode"
                    :src="codeImgs"
                    class="verify-code-img"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="onSubmit"
                    :loading="submitLoading"
                >
                    提交
                </el-button>
                <el-button @click="$emit('update:commonDialogVisible', false)">
                    取消
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import qs from "qs";
export default {
    components: {},
    data() {
        return {
            saveOrUPdateApi: "saveOrUpdate", // 保存接口
            codeImgs: "",
            submitLoading: false,
            commonDialogTitle: "新建广告位",
            server: "game-ttkx-server",
            // 表单设置
            form: {
                type: "",
                fundList: [
                    {
                        fundCode: "",
                        weight: ""
                    },
                    {
                        fundCode: "",
                        weight: ""
                    },
                    {
                        fundCode: "",
                        weight: ""
                    }
                ],
                showTime: "",
                upStatus: "",
                verifyCode: "test"
            },
            rules: {
                type: [
                    {
                        required: true,
                        message: "请选择活动场次",
                        trigger: "change"
                    }
                ],
                showTime: [
                    {
                        required: true,
                        message: "请选择展示时间",
                        trigger: "change"
                    }
                ],
                upStatus: [
                    {
                        required: true,
                        message: "请选择上下架",
                        trigger: "change"
                    }
                ],
                verifyCode: [
                    {
                        required: true,
                        message: "请填写验证码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    props: {
        commonDialogVisible: {
            type: Boolean,
            default: false
        },
        tableRow: {
            type: Object,
            default: () => {}
        }
    },
    mounted() {
        this.refreshVerifyCode();
        if(this.tableRow.id){
            this.getDetail();
        }
    },

    methods: {
        onSubmit() {
            this.$refs.formName.validate(async valid => {
                if (valid) {
                    // 处理基金列表
                    let fundList = this.form.fundList;
                    let fundListParams = [];
                    for (let i = 0; i < fundList.length; i++) {
                        if (fundList[i].fundCode != "") {
                            fundListParams.push(fundList[i]);
                        }
                    }
                    // 时间变为时间戳
                    let beginTime = Date.parse(this.form.showTime[0]);
                    let endTime = Date.parse(this.form.showTime[1]);
                    let params = {
                        ...this.form,
                        fundList: fundListParams,
                        beginTime,
                        endTime,
                        [(this.tableRow.id && "id") || ""]: this.tableRow.id
                    };
                    delete params.showTime;
                    delete params.verifyCode;
                    console.log(this.form);
                    try {
                        let response = await this.$api["saveOrUpdate"](
                            params,
                            this.form.verifyCode
                        );
                        if (response.ret === 0) {
                            this.$message.success("保存成功");
                            this.$emit("update:commonDialogVisible", false);
                            this.$parent.init();
                            this.resetForm();
                        } else {
                            // 刷新验证码
                            this.refreshVerifyCode();
                            this.$message.error(response.msg);
                        }
                    } catch (error) {
                        this.refreshVerifyCode();
                        this.$message.error("服务器异常");
                    }
                }
            });
        },
        getDetail() {
            this.tableRow.fundList.forEach((item, idx) => {
                this.form.fundList[idx] = item;
            });
            this.form = {
                ...this.form,
                type: this.tableRow.type,
                /*  showTime: `${this.$mgui.formatDate(
                    this.tableRow.beginTime
                )}-${this.$mgui.formatDate(this.tableRow.endTime)}`, */
                showTime: [
                    this.$mgui.formatDate(this.tableRow.beginTime),
                    this.$mgui.formatDate(this.tableRow.endTime)
                ],
                upStatus: this.tableRow.upStatus
            };
        },
        resetForm() {
            console.log(this.form)
            this.$refs.formName.resetFields();
            this.form.fundList = [
                {
                    fundCode: "",
                    weight: ""
                },
                {
                    fundCode: "",
                    weight: ""
                },
                {
                    fundCode: "",
                    weight: ""
                }
            ];
        },
        beforeClose() {
            console.log(123)
            this.resetForm()
            this.$emit("update:commonDialogVisible", false);
        },
        // 刷新验证码
        refreshVerifyCode() {
            this.codeImgs = this.$mgui.refreshVerifyCode(this.server);
        }
    }
};
</script>

<style lang="less" scoped>
//@imgUrl:'../assets/images';
</style>
