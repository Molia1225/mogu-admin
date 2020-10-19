<template>
    <!-- 资讯配置 -->
    <div class="table-page">
        <!-- 搜索、新建 -->
        <div>
            <el-form :inline="true" class="screen-name">
                <el-form-item class="rightBtn">
                    <el-button type="primary" @click="addRow">新建</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格 -->
        <div>
            <el-table border :data="tableLists" tooltip-effect="light">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="标题" prop="title"></el-table-column>
                <el-table-column
                    label="活动场次"
                    prop="activityName"
                ></el-table-column>
                <el-table-column label="图片" prop="showImg">
                    <template slot-scope="scope">
                        <el-popover placement="right" trigger="hover">
                            <img
                                :src="scope.row.showImg"
                                class="img-icon-preview"
                            />
                            <img
                                slot="reference"
                                :src="scope.row.showImg"
                                class="img-icon"
                            />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    label="跳转链接"
                    prop="skipUrl"
                ></el-table-column>
                <el-table-column label="权重" prop="weight"></el-table-column>
                <el-table-column
                    label="资讯时间"
                    prop="zxtime"
                ></el-table-column>
                <el-table-column
                    label="状态"
                    prop="statusText"
                ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            @click="modifyRow(scope.row)"
                            type="text"
                            size="small"
                            >修改</el-button
                        >
                        <el-button
                            @click="deleteRow(scope.row)"
                            type="text"
                            size="small"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :title="commonDialogTitle"
            :visible.sync="commonDialogVisible"
            width="590px"
            top="40px"
        >
            <CommonForm
                ref="commonForm"
                :formConfig="formConfig"
                :dataGet="formDataGet"
                @save="confirmUpdate"
                @close="commonDialogVisible = false"
                :refreshDialog="refreshDialog"
                :server="codeServer"
            ></CommonForm>
        </el-dialog>
        <!-- 删除操作 -->
        <el-dialog
            title="确认删除"
            :visible.sync="deleteDialogVisible"
            width="305px"
            center
        >
            <div class="is-required verify-code">
                <el-input
                    v-model.trim="delData.verifyCode"
                    auto-complete="off"
                    maxlength="4"
                ></el-input>
                <img
                    @click="refreshVerifyCode"
                    :src="codeImgs"
                    class="verify-code-img"
                />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="confirmDelete"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import CommonForm from "@/components/template/CommonForm";
export default {
    name: "InfoConfig",
    components: {
        CommonForm
    },
    data() {
        return {
            getListApi: "getNewsList", // 初始化获取表格接口
            saveRowApi: "saveNewsRowData", // 保存接口
            updateRowApi: "updateNewsRowData", //修改接口
            deleteRowApi: "deleteNewsRowData", //删除接口
            codeImgs: "",
            codeServer: "game-ttkx-server",
            refreshDialog: false,
            deleteDialogVisible: false, // 删除弹窗
            commonDialogVisible: false, // 公共弹窗，修改、新增等
            commonDialogTitle: "新增", //公共弹窗名称
            tableLists: [], // 表格数据
            roundType: {
                1: "现金管理",
                2: "固收+投资",
                3: "权益投资",
                4: "资产配置"
            },
            // 查询接口参数
            requestData: {
                pageNo: 1,
                pageSize: 100
            },
            // 删除接口参数
            delData: {
                id: "",
                verifyCode: ""
            },
            // 表单设置
            formConfig: [
                {
                    label: "活动场次",
                    key: "type",
                    value: "",
                    type: "select",
                    require: true,
                    options: [
                        {
                            value: 1,
                            label: "现金管理"
                        },
                        {
                            value: 2,
                            label: "固收+投资"
                        },
                        {
                            value: 3,
                            label: "权益投资"
                        },
                        {
                            value: 4,
                            label: "资产配置"
                        }
                    ]
                },
                {
                    label: "标题",
                    key: "title",
                    type: "input",
                    placeholder: "请输入浏览页名称",
                    value: "",
                    require: true,
                    regExp: null,
                    regTip: ""
                },
                /*  {
          label: '图片链接',
          key: 'showImg',
          type: 'input',
          placeholder: '请输入图片链接',
          value: '',
        }, */
                {
                    label: "资讯图片",
                    key: "showImg",
                    type: "img",
                    value: "",
                    require: true
                },
                {
                    label: "跳转链接",
                    key: "skipUrl",
                    type: "input",
                    placeholder: "请选择跳转链接",
                    require: true
                },
                {
                    label: "权重",
                    key: "weight",
                    type: "input",
                    maxlength: 3,
                    placeholder: "请输入权重",
                    value: "",
                    require: true,
                    regExp: "^\\d+$",
                    regTip: "权重必须是非负整数。"
                },
                {
                    label: "资讯时间",
                    key: "newsTime",
                    type: "date",
                    isDatetime: true,
                    require: true,
                    valStart: "",
                    valEnd: ""
                },
                {
                    label: "状态",
                    key: "upStatus",
                    value: 1,
                    type: "select",
                    require: true,
                    options: [
                        {
                            value: 0,
                            label: "下架"
                        },
                        {
                            value: 1,
                            label: "上架"
                        }
                    ]
                }
            ],
            formDataGet: null
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getTableData();
        },
        // 获取表格数据
        getTableData() {
            this.$api[this.getListApi](this.requestData)
                .then(res => {
                    if (res.ret === 0) {
                        if (
                            res.result === null ||
                            res.result.list === null ||
                            res.result.list.length === 0
                        ) {
                            this.tableLists = [];
                            return;
                        }
                        // 处理获取到的表格数据
                        this.dealTableData(res);
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    this.$message.error("服务器异常");
                });
        },
        // 处理返回的表格数据
        dealTableData(res) {
            let result = res.result.list;
            result.forEach(item => {
                item.statusText = item.upStatus == 1 ? "上架" : "下架";
                item.zxtime = this.$mgui.formatDate(
                    Number(item.newsTime),
                    "YYYY-MM-DD"
                );
                item.activityName = this.roundType[item.type];
            });
            this.tableLists = result;
        },

        // 新增
        addRow() {
            this.formDataGet = {};
            this.formDataGet.type = 1;
            this.showCommonDialog("新增");
        },
        // 修改
        modifyRow(row) {
            this.formDataGet = row;
            this.showCommonDialog("修改");
        },
        // 确认修改/新增
        confirmUpdate(result) {
            // 表单数据，特殊数据处理，如增加默认发送的数据（后台经常需要）
            let data = result;
            // 新增、修改判断
            let api = this.saveRowApi;
            data.activityName = this.roundType[data.type];

            if (this.formDataGet) {
                api = this.updateRowApi;
                data.id = this.formDataGet.id;
            }
            data.completeType = "view";

            this.$api[api](data)
                .then(res => {
                    if (res.ret === 0) {
                        this.$message.success("保存成功");
                        this.commonDialogVisible = false;
                        // 刷新表格
                        this.getTableData();
                    } else {
                        // 刷新验证码
                        this.$refs.commonForm.refreshVerifyCode();
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    this.$refs.commonForm.refreshVerifyCode();
                    this.$message.error("服务器异常");
                });
        },
        // 点击删除，设置删除参数
        deleteRow(row) {
            this.delData.id = row.id;
            this.refreshVerifyCode();
            this.delData.verifyCode = "";
            this.deleteDialogVisible = true;
        },
        // 确认删除
        confirmDelete() {
            this.$api[this.deleteRowApi](this.delData)
                .then(res => {
                    this.refreshVerifyCode();
                    if (res.ret === 0) {
                        this.$message.success("删除成功");
                        this.deleteDialogVisible = false;
                        // 刷新表格
                        this.getTableData();
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch(() => {
                    this.refreshVerifyCode();
                    this.$message.error("服务器异常");
                });
        },
        // 显示配置弹窗
        showCommonDialog(title) {
            this.commonDialogTitle = title;
            this.refreshDialog = !this.refreshDialog;
            this.commonDialogVisible = true;
        },
        // 刷新验证码
        refreshVerifyCode() {
            this.codeImgs = this.$mgui.refreshVerifyCode(this.codeServer);
        }
    }
};
</script>

<style lang="less"></style>
