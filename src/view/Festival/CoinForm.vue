<template>
        <div>
            <el-form-item label="金币名称" class="is-required"  >
                 <el-input v-model="coinConfig.prizeName"  auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="金币图片" class="is-required"  >
                <el-upload   ref="upload"
                :action="actionUrl"
                :http-request="httpRequest"
                :file-list="fileList2"
                list-type="picture"
                :on-success="uploadSuccess"
                :on-remove = "removeimg"
                :limit = '1'
                multiple>
                <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>

            </el-form-item>

            <el-form-item label="首次必中" class="is-required" >
                <el-select v-model="value2" placeholder="请选择">
                    <el-option
                    v-for="item in optionFirst"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="中奖概率" class="is-required"  >
                <el-input v-model="coinConfig.prizeProbability"  auto-complete="off">
                    <template slot="append">%</template>
                </el-input>
            </el-form-item>
            <el-form-item label="奖品价值" class="is-required" >
                <el-input v-model="coinConfig.prizeValue"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="可用份数" class="is-required" >
                <el-input v-model="coinConfig.prizeNum"  auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="上下架" class="is-required" >
                 <el-select v-model="value3" placeholder="请选择">
                <el-option
                v-for="item in optionTop"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="验证码" class="is-required" >
                <el-input v-model="coinConfig.verifyCode"  auto-complete="off"></el-input>
                <img @click="codefile"  :src="codeImgs" style="width:100px;height:33px" class="verifyCodeImg">
            </el-form-item>
        </div>

</template>

<script>
import Bus  from '../../utils/bus'

export default {
    name: '',
    data(){
        return {
            fileList:'',
            fileList2:[],
            base64Str:'',
            actionUrl:'https://ghtest.moguyun.com/game-mobile/intf/web/snsfile/uploadSnsImage',
            fileReader: '',
            codeImgs:'/game-mobile/authImage?r=1543406322836',

            optionFirst: [
                {
                    value: 0,
                    label: "否"
                },
                {
                    value: 1,
                    label: "是"
                }
            ],
            value2: 0,
            optionTop: [
                {
                    value: 0,
                    label: "下架"
                },
                {
                    value: 1,
                    label: "上架"
                }
            ],
            value3: 0,
            coinConfig:{
                prizeName:'',
                prizeSecName:'',
                prizeImage:'',
                firstLuckDraw:'',
                prizeProbability:'',//中奖概率
                prizeNum:'',//可用库存量
                prizeGiveNum:'1',//每单数量
                prizeValue:'',//奖品价值
                shangjiaStatus:'',//上下架
                verifyCode:'',
            },



        }
    },

    created() {


    },

    mounted() {

        if (!window.FileReader) {
        console.error('Your browser does not support FileReader API!')
        }
        this.fileReader = new FileReader();
        Bus.$on('eventCoin',(data)=>{
          this.dataPut(data);
          this.refreshVerifyCode('game')
        });
         this.refreshVerifyCode('game')

    },
   beforeDestroy(){
       Bus.$off('eventCoin')
   },
    methods: {
        //获取父组件传递的值
        dataPut(row){
            this.coinConfig.verifyCode= '';
            this.fileList ='';
            this.value2 = row.firstLuckDraw;
            this.value3 = row.shangjiaStatus;
            this.fileList = row.prizeImage;
            this.coinConfig.prizeName = row.prizeName;
            this.coinConfig.prizeSecName = row.prizeSecName;
            this.coinConfig.prizeProbability = row.prizeProbability;
            this.coinConfig.prizeNum = row.prizeNum;
            // delete this.coinConfig.prizeNum;
            this.coinConfig.prizeGiveNum = row.prizeGiveNum;
            this.coinConfig.prizeValue = row.prizeValue;
            this.fileList2=[{name: 'food.jpeg', url: this.fileList}]
        },
        //给父组件传值
        dataDown(){
            this.coinConfig.firstLuckDraw = this.value2;
            this.coinConfig.shangjiaStatus = this.value3;
            this.coinConfig.prizeImage = this.fileList;
            console.log('1111')
            console.log(this.coinConfig)
            return this.coinConfig;
            // this.$emit("eventCoin",this.coinConfig)
        },
        removeimg(){

        },

        codefile(){
            this.refreshVerifyCode('game')
        },
        refreshVerifyCode: function (server) {
			switch(server) {
                case 'game':
                this.codeImgs = '/game-mobile/authImage?r='+(new Date().getTime())
					break;
				 case 'moni':
				this.codeImgs ='/power-mnjy-mobile/authImage?r='+(new Date().getTime());
                    break;
                 case 'ttkx':
                this.codeImgs ='/game-ttkx-server/authImage?r='+(new Date().getTime());
                     break;
                 case 'guessing':
                this.codeImgs ='/game-guessing-server/authImage?r='+(new Date().getTime());
                    break;
                case 'financial':
                 this.codeImgs ='/financial-shop-server/authImage?r='+(new Date().getTime());
                 break;
			}
        },


        httpRequest (options) {
            let file = options.file
            let filename = file.name
            if (file) {
                this.fileReader.readAsDataURL(file)
            }
            console.log(file)
            this.fileReader.onload = () => {
                this.base64Str = this.fileReader.result;
                let data = {
                fileBase64Str: this.base64Str,
                }

                this.$api.onRequploadSnsImage(data)
                    .then(res => {
                        if(res.ret == 0){
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.fileList = '/game-mobile/intf/sns/snsimage/'+res.result+'?sizeType=origin';
                        }else{
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        }


                    })
                    .catch(err => {

                    })

                }
        },


        uploadSuccess (res, file, fileList) {
            let data = res.data

        },
    }
}
</script>


<style lang="less">


</style>
