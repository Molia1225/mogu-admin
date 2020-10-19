import {get, post} from '@/utils/axios'
import axios from 'axios'

let qs = require('qs');

let server = {
    shop: '/financial-shop-server/intf/h5/',
    mobile: '/game-mobile/intf/web/admin/',
    ttkx: '/game-ttkx-server/intf/web/admin/turn/',
    ttkxbase: '/game-ttkx-server/intf/web/admin/',
    ttkxbase2: '/game-ttkx-server/intf/web/',
    banner:'/game-mobile/intf/web/',
}
export default {

    getCultBaseList: (data) => get(server.ttkx + 'taskConf/admin/list', data),
    //新建奖品上传图片
    onRequploadSnsImage: (data) => post(server.ttkx + 'uploadSnsImage',qs.stringify(data)),
    //新建奖品
    onReqSavePrize: (data) => post(server.ttkx + 'savePrize',qs.stringify(data)),
    //奖品列表
    onRePrizeList: (data) => get(server.ttkx + 'prizeList',data),
    //新建活动
    onReSaveTable: (data) => post(server.ttkx + 'saveTable',qs.stringify(data)),
    //保存配置
    onReSaveRule: (data) => post(server.ttkx +'saveTable',qs.stringify(data)),
    //活动列表
    onReTableList: (data) => post(server.ttkx + 'tableList',qs.stringify(data)),
    // 导入股票
    stockImport: (data) => post(server.ttkxbase + 'quotation/importQuotationInfoDOForExcel',qs.stringify(data)),
    // 导入模板下载
    stockTemplate: (data) => get(server.ttkxbase + 'quotation/exportQuotationTemplatesForExcel',data,{responseType: 'blob'}),
    // 导出中奖名单
    exportPrizeInfo: (data) => get(server.ttkxbase + 'quotation/exportQuotationTemplatesForExcel',data,{responseType: 'blob'}),
    // 查询导入记录
    getImportRecord: (data) => get(server.ttkxbase + 'quotation/queryQuotationImportRecordList',data),
    // 修改详情
    updateStDetail: (data) => post(server.ttkxbase + 'quotation/updateQuotationImportRecordItemById',qs.stringify(data)),
    //结算
    goSettlement: (data) => post(server.ttkxbase + 'quotation/settlementQuotationImportRecord',qs.stringify(data)),
    // 查询详情
    getStDetail: (data) => get(server.ttkxbase + 'quotation/queryQuotationImportRecordItemList',data),
    //中奖查询
    onReQueryUserPrizeByPage: (data) => get(server.ttkx + 'queryUserPrizeByPage',data),
    //删除理财节活动
    onReRemoveTable: (data) => post(server.ttkx + 'removeTable',qs.stringify(data)),
    //删除奖品
    onReRemovePrize: (data) => post(server.ttkx + 'removePrize',qs.stringify(data)),
    //上传图片
    uploadSnsImage: () => ('/file-server/h5/oss/uploadImgToOSSPlcRead'),
    //查询中奖名单
    queryUserPrize: (data) =>  post(server.mobile + 'turn/queryUserPrizeByPage',qs.stringify(data)),
    //上下架,
    updateUpStatus: (data) =>  post(server.mobile + 'turn/updateUpStatus',qs.stringify(data)),
    //Banner列表
    onBannerTableList: (data) => post(server.banner + 'banner/admin/queryBannersByPage',qs.stringify(data)),
    //新增BannerVTwo
    onReSaveBanaVTwo: (data) => post(server.banner + 'banner/admin/createBanner',qs.stringify(data)),
    //修改BannerVTwo
    onReSaveBanaVTwoUP: (data) => post(server.banner + 'banner/admin/updateBanner',qs.stringify(data)),
    //删除BannerVTwo
    onReRemoveBanaVTwo: (data) => post(server.banner + 'banner/admin/deleteBanner',qs.stringify(data)),
    // 查询活动
    getActivityList: (data) => get('/financial-shop-server/intf/web/bountyHunter/admin/activity/list',data),
    // 删除活动
    deleteActivity: (data) => axios.delete('/financial-shop-server/intf/web/bountyHunter/admin/activity',data),
    // 修改活动
    updateActivity: (data) => axios.put('/financial-shop-server/intf/web/bountyHunter/admin/activity',data),
    // 新建活动
    addActivity: (data) => post('/financial-shop-server/intf/web/bountyHunter/admin/activity',data),
    // 图形验证码
    marketAuthImage: () => location.origin + '/game-ttkx-server/authImage?_v=' + Date.now(),
    // 登录
    onReqLogin: (data) => get('/game-ttkx-server/intf/web/admin/user/login', data),
     // 导入题目
     uploadST: () => (server.ttkxbase + 'quotation/importQuotationInfoDOForExcel'),

     // 查询数据字段配置
     queryOrgConfByList: (data) => get('/game-ttkx-server/intf/web/conf/queryOrgConfByList', data),
     
     // 修改数据字段配置
     saveOrgConf: (data) => get('/game-ttkx-server/intf/web/conf/saveOrgConf', data),
    
     // 查询基础基金列表
     queryBasicInfoList: (data) => get('/game-ttkx-server/intf/web/admin/quotation/queryBasicInfoList', data),
     
     // 修改基础基金列表
     updateBasicInfoRate: (data) => get('/game-ttkx-server/intf/web/admin/quotation/updateBasicInfoRate', data),

      // 查询浏览任务
    getNewsList: (data) => get(server.ttkxbase2 + 'new/admin/list', data),
    // 新增浏览任务
    saveNewsRowData: (data) => post(server.ttkxbase2 + 'new/admin/saveOrUpdate', qs.stringify(data)),
    // 删除浏览任务
    deleteNewsRowData: (data) => post(server.ttkxbase2 + 'new/admin/delete', qs.stringify(data)),
    // 修改浏览任务
    updateNewsRowData: (data) => post(server.ttkxbase2 + 'new/admin/saveOrUpdate', qs.stringify(data)),
    // 基金产品列表接口
    getFundList:(data)=>get(server.ttkxbase2 + 'showFundInfo/admin/list',data),
    // 基金产品新增、修改接口
    saveOrUpdate:(data,verifyCode)=>axios.post(`${server.ttkxbase2}showFundInfo/admin/saveOrUpdate?verifyCode=${verifyCode}`,data),
    // 基金列表删除
    deleteFundItem:(data)=>post(server.ttkxbase2 + 'showFundInfo/admin/delete',qs.stringify(data)),
    // 基金上下架
    FundUpStatus:(data)=>post(server.ttkxbase2 + 'showFundInfo/admin/upStatus',qs.stringify(data)),
    // 登录
    login: (data) => get(`/game-ttkx-server/intf/web/admin/user/login`, data),

    // 获取验证码
    refreshVerifyCode: () => { return '/game-ttkx-server/authImage?r=' + new Date().getTime() },
}
