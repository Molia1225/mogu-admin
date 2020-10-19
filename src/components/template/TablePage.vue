<template>
    <div class="table-page">
        <!-- 搜索、新建 -->
        <div>
            <el-form :inline="true" class="screen-name">
                <el-form-item class="rightBtn">
                    <el-button type="primary" @click="addRow">新建活动</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格 -->
        <div>
            <el-table border :data="tableLists" tooltip-effect="light">
                <el-table-column type="index" label="序号">
                </el-table-column>
                <el-table-column label="创建时间" prop="gmtCreateStr">
                </el-table-column>
                <el-table-column label="上架时间" prop="upTimeStr">
                </el-table-column>
                <el-table-column label="下架时间" prop="downTimeStr">
                </el-table-column>
                <el-table-column label="开始时间" prop="startTimeStr">
                </el-table-column>
                <el-table-column label="结束时间" prop="endTimeStr">
                </el-table-column>
                <el-table-column label="活动奖品">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="gotoEditPrice(scope.$index, scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="中奖查询" min-width="80">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="gotoSeeWinning(scope.$index, scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="shangjiaStatus">
                    <template slot-scope="scope">
                        {{ scope.row.shangjiaStatus==0 ? '下架' : '上架'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="modifyRow(scope.row)" type="text" size="small">修改</el-button>
                        <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="commonDialogTitle" :visible.sync="commonDialogVisible" width="590px" top="40px">
            <CommonForm ref="commonForm" :formConfig='formConfig' :dataGet="formDataGet" @save="confirmUpdate" @close="commonDialogVisible=false" :refreshDialog="refreshDialog" :server="codeServer"></CommonForm>
        </el-dialog>
        <!-- 删除操作 -->
        <el-dialog title="确认删除" :visible.sync="deleteDialogVisible" width="305px" center>
            <div class="is-required verify-code">
                <el-input v-model.trim="delData.verifyCode" auto-complete="off" maxlength="4"></el-input>
                <img @click="refreshVerifyCode" :src="codeImgs" class="verify-code-img">
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    /**
     * 前言，因为后台接口复用做的很乱，每个表格的数据处理处理差异都很大，所以
     * 本模版只是提供一个复制粘贴的原始代码，省去一些通用代码的编写工作
     * 模版建立了一些基本的新增、修改方法，具体的数据处理扔要在代码里面填充
     * 主要起作用的还是表单组件，只需要参照示例使用，省去大多数表单的样式、校验逻辑的编写
     * 只需要配置一下表单对象，在回调里做特殊数据处理。
    */
    import CommonForm from '@/components/template/CommonForm'
    export default {
        name: 'RedPacketRain',
        components: {
            CommonForm
        },
        data() {
            return {
                getListApi: 'onReTableList',  // 初始化获取表格接口
                saveRowApi: 'onReSaveTable',   // 保存接口
                updateRowApi: 'onReSaveTable',  //修改接口
                deleteRowApi: 'onReRemoveTable',
                codeImgs: '',
                codeServer: 'game-mobile',
                refreshDialog: false,
                deleteDialogVisible: false,   // 删除弹窗
                commonDialogVisible: false,   // 公共弹窗，修改、新增等
                commonDialogTitle:"新增",     //公共弹窗名称
                tableLists:[],         // 表格数据
                // 查询接口参数
                requestData: {
                    pageNo: 1,
                    pageSize: 50,
                    type: 20,
                },
                // 删除接口参数
                delData: {
                    tableId: '',
                    verifyCode: ''
                },
                // 表单设置
                formConfig:[
                    {
                        label:'商户名称',
                        key: 'redPacketMerchName',
                        type: 'input',
                        maxlength:10,
                        placeholder:'',
                        value:'',
                        require: true,
                        regExp: null,
                        regTip: '',
                    },
                    {
                        label:'祝福语',
                        key: 'redPacketWishing',
                        type: 'textarea',
                        maxlength: 20,
                        placeholder:'',
                        value:'',
                        require: true,
                        regExp: null,
                        regTip: '',
                    },
                    {
                        label:'每人最大抽奖次数',
                        key: 'playCount',
                        type: 'input',
                        maxlength: 10,
                        placeholder:'',
                        value: 0,
                        require: true,
                        regExp: '^\\d+$',
                        regTip: '每人最大抽奖次数必须是非负整数。',
                    },
                    {
                        label:'每日最大中奖次数',
                        key: 'dayMaxPrizeCount',
                        type: 'input',
                        maxlength: 10,
                        placeholder:'',
                        value: 0,
                        require: true,
                        regExp: '^\\d+$',
                        regTip: '每日最大中奖次数必须是非负整数。',
                    },
                    {
                        label:'最大中奖次数',
                        key: 'maxPrizeCount',
                        type: 'input',
                        maxlength: 10,
                        placeholder:'',
                        value: 0,
                        require: true,
                        regExp: '^\\d+$',
                        regTip: '最大中奖次数必须是非负整数。',
                    },
                    {
                        label:'红包一键领取',
                        key: 'redPacketOneKeyAccept',
                        value: 0,
                        type: 'select',
                        require: true,
                        options:[
                            {
                                value: 0,
                                label: "否"
                            },
                            {
                                value: 1,
                                label: "是"
                            }
                        ],
                    },
                    {
                        label:'上架时间',
                        key: 'updownTime',
                        type: 'date',
                        require: true,
                        keyStart: 'upTimeMil',
                        keyEnd: 'downTimeMil',
                        valStart:'',
                        valEnd:'',
                    },
                    {
                        label:'活动起止时间',
                        key: 'activityTime',
                        type: 'date',
                        require: true,
                        keyStart: 'startTimeMil',
                        keyEnd: 'endTimeMil',
                        valStart:'',
                        valEnd:'',
                    },
                    {
                        label:'上下架',
                        key: 'shangjiaStatus',
                        value: 0,
                        type: 'select',
                        require: true,
                        options:[
                            {
                                value: 0,
                                label: "下架"
                            },
                            {
                                value: 1,
                                label: "上架"
                            }
                        ],
                    },
                ],
                formDataGet: null,
            }
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
                this.$api[this.getListApi](this.requestData).then((res)=>{
                    if(res.ret===0){
                        // 处理获取到的表格数据
                        this.dealTableData(res);
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(()=>{
                    this.$message.error('服务器异常');
                });
            },
            // 处理返回的表格数据
            dealTableData(res){
                let result = res.result;
                for(let i = 0; i < result.length; i++){
                    // 时间展示转化
                    result[i].gmtCreateStr = this.$mgui.formatDate(result[i].gmtCreate);
                    result[i].upTimeStr = this.$mgui.formatDate(result[i].upTime);
                    result[i].downTimeStr = this.$mgui.formatDate(result[i].downTime);
                    result[i].startTimeStr = this.$mgui.formatDate(result[i].startTime);
                    result[i].endTimeStr = this.$mgui.formatDate(result[i].endTime);
                    // 后台修改的接口要的字段跟查询接口给的字段不一样，比较坑
                    result[i].upTimeMil = result[i].upTimeStr;
                    result[i].downTimeMil = result[i].downTimeStr;
                    result[i].startTimeMil = result[i].startTimeStr;
                    result[i].endTimeMil = result[i].endTimeStr;
                }
                this.tableLists = result;
            },
            // 查看奖品
            gotoEditPrice(index, row) {
                this.$router.push({
                    path: '/FestivalList',
                    query: {
                        id: row.id,
                        value:row.type
                    }
                })
            },
            // 查看中奖
            gotoSeeWinning(index, row) {
                this.$router.push({
                    path: '/WinningCheck',
                    query: {
                        id: row.id,
                        value: row.type
                    }
                })
            },
            // 新增
            addRow() {
                this.formDataGet = null;
                this.showCommonDialog('新增');
            },
            // 修改
            modifyRow(row) {
                this.formDataGet = row;
                this.showCommonDialog('修改');
            },
            // 确认修改/新增
            confirmUpdate(result) {
                // 表单数据，特殊数据处理，如增加默认发送的数据（后台经常需要）
                let data = result;
                // 修改判断
                let  api = this.saveRowApi;
                if(this.formDataGet){
                    api = this.updateRowApi;
                }
                this.$api[api](data).then((res)=>{
                    if(res.ret === 0){
                        this.$message.success('保存成功');
                        this.commonDialogVisible = false;
                        // 刷新表格
                        this.getTableData();
                    } else {
                        // 刷新验证码
                        this.$refs.commonForm.refreshVerifyCode();
                        this.$message.error(res.msg);
                    }
                }).catch(()=>{
                    this.$refs.commonForm.refreshVerifyCode();
                    this.$message.error('服务器异常');
                })
            },
            // 点击删除，设置删除参数
            deleteRow(row) {
                this.delData.tableId = row.id;
                this.refreshVerifyCode();
                this.delData.verifyCode = '';
                this.deleteDialogVisible = true;
            },
            // 确认删除
            confirmDelete(){
                this.$api[this.deleteRowApi](this.delData).then((res)=>{
                    this.refreshVerifyCode();
                    if(res.ret === 0){
                        this.$message.success('删除成功');
                        this.deleteDialogVisible = false;
                        // 刷新表格
                        this.getTableData();
                    } else {
                        this.$message.error(res.msg);
                    }
                }).catch(()=>{
                    this.refreshVerifyCode();
                    this.$message.error('服务器异常');
                })
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
            },
        }
    }
</script>


<style lang="less">

</style>
