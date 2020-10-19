<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style lang="less">
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    .table-page {
        padding: 10px;
        border-radius: 10px;
        background-color: #fff;
        .rightBtn {
            float: right;
        }
        .el-table th {
            background-color: #f5f5f5;
            .cell {
                font-weight: bolder;
                font-size: 12px;
            }
        }
        .cell {
            text-align: center;
            font-size: 12px;
        }
        > div {
            padding: 10px 0;
        }

    }
    .verify-code-img{
        width:100px;
        height:33px;
        vertical-align: middle;
    }
    .verify-code .el-input{
        width: 140px;
    }
    .el-form-item.is-required .el-form-item__label:before{
        content:'*';
        color:#f56c6c;
        margin-right:4px;
    }
    .el-textarea__inner {
        height: 100px;
        min-height: 100px;
    }
    .img-icon {
        max-width: 100px;
        max-height: 60px;
    }

    .img-icon-preview {
        max-width: 375px;
        max-height: 375px;
    }
</style>