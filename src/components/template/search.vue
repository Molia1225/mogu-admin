<template>
    <!-- 通用弹窗初版，时间有限，未完善，如默认值，功能等，没有注释的地方准备写一份readme说明 -->
    <div>
        <el-form :model="searchModel" :inline="true" label-width="100px" style="width:90%;float:left;">
            <slot name="form"></slot>
            <!-- 表单列表   -->
            <el-form-item v-for="item in searchForm" :key="item.key" :label="item.label">
                <template v-if="item.type==='input'">
                    <el-input v-model.trim="searchModel[item.key]" :placeholder="item.placeholder"
                        maxlength="100" show-word-limit auto-complete="off" type="text"></el-input>
                </template>
                <template v-else-if="item.type==='select'">
                    <el-select v-model="searchModel[item.key]" :placeholder="item.placeholder" @change="onTypeChange">
                        <el-option
                            v-for="it in item.options"
                            :key="it.value"
                            :label="it.label"
                            :value="it.value">
                        </el-option>
                    </el-select>
                </template>
                <template v-else-if="item.type==='date'">
                    <div class="block">
                        <el-date-picker
                            v-model="searchModel[item.key]"
                            value-format='yyyy-MM-dd HH:mm:ss'
                            :placeholder="item.placeholder"
                        >
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="choise">查询</el-button>
                <slot name="button"><slot>
                <!-- <el-button  type="primary"><a class="export-btn" :href="href" download="商品规格列表.xls">导出Exel</a></el-button> -->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'Search',
        props:{
            searchConfig: {
                type: Array,
                default(){
                    return [];
                }
            },
        },
        data () {
            return {
                searchForm:[],
                searchModel:{},
            }
        },
        created(){
            this.init();
        },
        methods:{
            init(){
                this.setsearchForm(searchForm);
            },
            // 设置表单，config必传
            setsearchForm(config=[]){
                let config = JSON.parse( JSON.stringify(this.searchConfig) );
                let obj = {};
                // 初始化数据处理
                config.forEach(item => {
                    if(item.type === 'select'){
                        item.options.unshift({ value: -1, label: '全部' })
                    }
                    obj[item.key] = item.value || (item.value === 0 ? 0 : '');
                });
                this.searchForm = config;
                this.searchModel = obj;
            },
            // 点击确定
            chiose(){
                let condition = {};
                for( let i in this.searchModel){
                    if(this.searchModel[i] !== '' && this.searchModel[i] !== -1){
                        condition[i] = this.searchModel[i]
                    }
                }
                condition.pageNo = 1;
                this.$emit('chiose', condition);
            },
            onTypeChange() {
                
            },
        }
    }
</script>

<style lang="less">

</style>