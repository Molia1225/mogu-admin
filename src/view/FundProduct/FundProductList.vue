<template>
    <!-- 养成浏览投顾配置页面 -->
    <div class="table-page">
        <!-- 搜索、新建 -->
        <div class="crumbs">
            <el-button type="primary" style="float:right;" @click="addRow">
                新建
            </el-button>
            <el-breadcrumb separator="">
                <el-breadcrumb-item style="cursor: pointer">
                </el-breadcrumb-item>
                <el-breadcrumb-item>基金广告位配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 表格 -->
        <div>
            <el-table border :data="tableLists" tooltip-effect="light">
                <el-table-column label="场次" prop="activityName">
                </el-table-column>
                <el-table-column label="基金代码" prop="fundCode">
                </el-table-column>
                <el-table-column label="展示开始时间" prop="beginTime">
                </el-table-column>
                <el-table-column
                    label="展示结束时间"
                    prop="endTime"
                ></el-table-column>
                <el-table-column label="状态" prop="statusText">
                </el-table-column>
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
        <SaveOrUpdateDialog
            v-if="commonDialogVisible"
            :commonDialogVisible.sync="commonDialogVisible"
            :tableRow="tableRow"
        />
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
// import CommonForm from '@/components/template/CommonForm'
import SaveOrUpdateDialog from "./saveOrUpdate";
export default {
    name: "InfoConfig",
    components: {
        SaveOrUpdateDialog
    },
    data() {
        return {
            getListApi: "getFundList", // 初始化获取表格接口
            deleteRowApi: "deleteFundItem", //删除接口
            codeImgs: "",
            codeServer: "game-ttkx-server",
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
            }
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
                item.beginTime = this.$mgui.formatDate(
                    Number(item.beginTime),
                    "YYYY-MM-DD"
                );
                item.endTime = this.$mgui.formatDate(
                    Number(item.endTime),
                    "YYYY-MM-DD"
                );
                item.fundCode =
                    item.fundList &&
                    item.fundList.map(value => value.fundCode).join(",");
                // item.zxtime = this.$mgui.formatDate(Number(item.newsTime), 'YYYY-MM-DD')
                item.activityName = this.roundType[item.type];
            });
            this.tableLists = result;
        },

        // 新增
        addRow() {
            this.showCommonDialog("新增");
            this.tableRow={}
        },
        // 修改
        modifyRow(row) {
            this.tableRow = row;
            this.showCommonDialog("修改");
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
